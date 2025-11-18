import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSEOSettings } from '../useSEOSettings';
import { seoService } from '@/services/seo';
import { toast } from 'sonner';

// Mock the SEO service
vi.mock('@/services/seo', () => ({
  seoService: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    resetSettings: vi.fn(),
    validateRobotsTxt: vi.fn()
  }
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useSEOSettings', () => {
  const mockSettings = {
    id: '1',
    siteName: 'Test Site',
    siteDescription: 'Test Description',
    siteUrl: 'https://example.com',
    language: 'zh-CN',
    charset: 'UTF-8',
    robotsTxt: 'User-agent: *\nDisallow: /admin/',
    googleAnalyticsId: 'UA-123456789-1',
    baiduAnalyticsId: 'baidu-123',
    defaultMetaTitle: 'Default Title',
    defaultMetaDescription: 'Default Description',
    defaultMetaKeywords: ['test', 'seo'],
    socialMedia: {
      twitter: '@test',
      facebook: 'testpage',
      linkedin: 'testcompany'
    },
    hreflang: [
      { language: 'zh-CN', url: 'https://example.com/zh' },
      { language: 'en-US', url: 'https://example.com/en' }
    ],
    crawlDelay: 1,
    sitemapAutoSubmit: true,
    lastUpdated: new Date().toISOString()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Settings Fetching', () => {
    it('should fetch settings successfully', async () => {
      vi.mocked(seoService.getSettings).mockResolvedValueOnce(mockSettings);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
        expect(result.current.isLoading).toBe(false);
      });

      expect(seoService.getSettings).toHaveBeenCalledOnce();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle errors when fetching settings', async () => {
      const error = new Error('Failed to fetch settings');
      vi.mocked(seoService.getSettings).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(error);
        expect(result.current.isLoading).toBe(false);
      });

      expect(toast.error).toHaveBeenCalledWith('加载SEO设置失败');
    });

    it('should return cached data on subsequent calls', async () => {
      vi.mocked(seoService.getSettings).mockResolvedValueOnce(mockSettings);

      const { result, rerender } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });

      const firstCallCount = vi.mocked(seoService.getSettings).mock.calls.length;

      // Re-render to trigger another hook call
      rerender();

      // Should not make another API call due to caching
      expect(vi.mocked(seoService.getSettings).mock.calls.length).toBe(firstCallCount);
    });
  });

  describe('Settings Updates', () => {
    it('should update settings successfully', async () => {
      const updatedSettings = {
        ...mockSettings,
        siteName: 'Updated Site Name'
      };

      vi.mocked(seoService.getSettings).mockResolvedValueOnce(mockSettings);
      vi.mocked(seoService.updateSettings).mockResolvedValueOnce(updatedSettings);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });

      await result.current.updateSettings({ siteName: 'Updated Site Name' });

      await waitFor(() => {
        expect(result.current.settings).toEqual(updatedSettings);
      });

      expect(seoService.updateSettings).toHaveBeenCalledWith({ siteName: 'Updated Site Name' });
      expect(toast.success).toHaveBeenCalledWith('SEO设置更新成功');
    });

    it('should handle errors when updating settings', async () => {
      const error = new Error('Failed to update settings');
      
      vi.mocked(seoService.getSettings).mockResolvedValueOnce(mockSettings);
      vi.mocked(seoService.updateSettings).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });

      await result.current.updateSettings({ siteName: 'Updated Site Name' });

      expect(toast.error).toHaveBeenCalledWith('更新SEO设置失败');
    });
  });

  describe('Settings Reset', () => {
    it('should reset settings successfully', async () => {
      const defaultSettings = {
        ...mockSettings,
        siteName: 'Default Site Name'
      };

      vi.mocked(seoService.getSettings).mockResolvedValueOnce(mockSettings);
      vi.mocked(seoService.resetSettings).mockResolvedValueOnce(defaultSettings);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });

      await result.current.resetSettings();

      await waitFor(() => {
        expect(result.current.settings).toEqual(defaultSettings);
      });

      expect(seoService.resetSettings).toHaveBeenCalledOnce();
      expect(toast.success).toHaveBeenCalledWith('SEO设置已重置为默认值');
    });

    it('should handle errors when resetting settings', async () => {
      const error = new Error('Failed to reset settings');
      
      vi.mocked(seoService.getSettings).mockResolvedValueOnce(mockSettings);
      vi.mocked(seoService.resetSettings).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });

      await result.current.resetSettings();

      expect(toast.error).toHaveBeenCalledWith('重置SEO设置失败');
    });
  });

  describe('Robots.txt Validation', () => {
    it('should validate robots.txt successfully', async () => {
      const robotsTxt = 'User-agent: *\nDisallow: /admin/';
      const validationResult = {
        isValid: true,
        errors: [],
        warnings: []
      };

      vi.mocked(seoService.validateRobotsTxt).mockResolvedValueOnce(validationResult);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      const validation = await result.current.validateRobotsTxt(robotsTxt);

      expect(validation).toEqual(validationResult);
      expect(seoService.validateRobotsTxt).toHaveBeenCalledWith(robotsTxt);
    });

    it('should handle robots.txt validation errors', async () => {
      const robotsTxt = 'Invalid robots.txt content';
      const validationResult = {
        isValid: false,
        errors: ['Invalid syntax'],
        warnings: ['Missing User-agent directive']
      };

      vi.mocked(seoService.validateRobotsTxt).mockResolvedValueOnce(validationResult);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      const validation = await result.current.validateRobotsTxt(robotsTxt);

      expect(validation).toEqual(validationResult);
      expect(toast.error).toHaveBeenCalledWith('robots.txt验证失败');
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching settings', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      vi.mocked(seoService.getSettings).mockReturnValueOnce(promise);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.settings).toBeUndefined();

      // Resolve the promise
      resolvePromise!(mockSettings);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.settings).toEqual(mockSettings);
      });
    });

    it('should show loading state while updating settings', async () => {
      vi.mocked(seoService.getSettings).mockResolvedValueOnce(mockSettings);
      
      let resolveUpdate: (value: any) => void;
      const updatePromise = new Promise(resolve => {
        resolveUpdate = resolve;
      });
      vi.mocked(seoService.updateSettings).mockReturnValueOnce(updatePromise);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });

      // Start update
      const updatePromiseResult = result.current.updateSettings({ siteName: 'Updated Name' });

      expect(result.current.isUpdating).toBe(true);

      // Resolve the update promise
      resolveUpdate!({ ...mockSettings, siteName: 'Updated Name' });

      await updatePromiseResult;

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });
    });
  });

  describe('Cache Invalidation', () => {
    it('should invalidate cache after settings update', async () => {
      const updatedSettings = {
        ...mockSettings,
        siteName: 'Updated Site Name'
      };

      vi.mocked(seoService.getSettings)
        .mockResolvedValueOnce(mockSettings)
        .mockResolvedValueOnce(updatedSettings);
      vi.mocked(seoService.updateSettings).mockResolvedValueOnce(updatedSettings);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });

      await result.current.updateSettings({ siteName: 'Updated Site Name' });

      await waitFor(() => {
        expect(result.current.settings).toEqual(updatedSettings);
      });

      // Verify that getSettings was called twice (initial + after invalidation)
      expect(seoService.getSettings).toHaveBeenCalledTimes(2);
    });
  });

  describe('Optimistic Updates', () => {
    it('should handle optimistic updates correctly', async () => {
      const optimisticSettings = {
        ...mockSettings,
        siteName: 'Optimistic Name'
      };

      vi.mocked(seoService.getSettings).mockResolvedValueOnce(mockSettings);
      vi.mocked(seoService.updateSettings).mockImplementationOnce(async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return optimisticSettings;
      });

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });

      // Start update
      const updatePromise = result.current.updateSettings({ siteName: 'Optimistic Name' });

      // Settings should be optimistically updated immediately
      expect(result.current.settings).toEqual(optimisticSettings);

      await updatePromise;

      await waitFor(() => {
        expect(result.current.settings).toEqual(optimisticSettings);
      });
    });
  });
});