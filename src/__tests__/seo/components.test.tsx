import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock toast notifications
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock SEO services
vi.mock('@/services/seo', () => ({
  seoService: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    getKeywords: vi.fn(),
    createKeyword: vi.fn(),
    updateKeyword: vi.fn(),
    deleteKeyword: vi.fn(),
    analyzeKeyword: vi.fn(),
    getSitemaps: vi.fn(),
    generateSitemap: vi.fn(),
    submitSitemap: vi.fn(),
    getMetaTags: vi.fn(),
    updateMetaTags: vi.fn(),
    getLinks: vi.fn(),
    analyzeLinks: vi.fn(),
    getSEOScore: vi.fn(),
    analyzePage: vi.fn(),
    getCompetitors: vi.fn(),
    addCompetitor: vi.fn(),
    analyzeCompetitor: vi.fn(),
    getRankings: vi.fn(),
    trackRanking: vi.fn(),
  },
}));

// Mock SEO hooks
vi.mock('@/hooks/useSEOSettings', () => ({
  useSEOSettings: () => ({
    settings: {
      siteName: 'Test Site',
      siteUrl: 'https://example.com',
      language: 'zh-CN',
    },
    updateSettings: vi.fn(),
    resetSettings: vi.fn(),
    validateRobotsTxt: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useSEOKeywords', () => ({
  useSEOKeywords: () => ({
    keywords: [
      {
        id: '1',
        keyword: 'test keyword',
        density: 2.5,
        priority: 'high',
        searchVolume: 1000,
        competition: 'medium',
      },
    ],
    createKeyword: vi.fn(),
    updateKeyword: vi.fn(),
    deleteKeyword: vi.fn(),
    analyzeKeyword: vi.fn(),
    bulkAnalyze: vi.fn(),
    importKeywords: vi.fn(),
    exportKeywords: vi.fn(),
    getSuggestions: vi.fn(),
    analyzeDensity: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useSEOSitemaps', () => ({
  useSEOSitemaps: () => ({
    sitemaps: [
      {
        id: '1',
        name: 'Test Sitemap',
        url: 'https://example.com/sitemap.xml',
        type: 'xml',
        status: 'active',
      },
    ],
    generateSitemap: vi.fn(),
    submitSitemap: vi.fn(),
    validateSitemap: vi.fn(),
    deleteSitemap: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useSEOMetaTags', () => ({
  useSEOMetaTags: () => ({
    metaTags: [
      {
        id: '1',
        pageUrl: 'https://example.com/page',
        title: 'Test Page Title',
        description: 'Test Page Description',
      },
    ],
    updateMetaTags: vi.fn(),
    generateMetaTags: vi.fn(),
    validateMetaTags: vi.fn(),
    createTemplate: vi.fn(),
    applyTemplate: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useSEOLinks', () => ({
  useSEOLinks: () => ({
    links: {
      internal: [
        {
          url: 'https://example.com/page1',
          anchor: 'Page 1',
          status: 'active',
        },
      ],
      external: [
        {
          url: 'https://external.com/page',
          anchor: 'External Page',
          status: 'active',
          nofollow: true,
        },
      ],
      broken: [
        {
          url: 'https://example.com/broken',
          anchor: 'Broken Link',
          status: 'broken',
          error: '404 Not Found',
        },
      ],
    },
    analyzeLinks: vi.fn(),
    fixBrokenLink: vi.fn(),
    suggestInternalLinks: vi.fn(),
    updateExternalLink: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useSEOAnalysis', () => ({
  useSEOAnalysis: () => ({
    seoScore: {
      overallScore: 85,
      pageSpeed: 90,
      mobileScore: 88,
      contentScore: 82,
      technicalScore: 87,
      issues: [
        {
          type: 'warning',
          category: 'content',
          message: 'Missing alt text on images',
          severity: 'medium',
          suggestion: 'Add alt text to all images',
        },
      ],
    },
    analyzePage: vi.fn(),
    analyzeSite: vi.fn(),
    getSuggestions: vi.fn(),
    fixIssue: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useSEOCompetitors', () => ({
  useSEOCompetitors: () => ({
    competitors: [
      {
        id: '1',
        name: 'Test Competitor',
        domain: 'competitor.com',
        status: 'active',
      },
    ],
    addCompetitor: vi.fn(),
    removeCompetitor: vi.fn(),
    analyzeCompetitor: vi.fn(),
    compareKeywords: vi.fn(),
    compareBacklinks: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useSEORankings', () => ({
  useSEORankings: () => ({
    rankings: [
      {
        id: '1',
        keyword: 'test keyword',
        url: 'https://example.com/page',
        position: 5,
        previousPosition: 8,
        change: 3,
        searchEngine: 'google',
        device: 'desktop',
      },
    ],
    trackRanking: vi.fn(),
    getHistoricalData: vi.fn(),
    exportRankings: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('SEO Components Tests', () => {
  describe('SEO Dashboard', () => {
    it('should render SEO dashboard with all tabs', async () => {
      const { SEODashboard } = await import('@/pages/seo/dashboard');
      
      render(<SEODashboard />, { wrapper: createWrapper() });

      expect(screen.getByText('SEO 优化中心')).toBeInTheDocument();
      expect(screen.getByText('设置')).toBeInTheDocument();
      expect(screen.getByText('关键词')).toBeInTheDocument();
      expect(screen.getByText('站点地图')).toBeInTheDocument();
      expect(screen.getByText('Meta 标签')).toBeInTheDocument();
      expect(screen.getByText('链接优化')).toBeInTheDocument();
      expect(screen.getByText('SEO 评分')).toBeInTheDocument();
      expect(screen.getByText('竞争对手')).toBeInTheDocument();
      expect(screen.getByText('排名跟踪')).toBeInTheDocument();
    });

    it('should switch between tabs correctly', async () => {
      const { SEODashboard } = await import('@/pages/seo/dashboard');
      
      render(<SEODashboard />, { wrapper: createWrapper() });

      const keywordsTab = screen.getByText('关键词');
      fireEvent.click(keywordsTab);

      await waitFor(() => {
        expect(screen.getByText('test keyword')).toBeInTheDocument();
      });
    });
  });

  describe('SEO Settings Panel', () => {
    it('should render settings panel with tabs', async () => {
      const { SEOSettingsPanel } = await import('@/components/seo/SEOSettingsPanel');
      
      render(<SEOSettingsPanel />, { wrapper: createWrapper() });

      expect(screen.getByText('SEO 设置')).toBeInTheDocument();
      expect(screen.getByText('常规设置')).toBeInTheDocument();
      expect(screen.getByText('Meta 设置')).toBeInTheDocument();
      expect(screen.getByText('爬取设置')).toBeInTheDocument();
      expect(screen.getByText('高级设置')).toBeInTheDocument();
    });

    it('should display current settings', async () => {
      const { SEOSettingsPanel } = await import('@/components/seo/SEOSettingsPanel');
      
      render(<SEOSettingsPanel />, { wrapper: createWrapper() });

      expect(screen.getByDisplayValue('Test Site')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
    });

    it('should handle form submissions', async () => {
      const { SEOSettingsPanel } = await import('@/components/seo/SEOSettingsPanel');
      const { useSEOSettings } = await import('@/hooks/useSEOSettings');
      
      render(<SEOSettingsPanel />, { wrapper: createWrapper() });

      const siteNameInput = screen.getByDisplayValue('Test Site');
      fireEvent.change(siteNameInput, { target: { value: 'Updated Site' } });

      const saveButton = screen.getByText('保存设置');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(useSEOSettings().updateSettings).toHaveBeenCalled();
      });
    });
  });

  describe('Keyword Management', () => {
    it('should render keyword management interface', async () => {
      const { KeywordManagement } = await import('@/components/seo/KeywordManagement');
      
      render(<KeywordManagement />, { wrapper: createWrapper() });

      expect(screen.getByText('关键词管理')).toBeInTheDocument();
      expect(screen.getByText('test keyword')).toBeInTheDocument();
      expect(screen.getByText('高')).toBeInTheDocument();
    });

    it('should handle keyword search and filtering', async () => {
      const { KeywordManagement } = await import('@/components/seo/KeywordManagement');
      
      render(<KeywordManagement />, { wrapper: createWrapper() });

      const searchInput = screen.getByPlaceholderText('搜索关键词...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByText('test keyword')).toBeInTheDocument();
      });
    });

    it('should handle keyword creation', async () => {
      const { KeywordManagement } = await import('@/components/seo/KeywordManagement');
      const { useSEOKeywords } = await import('@/hooks/useSEOKeywords');
      
      render(<KeywordManagement />, { wrapper: createWrapper() });

      const addButton = screen.getByText('添加关键词');
      fireEvent.click(addButton);

      const keywordInput = screen.getByPlaceholderText('输入关键词');
      fireEvent.change(keywordInput, { target: { value: 'new keyword' } });

      const saveButton = screen.getByText('保存');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(useSEOKeywords().createKeyword).toHaveBeenCalledWith({
          keyword: 'new keyword',
          priority: 'medium',
        });
      });
    });
  });

  describe('Sitemap Generator', () => {
    it('should render sitemap generator interface', async () => {
      const { SitemapGenerator } = await import('@/components/seo/SitemapGenerator');
      
      render(<SitemapGenerator />, { wrapper: createWrapper() });

      expect(screen.getByText('站点地图生成器')).toBeInTheDocument();
      expect(screen.getByText('Test Sitemap')).toBeInTheDocument();
      expect(screen.getByText('https://example.com/sitemap.xml')).toBeInTheDocument();
    });

    it('should handle sitemap generation', async () => {
      const { SitemapGenerator } = await import('@/components/seo/SitemapGenerator');
      const { useSEOSitemaps } = await import('@/hooks/useSEOSitemaps');
      
      render(<SitemapGenerator />, { wrapper: createWrapper() });

      const generateButton = screen.getByText('生成站点地图');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(useSEOSitemaps().generateSitemap).toHaveBeenCalled();
      });
    });

    it('should handle sitemap submission', async () => {
      const { SitemapGenerator } = await import('@/components/seo/SitemapGenerator');
      const { useSEOSitemaps } = await import('@/hooks/useSEOSitemaps');
      
      render(<SitemapGenerator />, { wrapper: createWrapper() });

      const submitButton = screen.getByText('提交搜索引擎');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(useSEOSitemaps().submitSitemap).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Meta Tags Manager', () => {
    it('should render meta tags manager interface', async () => {
      const { MetaTagsManager } = await import('@/components/seo/MetaTagsManager');
      
      render(<MetaTagsManager />, { wrapper: createWrapper() });

      expect(screen.getByText('Meta 标签管理')).toBeInTheDocument();
      expect(screen.getByText('Test Page Title')).toBeInTheDocument();
      expect(screen.getByText('Test Page Description')).toBeInTheDocument();
    });

    it('should handle meta tag editing', async () => {
      const { MetaTagsManager } = await import('@/components/seo/MetaTagsManager');
      const { useSEOMetaTags } = await import('@/hooks/useSEOMetaTags');
      
      render(<MetaTagsManager />, { wrapper: createWrapper() });

      const editButton = screen.getByText('编辑');
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Test Page Title');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      const saveButton = screen.getByText('保存');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(useSEOMetaTags().updateMetaTags).toHaveBeenCalled();
      });
    });

    it('should handle meta tag templates', async () => {
      const { MetaTagsManager } = await import('@/components/seo/MetaTagsManager');
      const { useSEOMetaTags } = await import('@/hooks/useSEOMetaTags');
      
      render(<MetaTagsManager />, { wrapper: createWrapper() });

      const templateButton = screen.getByText('模板');
      fireEvent.click(templateButton);

      await waitFor(() => {
        expect(screen.getByText('Meta 标签模板')).toBeInTheDocument();
      });
    });
  });

  describe('Link Optimizer', () => {
    it('should render link optimizer interface', async () => {
      const { LinkOptimizer } = await import('@/components/seo/LinkOptimizer');
      
      render(<LinkOptimizer />, { wrapper: createWrapper() });

      expect(screen.getByText('链接优化')).toBeInTheDocument();
      expect(screen.getByText('内部链接')).toBeInTheDocument();
      expect(screen.getByText('外部链接')).toBeInTheDocument();
      expect(screen.getByText('死链')).toBeInTheDocument();
    });

    it('should display link statistics', async () => {
      const { LinkOptimizer } = await import('@/components/seo/LinkOptimizer');
      
      render(<LinkOptimizer />, { wrapper: createWrapper() });

      expect(screen.getByText('Page 1')).toBeInTheDocument();
      expect(screen.getByText('External Page')).toBeInTheDocument();
      expect(screen.getByText('Broken Link')).toBeInTheDocument();
    });

    it('should handle broken link fixing', async () => {
      const { LinkOptimizer } = await import('@/components/seo/LinkOptimizer');
      const { useSEOLinks } = await import('@/hooks/useSEOLinks');
      
      render(<LinkOptimizer />, { wrapper: createWrapper() });

      const fixButton = screen.getByText('修复');
      fireEvent.click(fixButton);

      await waitFor(() => {
        expect(useSEOLinks().fixBrokenLink).toHaveBeenCalledWith('https://example.com/broken');
      });
    });
  });

  describe('SEO Score Dashboard', () => {
    it('should render SEO score dashboard', async () => {
      const { SEOScoreDashboard } = await import('@/components/seo/SEOScoreDashboard');
      
      render(<SEOScoreDashboard />, { wrapper: createWrapper() });

      expect(screen.getByText('SEO 评分面板')).toBeInTheDocument();
      expect(screen.getByText('总体评分')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
    });

    it('should display detailed SEO metrics', async () => {
      const { SEOScoreDashboard } = await import('@/components/seo/SEOScoreDashboard');
      
      render(<SEOScoreDashboard />, { wrapper: createWrapper() });

      expect(screen.getByText('页面速度')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
      expect(screen.getByText('移动优化')).toBeInTheDocument();
      expect(screen.getByText('88')).toBeInTheDocument();
      expect(screen.getByText('内容质量')).toBeInTheDocument();
      expect(screen.getByText('82')).toBeInTheDocument();
      expect(screen.getByText('技术优化')).toBeInTheDocument();
      expect(screen.getByText('87')).toBeInTheDocument();
    });

    it('should display SEO issues and suggestions', async () => {
      const { SEOScoreDashboard } = await import('@/components/seo/SEOScoreDashboard');
      
      render(<SEOScoreDashboard />, { wrapper: createWrapper() });

      expect(screen.getByText('Missing alt text on images')).toBeInTheDocument();
      expect(screen.getByText('Add alt text to all images')).toBeInTheDocument();
    });
  });

  describe('Competitor Analysis', () => {
    it('should render competitor analysis interface', async () => {
      const { CompetitorAnalysis } = await import('@/components/seo/CompetitorAnalysis');
      
      render(<CompetitorAnalysis />, { wrapper: createWrapper() });

      expect(screen.getByText('竞争对手分析')).toBeInTheDocument();
      expect(screen.getByText('Test Competitor')).toBeInTheDocument();
      expect(screen.getByText('competitor.com')).toBeInTheDocument();
    });

    it('should handle competitor addition', async () => {
      const { CompetitorAnalysis } = await import('@/components/seo/CompetitorAnalysis');
      const { useSEOCompetitors } = await import('@/hooks/useSEOCompetitors');
      
      render(<CompetitorAnalysis />, { wrapper: createWrapper() });

      const addButton = screen.getByText('添加竞争对手');
      fireEvent.click(addButton);

      const nameInput = screen.getByPlaceholderText('竞争对手名称');
      fireEvent.change(nameInput, { target: { value: 'New Competitor' } });

      const domainInput = screen.getByPlaceholderText('竞争对手域名');
      fireEvent.change(domainInput, { target: { value: 'newcompetitor.com' } });

      const saveButton = screen.getByText('添加');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(useSEOCompetitors().addCompetitor).toHaveBeenCalledWith({
          name: 'New Competitor',
          domain: 'newcompetitor.com',
        });
      });
    });

    it('should handle competitor analysis', async () => {
      const { CompetitorAnalysis } = await import('@/components/seo/CompetitorAnalysis');
      const { useSEOCompetitors } = await import('@/hooks/useSEOCompetitors');
      
      render(<CompetitorAnalysis />, { wrapper: createWrapper() });

      const analyzeButton = screen.getByText('分析');
      fireEvent.click(analyzeButton);

      await waitFor(() => {
        expect(useSEOCompetitors().analyzeCompetitor).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Ranking Tracker', () => {
    it('should render ranking tracker interface', async () => {
      const { RankingTracker } = await import('@/components/seo/RankingTracker');
      
      render(<RankingTracker />, { wrapper: createWrapper() });

      expect(screen.getByText('排名跟踪')).toBeInTheDocument();
      expect(screen.getByText('test keyword')).toBeInTheDocument();
      expect(screen.getByText('第 5 名')).toBeInTheDocument();
    });

    it('should display ranking trends', async () => {
      const { RankingTracker } = await import('@/components/seo/RankingTracker');
      
      render(<RankingTracker />, { wrapper: createWrapper() });

      expect(screen.getByText('↑ 3')).toBeInTheDocument(); // Ranking improvement
    });

    it('should handle new ranking tracking', async () => {
      const { RankingTracker } = await import('@/components/seo/RankingTracker');
      const { useSEORankings } = await import('@/hooks/useSEORankings');
      
      render(<RankingTracker />, { wrapper: createWrapper() });

      const addButton = screen.getByText('添加跟踪');
      fireEvent.click(addButton);

      const keywordInput = screen.getByPlaceholderText('关键词');
      fireEvent.change(keywordInput, { target: { value: 'new keyword' } });

      const urlInput = screen.getByPlaceholderText('页面URL');
      fireEvent.change(urlInput, { target: { value: 'https://example.com/new-page' } });

      const trackButton = screen.getByText('开始跟踪');
      fireEvent.click(trackButton);

      await waitFor(() => {
        expect(useSEORankings().trackRanking).toHaveBeenCalledWith({
          keyword: 'new keyword',
          url: 'https://example.com/new-page',
          searchEngine: 'google',
          device: 'desktop',
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels', async () => {
      const { SEODashboard } = await import('@/pages/seo/dashboard');
      
      render(<SEODashboard />, { wrapper: createWrapper() });

      expect(screen.getByRole('tab', { name: /设置/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /关键词/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /站点地图/i })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const { SEODashboard } = await import('@/pages/seo/dashboard');
      
      render(<SEODashboard />, { wrapper: createWrapper() });

      const settingsTab = screen.getByRole('tab', { name: /设置/i });
      settingsTab.focus();
      
      fireEvent.keyDown(settingsTab, { key: 'Enter' });
      expect(settingsTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Responsive Design Tests', () => {
    it('should adapt to mobile screens', async () => {
      global.innerWidth = 375; // Mobile width
      global.dispatchEvent(new Event('resize'));

      const { SEODashboard } = await import('@/pages/seo/dashboard');
      
      render(<SEODashboard />, { wrapper: createWrapper() });

      // Should still render all components
      expect(screen.getByText('SEO 优化中心')).toBeInTheDocument();
    });

    it('should adapt to tablet screens', async () => {
      global.innerWidth = 768; // Tablet width
      global.dispatchEvent(new Event('resize'));

      const { SEODashboard } = await import('@/pages/seo/dashboard');
      
      render(<SEODashboard />, { wrapper: createWrapper() });

      expect(screen.getByText('SEO 优化中心')).toBeInTheDocument();
    });
  });
});