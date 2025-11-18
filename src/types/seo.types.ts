// SEO 相关类型定义

export interface SEOSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  siteKeywords: string[];
  author: string;
  language: string;
  charset: string;
  viewport: string;
  robots: string;
  googleSiteVerification?: string;
  baiduSiteVerification?: string;
  bingSiteVerification?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultMetaKeywords?: string[];
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  ogType?: string;
  ogSiteName?: string;
  ogLocale?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface SEOKeyword {
  id?: string;
  keyword: string;
  density: number; // 关键词密度 (0-100)
  searchVolume?: number; // 搜索量
  competition?: 'low' | 'medium' | 'high'; // 竞争度
  category?: string;
  tags?: string[];
  isPrimary?: boolean;
  isLongTail?: boolean;
  relatedKeywords?: string[];
  usageCount?: number; // 使用次数
  performance?: KeywordPerformance;
  createdAt?: string;
  updatedAt?: string;
}

export interface KeywordPerformance {
  clicks?: number;
  impressions?: number;
  ctr?: number; // 点击率
  position?: number; // 平均排名
  date?: string;
}

export interface SEOMetaTags {
  id?: string;
  pageId: string;
  pageType: 'article' | 'category' | 'tag' | 'home' | 'custom';
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
  nosnippet?: boolean;
  noarchive?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
  customMeta?: CustomMetaTag[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomMetaTag {
  name: string;
  content: string;
  property?: string;
  httpEquiv?: string;
}

export interface SEOSitemap {
  id?: string;
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number; // 0.0 - 1.0
  type: 'article' | 'category' | 'tag' | 'page' | 'custom';
  images?: SitemapImage[];
  videos?: SitemapVideo[];
  news?: SitemapNews[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SitemapImage {
  loc: string; // Image URL
  title?: string;
  caption?: string;
  geo_location?: string;
  license?: string;
}

export interface SitemapVideo {
  thumbnail_loc: string;
  title: string;
  description: string;
  content_loc?: string;
  player_loc?: string;
  duration?: number;
  expiration_date?: string;
  rating?: number;
  view_count?: number;
  publication_date?: string;
  family_friendly?: boolean;
  tag?: string[];
  category?: string;
  restriction?: {
    relationship: 'allow' | 'deny';
    countries: string[];
  };
}

export interface SitemapNews {
  name: string;
  language: string;
  publication_date: string;
  title: string;
  keywords?: string[];
  stock_tickers?: string[];
}

export interface SEOAnalysis {
  id?: string;
  pageId: string;
  pageUrl: string;
  pageType: string;
  score: number; // 0-100
  issues: SEOIssue[];
  recommendations: string[];
  keywords: SEOKeyword[];
  metaTags: SEOMetaTags;
  contentAnalysis: ContentAnalysis;
  technicalAnalysis: TechnicalAnalysis;
  analyzedAt?: string;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'content' | 'technical' | 'meta' | 'structure' | 'performance';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  fix?: string;
  impact?: string;
}

export interface ContentAnalysis {
  wordCount: number;
  readingTime: number; // minutes
  keywordDensity: Record<string, number>;
  headingStructure: HeadingStructure;
  imageCount: number;
  linkCount: {
    internal: number;
    external: number;
    broken: number;
  };
  duplicateContent?: boolean;
  thinContent?: boolean;
}

export interface HeadingStructure {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
  hierarchy: boolean; // 是否遵循正确的层级结构
}

export interface TechnicalAnalysis {
  pageSpeed: number; // 0-100
  mobileFriendly: boolean;
  sslEnabled: boolean;
  structuredData: boolean;
  canonicalUrl?: string;
  hreflang?: string[];
  ampAvailable?: boolean;
  coreWebVitals: CoreWebVitals;
  accessibility: AccessibilityScore;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint (seconds)
  fid: number; // First Input Delay (milliseconds)
  cls: number; // Cumulative Layout Shift (score)
  fcp: number; // First Contentful Paint (seconds)
  ttfb: number; // Time to First Byte (seconds)
}

export interface AccessibilityScore {
  score: number; // 0-100
  issues: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'notice';
  title: string;
  description: string;
  selector?: string;
  fix?: string;
}

export interface SEOCompetitor {
  id?: string;
  domain: string;
  keywords: string[];
  rankings: CompetitorRanking[];
  backlinks: number;
  domainAuthority: number; // 0-100
  pageAuthority: number; // 0-100
  organicTraffic?: number;
  topPages?: CompetitorPage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CompetitorRanking {
  keyword: string;
  position: number;
  url: string;
  searchVolume: number;
  difficulty: number; // 0-100
}

export interface CompetitorPage {
  url: string;
  title: string;
  traffic: number;
  keywords: number;
  backlinks: number;
  socialShares: number;
}

export interface SEORanking {
  id?: string;
  keyword: string;
  position: number;
  previousPosition?: number;
  url: string;
  searchVolume: number;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  date: string;
  searchEngine: 'google' | 'bing' | 'baidu' | 'yahoo' | 'duckduckgo';
  device: 'desktop' | 'mobile' | 'tablet';
  location?: string;
  language?: string;
}

export interface SEORedirect {
  id?: string;
  from: string;
  to: string;
  type: 301 | 302 | 307 | 308;
  isActive: boolean;
  hits: number;
  lastHit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SEOLink {
  id?: string;
  url: string;
  anchor: string;
  type: 'internal' | 'external';
  rel?: string;
  target?: string;
  pageId: string;
  position: number;
  isBroken: boolean;
  isNofollow: boolean;
  isSponsored: boolean;
  isUgC: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SEOReport {
  id?: string;
  type: 'full' | 'keywords' | 'technical' | 'content' | 'competitors';
  title: string;
  description?: string;
  dateRange: {
    start: string;
    end: string;
  };
  metrics: SEOReportMetrics;
  insights: SEOInsight[];
  recommendations: SEORecommendation[];
  createdAt?: string;
  generatedBy?: string;
}

export interface SEOReportMetrics {
  totalPages: number;
  optimizedPages: number;
  averageScore: number;
  keywordRankings: {
    top3: number;
    top10: number;
    top50: number;
    total: number;
  };
  trafficMetrics: {
    organic: number;
    paid: number;
    referral: number;
    direct: number;
  };
  technicalIssues: {
    errors: number;
    warnings: number;
    info: number;
  };
}

export interface SEOInsight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  data?: Record<string, any>;
}

export interface SEORecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedImpact?: string;
  effort?: 'low' | 'medium' | 'high';
  implementation?: string;
}

// API 响应类型
export interface SEOApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 搜索和过滤选项
export interface SEOKeywordFilter {
  category?: string;
  competition?: 'low' | 'medium' | 'high';
  isPrimary?: boolean;
  isLongTail?: boolean;
  searchVolumeMin?: number;
  searchVolumeMax?: number;
  tags?: string[];
  sortBy?: 'keyword' | 'searchVolume' | 'competition' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SEOAnalysisFilter {
  pageType?: string;
  scoreMin?: number;
  scoreMax?: number;
  issueType?: 'error' | 'warning' | 'info';
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SEORankingFilter {
  keyword?: string;
  searchEngine?: string;
  device?: string;
  positionMin?: number;
  positionMax?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}