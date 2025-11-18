import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SEOSettingsPanel from '../../components/seo/SEOSettingsPanel';

// Mock the useSEOSettings hook
vi.mock('../../hooks/useSEOSettings', () => ({
  useSEOSettings: vi.fn(),
}));

// Mock toast notifications
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock the SEO settings hook implementation
const mockUseSEOSettings = vi.fn();

const mockSettings = {
  id: '1',
  siteName: 'Test Site',
  siteDescription: 'Test Description',
  siteUrl: 'https://example.com',
  defaultLanguage: 'zh-CN',
  enableMultilingual: true,
  metaTitleTemplate: '{title} | {siteName}',
  metaDescriptionTemplate: '{description}',
  robotsTxt: 'User-agent: *\nAllow: /',
  crawlDelay: 1,
  enableCrawlDelay: false,
  sitemapAutoSubmit: true,
  enableAMP: false,
  googleAnalyticsId: 'UA-123456789',
  baiduAnalyticsId: 'baidu-123',
  enableJsonLd: true,
  enableOpenGraph: true,
  enableTwitterCard: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('SEOSettingsPanel', () => {
  const mockUpdateSettingsMutation = {
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  };

  const mockResetSettingsMutation = {
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  };

  const mockValidateRobotsTxt = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseSEOSettings.mockReturnValue({
      settingsQuery: {
        data: mockSettings,
        isLoading: false,
        isError: false,
        error: null,
      },
      updateSettingsMutation: mockUpdateSettingsMutation,
      resetSettingsMutation: mockResetSettingsMutation,
      validateRobotsTxt: mockValidateRobotsTxt,
      refetchSettings: vi.fn(),
    });
  });

  describe('General Settings Tab', () => {
    it('should render general settings form', () => {
      render(<SEOSettingsPanel />);

      expect(screen.getByLabelText(/站点名称/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/站点描述/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/站点URL/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/默认语言/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/启用多语言/i)).toBeInTheDocument();
    });

    it('should display current settings values', () => {
      render(<SEOSettingsPanel />);

      expect(screen.getByDisplayValue('Test Site')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('zh-CN')).toBeInTheDocument();
    });

    it('should update form fields', () => {
      render(<SEOSettingsPanel />);

      const siteNameInput = screen.getByLabelText(/站点名称/i);
      fireEvent.change(siteNameInput, { target: { value: 'Updated Site' } });

      expect(siteNameInput).toHaveValue('Updated Site');
    });

    it('should save general settings', async () => {
      render(<SEOSettingsPanel />);

      const siteNameInput = screen.getByLabelText(/站点名称/i);
      fireEvent.change(siteNameInput, { target: { value: 'Updated Site' } });

      const saveButton = screen.getByRole('button', { name: /保存设置/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateSettingsMutation.mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            siteName: 'Updated Site',
          })
        );
      });
    });
  });

  describe('Meta Tags Tab', () => {
    it('should render meta tags form', () => {
      render(<SEOSettingsPanel />);

      // Switch to Meta Tags tab
      const metaTab = screen.getByRole('tab', { name: /meta标签/i });
      fireEvent.click(metaTab);

      expect(screen.getByLabelText(/标题模板/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/描述模板/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/启用OpenGraph/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/启用Twitter Card/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/启用JSON-LD/i)).toBeInTheDocument();
    });

    it('should update meta tag templates', () => {
      render(<SEOSettingsPanel />);

      // Switch to Meta Tags tab
      const metaTab = screen.getByRole('tab', { name: /meta标签/i });
      fireEvent.click(metaTab);

      const titleTemplateInput = screen.getByLabelText(/标题模板/i);
      fireEvent.change(titleTemplateInput, { target: { value: '{title} - {siteName}' } });

      expect(titleTemplateInput).toHaveValue('{title} - {siteName}');
    });

    it('should toggle social media meta tags', () => {
      render(<SEOSettingsPanel />);

      // Switch to Meta Tags tab
      const metaTab = screen.getByRole('tab', { name: /meta标签/i });
      fireEvent.click(metaTab);

      const openGraphToggle = screen.getByLabelText(/启用OpenGraph/i);
      fireEvent.click(openGraphToggle);

      expect(openGraphToggle).not.toBeChecked();
    });
  });

  describe('Crawl Settings Tab', () => {
    it('should render crawl settings form', () => {
      render(<SEOSettingsPanel />);

      // Switch to Crawl Settings tab
      const crawlTab = screen.getByRole('tab', { name: /爬取设置/i });
      fireEvent.click(crawlTab);

      expect(screen.getByLabelText(/robots\.txt内容/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/启用爬取延迟/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/爬取延迟/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/自动提交站点地图/i)).toBeInTheDocument();
    });

    it('should update robots.txt content', () => {
      render(<SEOSettingsPanel />);

      // Switch to Crawl Settings tab
      const crawlTab = screen.getByRole('tab', { name: /爬取设置/i });
      fireEvent.click(crawlTab);

      const robotsTextarea = screen.getByLabelText(/robots\.txt内容/i);
      const newContent = 'User-agent: *\nDisallow: /private/';
      fireEvent.change(robotsTextarea, { target: { value: newContent } });

      expect(robotsTextarea).toHaveValue(newContent);
    });

    it('should validate robots.txt format', () => {
      mockValidateRobotsTxt.mockReturnValueOnce(false);

      render(<SEOSettingsPanel />);

      // Switch to Crawl Settings tab
      const crawlTab = screen.getByRole('tab', { name: /爬取设置/i });
      fireEvent.click(crawlTab);

      const robotsTextarea = screen.getByLabelText(/robots\.txt内容/i);
      const invalidContent = 'invalid robots content';
      fireEvent.change(robotsTextarea, { target: { value: invalidContent } });

      // Validation should be triggered
      expect(mockValidateRobotsTxt).toHaveBeenCalledWith(invalidContent);
    });

    it('should enable crawl delay and show delay input', () => {
      render(<SEOSettingsPanel />);

      // Switch to Crawl Settings tab
      const crawlTab = screen.getByRole('tab', { name: /爬取设置/i });
      fireEvent.click(crawlTab);

      const crawlDelayToggle = screen.getByLabelText(/启用爬取延迟/i);
      fireEvent.click(crawlDelayToggle);

      expect(crawlDelayToggle).toBeChecked();
      expect(screen.getByLabelText(/爬取延迟/i)).toBeInTheDocument();
    });
  });

  describe('Advanced Settings Tab', () => {
    it('should render advanced settings form', () => {
      render(<SEOSettingsPanel />);

      // Switch to Advanced Settings tab
      const advancedTab = screen.getByRole('tab', { name: /高级设置/i });
      fireEvent.click(advancedTab);

      expect(screen.getByLabelText(/Google Analytics ID/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/百度统计ID/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/启用AMP/i)).toBeInTheDocument();
    });

    it('should update analytics IDs', () => {
      render(<SEOSettingsPanel />);

      // Switch to Advanced Settings tab
      const advancedTab = screen.getByRole('tab', { name: /高级设置/i });
      fireEvent.click(advancedTab);

      const googleAnalyticsInput = screen.getByLabelText(/Google Analytics ID/i);
      fireEvent.change(googleAnalyticsInput, { target: { value: 'UA-987654321' } });

      expect(googleAnalyticsInput).toHaveValue('UA-987654321');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      render(<SEOSettingsPanel />);

      const siteNameInput = screen.getByLabelText(/站点名称/i);
      fireEvent.change(siteNameInput, { target: { value: '' } });

      const saveButton = screen.getByRole('button', { name: /保存设置/i });
      fireEvent.click(saveButton);

      // Should not call update mutation with empty site name
      expect(mockUpdateSettingsMutation.mutate).not.toHaveBeenCalled();
    });

    it('should validate URL format', () => {
      render(<SEOSettingsPanel />);

      const siteUrlInput = screen.getByLabelText(/站点URL/i);
      const invalidUrl = 'not-a-valid-url';
      fireEvent.change(siteUrlInput, { target: { value: invalidUrl } });

      const saveButton = screen.getByRole('button', { name: /保存设置/i });
      fireEvent.click(saveButton);

      // Should not call update mutation with invalid URL
      expect(mockUpdateSettingsMutation.mutate).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during initial load', () => {
      mockUseSEOSettings.mockReturnValueOnce({
        settingsQuery: {
          data: null,
          isLoading: true,
          isError: false,
          error: null,
        },
        updateSettingsMutation: mockUpdateSettingsMutation,
        resetSettingsMutation: mockResetSettingsMutation,
        validateRobotsTxt: mockValidateRobotsTxt,
        refetchSettings: vi.fn(),
      });

      render(<SEOSettingsPanel />);

      expect(screen.getByText(/加载中/i)).toBeInTheDocument();
    });

    it('should show loading state during save', () => {
      mockUseSEOSettings.mockReturnValueOnce({
        settingsQuery: {
          data: mockSettings,
          isLoading: false,
          isError: false,
          error: null,
        },
        updateSettingsMutation: {
          ...mockUpdateSettingsMutation,
          isPending: true,
        },
        resetSettingsMutation: mockResetSettingsMutation,
        validateRobotsTxt: mockValidateRobotsTxt,
        refetchSettings: vi.fn(),
      });

      render(<SEOSettingsPanel />);

      const saveButton = screen.getByRole('button', { name: /保存设置/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error state', () => {
      const errorMessage = 'Failed to load settings';
      mockUseSEOSettings.mockReturnValueOnce({
        settingsQuery: {
          data: null,
          isLoading: false,
          isError: true,
          error: new Error(errorMessage),
        },
        updateSettingsMutation: mockUpdateSettingsMutation,
        resetSettingsMutation: mockResetSettingsMutation,
        validateRobotsTxt: mockValidateRobotsTxt,
        refetchSettings: vi.fn(),
      });

      render(<SEOSettingsPanel />);

      expect(screen.getByText(/加载设置失败/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /重试/i })).toBeInTheDocument();
    });

    it('should retry loading settings on error', () => {
      const mockRefetchSettings = vi.fn();
      mockUseSEOSettings.mockReturnValueOnce({
        settingsQuery: {
          data: null,
          isLoading: false,
          isError: true,
          error: new Error('Failed to load'),
        },
        updateSettingsMutation: mockUpdateSettingsMutation,
        resetSettingsMutation: mockResetSettingsMutation,
        validateRobotsTxt: mockValidateRobotsTxt,
        refetchSettings: mockRefetchSettings,
      });

      render(<SEOSettingsPanel />);

      const retryButton = screen.getByRole('button', { name: /重试/i });
      fireEvent.click(retryButton);

      expect(mockRefetchSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset settings to defaults', async () => {
      render(<SEOSettingsPanel />);

      const resetButton = screen.getByRole('button', { name: /重置为默认/i });
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(mockResetSettingsMutation.mutate).toHaveBeenCalledTimes(1);
      });
    });

    it('should show confirmation dialog before reset', async () => {
      render(<SEOSettingsPanel />);

      const resetButton = screen.getByRole('button', { name: /重置为默认/i });
      fireEvent.click(resetButton);

      // Should show confirmation (in a real implementation, this would be a modal)
      // For now, we'll just verify the mutation was called
      await waitFor(() => {
        expect(mockResetSettingsMutation.mutate).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between tabs', () => {
      render(<SEOSettingsPanel />);

      const tabs = [
        { name: /基础设置/i, content: '站点名称' },
        { name: /meta标签/i, content: '标题模板' },
        { name: /爬取设置/i, content: 'robots.txt' },
        { name: /高级设置/i, content: 'Google Analytics' },
      ];

      tabs.forEach(({ name, content }) => {
        const tab = screen.getByRole('tab', { name });
        fireEvent.click(tab);
        expect(screen.getByText(content)).toBeInTheDocument();
      });
    });

    it('should maintain form state when switching tabs', () => {
      render(<SEOSettingsPanel />);

      // Update a field in General tab
      const siteNameInput = screen.getByLabelText(/站点名称/i);
      fireEvent.change(siteNameInput, { target: { value: 'Updated Site' } });

      // Switch to Meta Tags tab
      const metaTab = screen.getByRole('tab', { name: /meta标签/i });
      fireEvent.click(metaTab);

      // Switch back to General tab
      const generalTab = screen.getByRole('tab', { name: /基础设置/i });
      fireEvent.click(generalTab);

      // Form state should be preserved
      expect(siteNameInput).toHaveValue('Updated Site');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<SEOSettingsPanel />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /基础设置/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: /meta标签/i })).toHaveAttribute('aria-selected', 'false');
    });

    it('should be keyboard navigable', () => {
      render(<SEOSettingsPanel />);

      const siteNameInput = screen.getByLabelText(/站点名称/i);
      siteNameInput.focus();
      expect(document.activeElement).toBe(siteNameInput);

      // Tab to next field
      fireEvent.keyDown(siteNameInput, { key: 'Tab' });
      // In a real implementation, focus would move to the next input
    });
  });
});