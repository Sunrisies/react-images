import fs from 'fs';
import path from 'path';

export interface FileInfo {
  path: string;
  size: number;
  lastModified: Date;
  type: string;
  category: 'temp' | 'compiled' | 'log' | 'config' | 'dependency' | 'cache' | 'backup' | 'other';
}

export interface ScanResult {
  files: FileInfo[];
  totalSize: number;
  fileCount: number;
  categories: Record<string, {
    count: number;
    size: number;
    files: FileInfo[];
  }>;
}

export interface ScannerConfig {
  excludePatterns: string[];
  includeHidden: boolean;
  maxFileSize: number; // in bytes
  scanDepth: number;
  skipSystemDirs: boolean;
}

const DEFAULT_CONFIG: ScannerConfig = {
  excludePatterns: [
    'node_modules',
    '.git',
    '.svn',
    '.hg',
    'dist',
    'build',
    'coverage',
    '.next',
    '.nuxt',
    '.cache',
    '.parcel-cache',
    '.eslintcache',
    '*.log',
    '*.tmp',
    '*.temp',
    '*.bak',
    '*.backup',
    '*.swp',
    '*.swo',
    '*~',
    '.DS_Store',
    'Thumbs.db',
    '*.pid',
    '*.seed',
    '*.pid.lock',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local'
  ],
  includeHidden: true,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  scanDepth: 10,
  skipSystemDirs: true
};

const UNNECESSARY_FILE_PATTERNS = {
  temp: [
    /\.tmp$/i,
    /\.temp$/i,
    /\.bak$/i,
    /\.backup$/i,
    /\.swp$/i,
    /\.swo$/i,
    /~$/i,
    /\.old$/i,
    /\.orig$/i,
    /\.rej$/i,
    /\.merge$/i
  ],
  compiled: [
    /\.class$/i,
    /\.o$/i,
    /\.obj$/i,
    /\.exe$/i,
    /\.dll$/i,
    /\.so$/i,
    /\.dylib$/i,
    /\.pyc$/i,
    /\.pyo$/i,
    /\.jar$/i,
    /\.war$/i,
    /\.ear$/i
  ],
  log: [
    /\.log$/i,
    /\.logs$/i,
    /\.out$/i,
    /\.err$/i,
    /\.error$/i,
    /\.debug$/i,
    /\.trace$/i
  ],
  config: [
    /\.idea$/i,
    /\.vscode$/i,
    /\.vs$/i,
    /\.settings$/i,
    /\.project$/i,
    /\.classpath$/i,
    /\.factorypath$/i
  ],
  dependency: [
    /node_modules$/i,
    /bower_components$/i,
    /jspm_packages$/i,
    /vendor$/i,
    /venv$/i,
    /\.venv$/i,
    /__pycache__$/i,
    /\.pytest_cache$/i,
    /\.mypy_cache$/i
  ],
  cache: [
    /\.cache$/i,
    /\.npm$/i,
    /\.yarn$/i,
    /\.parcel-cache$/i,
    /\.next$/i,
    /\.nuxt$/i,
    /\.nyc_output$/i,
    /coverage$/i,
    /\.eslintcache$/i,
    /\.stylelintcache$/i
  ],
  backup: [
    /\.backup$/i,
    /\.backups$/i,
    /\.archive$/i,
    /\.archives$/i,
    /\.old$/i,
    /\.previous$/i
  ]
};

const SYSTEM_DIRS = [
  '.git',
  '.svn',
  '.hg',
  'CVS',
  '.DS_Store',
  'Thumbs.db',
  'desktop.ini',
  '.Trash',
  '.Trashes'
];

export class FileScanner {
  private config: ScannerConfig;

  constructor(config: Partial<ScannerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async scanDirectory(dirPath: string, currentDepth = 0): Promise<ScanResult> {
    const result: ScanResult = {
      files: [],
      totalSize: 0,
      fileCount: 0,
      categories: {}
    };

    if (currentDepth > this.config.scanDepth) {
      return result;
    }

    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        // Skip system directories if configured
        if (this.config.skipSystemDirs && SYSTEM_DIRS.includes(entry.name)) {
          continue;
        }

        // Skip hidden files/directories if not included
        if (!this.config.includeHidden && entry.name.startsWith('.')) {
          continue;
        }

        // Check exclude patterns
        if (this.shouldExclude(fullPath)) {
          continue;
        }

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subResult = await this.scanDirectory(fullPath, currentDepth + 1);
          result.files.push(...subResult.files);
          result.totalSize += subResult.totalSize;
          result.fileCount += subResult.fileCount;
          
          // Merge categories
          for (const [category, data] of Object.entries(subResult.categories)) {
            if (!result.categories[category]) {
              result.categories[category] = { count: 0, size: 0, files: [] };
            }
            result.categories[category].count += data.count;
            result.categories[category].size += data.size;
            result.categories[category].files.push(...data.files);
          }
        } else if (entry.isFile()) {
          const fileInfo = await this.analyzeFile(fullPath);
          if (fileInfo) {
            result.files.push(fileInfo);
            result.totalSize += fileInfo.size;
            result.fileCount++;
            
            if (!result.categories[fileInfo.category]) {
              result.categories[fileInfo.category] = { count: 0, size: 0, files: [] };
            }
            result.categories[fileInfo.category].count++;
            result.categories[fileInfo.category].size += fileInfo.size;
            result.categories[fileInfo.category].files.push(fileInfo);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
    }

    return result;
  }

  private async analyzeFile(filePath: string): Promise<FileInfo | null> {
    try {
      const stats = await fs.promises.stat(filePath);
      
      // Skip files larger than max size
      if (stats.size > this.config.maxFileSize) {
        return null;
      }

      const fileName = path.basename(filePath);
      const ext = path.extname(fileName).toLowerCase();
      const category = this.categorizeFile(fileName, ext);

      return {
        path: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        type: ext || 'no-extension',
        category
      };
    } catch (error) {
      console.warn(`Warning: Could not analyze file ${filePath}:`, error);
      return null;
    }
  }

  private categorizeFile(fileName: string, ext: string): FileInfo['category'] {
    // Check each category pattern
    for (const [category, patterns] of Object.entries(UNNECESSARY_FILE_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(fileName) || pattern.test(ext)) {
          return category as FileInfo['category'];
        }
      }
    }

    // Check for common unnecessary files by extension
    const unnecessaryExtensions = {
      temp: ['.tmp', '.temp', '.bak', '.backup', '.swp', '.swo', '.old', '.orig'],
      log: ['.log', '.out', '.err', '.debug', '.trace'],
      compiled: ['.class', '.o', '.obj', '.exe', '.dll', '.so', '.dylib', '.pyc', '.pyo'],
      cache: ['.cache', '.eslintcache', '.stylelintcache']
    };

    for (const [category, extensions] of Object.entries(unnecessaryExtensions)) {
      if (extensions.includes(ext)) {
        return category as FileInfo['category'];
      }
    }

    return 'other';
  }

  private shouldExclude(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    return this.config.excludePatterns.some(pattern => {
      // Convert glob-like patterns to regex
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      
      const regex = new RegExp(regexPattern, 'i');
      return regex.test(normalizedPath) || normalizedPath.includes(pattern);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }

  generateReport(result: ScanResult): string {
    const lines: string[] = [];
    
    lines.push('='.repeat(60));
    lines.push('FILE SCANNER REPORT');
    lines.push('='.repeat(60));
    lines.push('');
    
    lines.push(`Total Files Found: ${result.fileCount}`);
    lines.push(`Total Size: ${this.formatFileSize(result.totalSize)}`);
    lines.push('');
    
    lines.push('SUMMARY BY CATEGORY:');
    lines.push('-'.repeat(40));
    
    for (const [category, data] of Object.entries(result.categories).sort((a, b) => b[1].size - a[1].size)) {
      const percentage = ((data.size / result.totalSize) * 100).toFixed(1);
      lines.push(`${category.toUpperCase().padEnd(12)}: ${data.count.toString().padStart(4)} files, ${this.formatFileSize(data.size).padStart(10)} (${percentage}%)`);
    }
    
    lines.push('');
    lines.push('TOP 10 LARGEST FILES:');
    lines.push('-'.repeat(40));
    
    const largestFiles = result.files
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    largestFiles.forEach((file, index) => {
      lines.push(`${(index + 1).toString().padStart(2)}. ${this.formatFileSize(file.size).padStart(10)} - ${file.path}`);
    });
    
    lines.push('');
    lines.push('RECENTLY MODIFIED FILES (Last 7 days):');
    lines.push('-'.repeat(40));
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentFiles = result.files
      .filter(file => file.lastModified > sevenDaysAgo)
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
      .slice(0, 10);
    
    recentFiles.forEach(file => {
      const dateStr = file.lastModified.toLocaleDateString();
      lines.push(`${dateStr.padStart(12)} - ${this.formatFileSize(file.size).padStart(8)} - ${file.path}`);
    });
    
    return lines.join('\n');
  }

  async scanWithProgress(
    dirPath: string, 
    onProgress?: (current: number, total: number, currentFile: string) => void
  ): Promise<ScanResult> {
    const startTime = Date.now();
    let processedFiles = 0;
    let totalFiles = 0;
    
    // First pass: count total files
    const countResult = await this.scanDirectory(dirPath);
    totalFiles = countResult.fileCount;
    
    // Second pass: actual scan with progress
    const result = await this.scanDirectory(dirPath);
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    
    console.log(`Scan completed in ${this.formatDuration(duration)}`);
    console.log(`Found ${result.fileCount} unnecessary files`);
    console.log(`Total size: ${this.formatFileSize(result.totalSize)}`);
    
    return result;
  }
}

// CLI interface
export async function scanProjectFiles(
  projectPath: string = process.cwd(),
  options: Partial<ScannerConfig> = {},
  outputFormat: 'console' | 'file' = 'console'
): Promise<void> {
  const scanner = new FileScanner(options);
  
  try {
    console.log(`🔍 Scanning project directory: ${projectPath}`);
    console.log('This may take a few moments...\n');
    
    const result = await scanner.scanWithProgress(projectPath, (current, total, currentFile) => {
      if (total > 0) {
        const percentage = Math.floor((current / total) * 100);
        process.stdout.write(`\r📊 Progress: ${percentage}% (${current}/${total} files) - ${currentFile}`);
      }
    });
    
    console.log('\n\n'); // New line after progress
    
    const report = scanner.generateReport(result);
    
    if (outputFormat === 'console') {
      console.log(report);
    } else {
      const reportPath = path.join(projectPath, 'file-scanner-report.txt');
      await fs.promises.writeFile(reportPath, report);
      console.log(`📄 Report saved to: ${reportPath}`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Scan completed successfully!`);
    console.log(`📊 Found ${result.fileCount} unnecessary files`);
    console.log(`💾 Total size: ${scanner.formatFileSize(result.totalSize)}`);
    console.log(`🗂️  Categories: ${Object.keys(result.categories).length}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Scan failed:', error);
    throw error;
  }
}

export default FileScanner;