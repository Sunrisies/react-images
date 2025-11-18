import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Folder, 
  File, 
  Clock,
  HardDrive,
  Settings,
  Play,
  Stop
} from 'lucide-react';
import { FileScanner, FileInfo, ScanResult, ScannerConfig } from '@/utils/fileScanner';
import { toast } from 'sonner';

interface FileScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

export const FileScannerComponent: React.FC<FileScannerProps> = ({ onScanComplete }) => {
  const [scanPath, setScanPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [currentFile, setCurrentFile] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<Partial<ScannerConfig>>({
    excludePatterns: [
      'node_modules',
      '.git',
      'dist',
      'build',
      '*.log',
      '*.tmp',
      '.DS_Store'
    ],
    includeHidden: true,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    scanDepth: 10,
    skipSystemDirs: true
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleStartScan = async () => {
    if (!scanPath.trim()) {
      toast.error('Please enter a directory path to scan');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setCurrentFile('');
    setScanResult(null);

    try {
      const scanner = new FileScanner(config);
      
      // Use a mock scan for demonstration (in real app, this would scan actual files)
      const mockResult: ScanResult = {
        files: [
          {
            path: '/Users/zhuzhongqian/Desktop/blog/admin/node_modules/.cache/babel-loader/12345.json',
            size: 15420,
            lastModified: new Date('2024-01-15'),
            type: '.json',
            category: 'cache'
          },
          {
            path: '/Users/zhuzhongqian/Desktop/blog/admin/dist/assets/main.abc123.js',
            size: 245832,
            lastModified: new Date('2024-01-14'),
            type: '.js',
            category: 'compiled'
          },
          {
            path: '/Users/zhuzhongqian/Desktop/blog/admin/.env.local',
            size: 156,
            lastModified: new Date('2024-01-13'),
            type: '.local',
            category: 'config'
          },
          {
            path: '/Users/zhuzhongqian/Desktop/blog/admin/logs/debug.log',
            size: 5242880,
            lastModified: new Date('2024-01-12'),
            type: '.log',
            category: 'log'
          },
          {
            path: '/Users/zhuzhongqian/Desktop/blog/admin/temp/backup.sql.bak',
            size: 10485760,
            lastModified: new Date('2024-01-11'),
            type: '.bak',
            category: 'backup'
          }
        ],
        totalSize: 16234528,
        fileCount: 5,
        categories: {
          cache: { count: 1, size: 15420, files: [] },
          compiled: { count: 1, size: 245832, files: [] },
          config: { count: 1, size: 156, files: [] },
          log: { count: 1, size: 5242880, files: [] },
          backup: { count: 1, size: 10485760, files: [] }
        }
      };

      // Simulate scan progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setScanProgress(i);
        setCurrentFile(`Scanning file ${Math.floor(i / 10)} of 10...`);
      }

      setScanResult(mockResult);
      toast.success('Scan completed successfully!');
      
      if (onScanComplete) {
        onScanComplete(mockResult);
      }

    } catch (error) {
      toast.error('Scan failed: ' + (error as Error).message);
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setCurrentFile('');
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    setCurrentFile('');
    toast.info('Scan stopped by user');
  };

  const handleExportReport = () => {
    if (!scanResult) return;

    const report = generateReport(scanResult);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file-scanner-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const generateReport = (result: ScanResult): string => {
    const lines: string[] = [];
    
    lines.push('='.repeat(60));
    lines.push('FILE SCANNER REPORT');
    lines.push('='.repeat(60));
    lines.push('');
    
    lines.push(`Scan Date: ${new Date().toLocaleString()}`);
    lines.push(`Scan Path: ${scanPath}`);
    lines.push('');
    
    lines.push(`Total Files Found: ${result.fileCount}`);
    lines.push(`Total Size: ${formatFileSize(result.totalSize)}`);
    lines.push('');
    
    lines.push('SUMMARY BY CATEGORY:');
    lines.push('-'.repeat(40));
    
    for (const [category, data] of Object.entries(result.categories).sort((a, b) => b[1].size - a[1].size)) {
      const percentage = ((data.size / result.totalSize) * 100).toFixed(1);
      lines.push(`${category.toUpperCase().padEnd(12)}: ${data.count.toString().padStart(4)} files, ${formatFileSize(data.size).padStart(10)} (${percentage}%)`);
    }
    
    lines.push('');
    lines.push('DETAILED FILE LIST:');
    lines.push('-'.repeat(60));
    
    result.files.forEach((file, index) => {
      lines.push(`${(index + 1).toString().padStart(3)}. [${file.category.toUpperCase()}] ${formatFileSize(file.size).padStart(10)} - ${file.path}`);
      lines.push(`     Modified: ${formatDate(file.lastModified)}`);
      lines.push('');
    });
    
    return lines.join('\n');
  };

  const filteredFiles = scanResult?.files.filter(file => {
    const matchesSearch = file.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      temp: 'bg-red-100 text-red-800',
      compiled: 'bg-orange-100 text-orange-800',
      log: 'bg-yellow-100 text-yellow-800',
      config: 'bg-blue-100 text-blue-800',
      dependency: 'bg-purple-100 text-purple-800',
      cache: 'bg-gray-100 text-gray-800',
      backup: 'bg-pink-100 text-pink-800',
      other: 'bg-slate-100 text-slate-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">File Scanner</h2>
          <p className="text-gray-600">Identify and manage unnecessary project files</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowConfig(!showConfig)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Scanner Configuration</CardTitle>
            <CardDescription>
              Customize scan settings to match your project needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Scan Path</label>
                <Input
                  placeholder="Enter directory path to scan"
                  value={scanPath}
                  onChange={(e) => setScanPath(e.target.value)}
                  disabled={isScanning}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={config.maxFileSize ? config.maxFileSize / (1024 * 1024) : 100}
                  onChange={(e) => setConfig({...config, maxFileSize: parseInt(e.target.value) * 1024 * 1024})}
                  disabled={isScanning}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Scan Depth</label>
                <Input
                  type="number"
                  placeholder="10"
                  value={config.scanDepth}
                  onChange={(e) => setConfig({...config, scanDepth: parseInt(e.target.value)})}
                  disabled={isScanning}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.includeHidden}
                    onChange={(e) => setConfig({...config, includeHidden: e.target.checked})}
                    disabled={isScanning}
                    className="mr-2"
                  />
                  Include Hidden Files
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.skipSystemDirs}
                    onChange={(e) => setConfig({...config, skipSystemDirs: e.target.checked})}
                    disabled={isScanning}
                    className="mr-2"
                  />
                  Skip System Directories
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Exclude Patterns (one per line)</label>
              <textarea
                className="w-full p-2 border rounded-md font-mono text-sm"
                rows={4}
                value={config.excludePatterns?.join('\n') || ''}
                onChange={(e) => setConfig({...config, excludePatterns: e.target.value.split('\n').filter(p => p.trim())})}
                disabled={isScanning}
                placeholder="node_modules&#10;.git&#10;dist&#10;*.log"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Controls</CardTitle>
          <CardDescription>
            Start a scan to identify unnecessary files in your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Enter directory path to scan (e.g., /Users/username/project)"
              value={scanPath}
              onChange={(e) => setScanPath(e.target.value)}
              disabled={isScanning}
              className="flex-1"
            />
            {!isScanning ? (
              <Button onClick={handleStartScan} disabled={!scanPath.trim()}>
                <Play className="w-4 h-4 mr-2" />
                Start Scan
              </Button>
            ) : (
              <Button onClick={handleStopScan} variant="destructive">
                <Stop className="w-4 h-4 mr-2" />
                Stop Scan
              </Button>
            )}
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Scanning...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
              {currentFile && (
                <p className="text-xs text-gray-500 truncate">{currentFile}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scanResult.fileCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatFileSize(scanResult.totalSize)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(scanResult.categories).length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actions</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button size="sm" onClick={handleExportReport} className="w-full">
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Category Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Category Summary</CardTitle>
              <CardDescription>
                Breakdown of unnecessary files by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(scanResult.categories)
                  .sort((a, b) => b[1].size - a[1].size)
                  .map(([category, data]) => {
                    const percentage = ((data.size / scanResult.totalSize) * 100).toFixed(1);
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Badge className={getCategoryColor(category)}>
                              {category.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {data.count} files
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatFileSize(data.size)}</div>
                            <div className="text-xs text-gray-500">{percentage}%</div>
                          </div>
                        </div>
                        <Progress value={parseFloat(percentage)} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Detailed File List</CardTitle>
                  <CardDescription>
                    Complete list of identified unnecessary files
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Categories</option>
                    {Object.keys(scanResult.categories).map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getCategoryColor(file.category)}>
                            {file.category}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {file.type}
                          </span>
                        </div>
                        <p className="font-medium text-sm truncate" title={file.path}>
                          {file.path}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-sm">
                          {formatFileSize(file.size)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(file.lastModified)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredFiles.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No files match your search criteria
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};