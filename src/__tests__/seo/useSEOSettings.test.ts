import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useSEOSettings } from '../../hooks/useSEOSettings';
import { seoService } from '../../services/seo';

// Mock the SEO service
vi.mock('../../services/seo', () => ({
  seoService: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    resetSettings: vi.fn(),
    validateRobotsTxt: vi.fn(),
  },
}));

// Mock toast notifications
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSEOSettingsQuery', () => {
    it('should fetch settings successfully', async () => {
      (seoService.getSettings as any).mockResolvedValueOnce(mockSettings);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });

      expect(result.current.settingsQuery.data).toEqual(mockSettings);
      expect(seoService.getSettings).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch settings');
      (seoService.getSettings as any).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.settingsQuery.isError).toBe(true);
      });

      expect(result.current.settingsQuery.error).toEqual(error);
    });

    it('should refetch settings', async () => {
      (seoService.getSettings as any).mockResolvedValue(mockSettings);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });

      // Reset mock to track new calls
      (seoService.getSettings as any).mockClear();

      // Trigger refetch
      result.current.refetchSettings();

      await waitFor(() => {
        expect(seoService.getSettings).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('useUpdateSEOSettingsMutation', () => {
    it('should update settings successfully', async () => {
      const updatedSettings = { ...mockSettings, siteName: 'Updated Site' };
      (seoService.updateSettings as any).mockResolvedValueOnce(updatedSettings);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Perform the mutation
      result.current.updateSettingsMutation.mutate(updatedSettings);

      await waitFor(() => {
        expect(result.current.updateSettingsMutation.isSuccess).toBe(true);
      });

      expect(seoService.updateSettings).toHaveBeenCalledWith(updatedSettings);
      expect(result.current.updateSettingsMutation.data).toEqual(updatedSettings);
    });

    it('should handle update error', async () => {
      const error = new Error('Failed to update settings');
      (seoService.updateSettings as any).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Perform the mutation
      result.current.updateSettingsMutation.mutate(mockSettings);

      await waitFor(() => {
        expect(result.current.updateSettingsMutation.isError).toBe(true);
      });

      expect(result.current.updateSettingsMutation.error).toEqual(error);
    });

    it('should invalidate queries after successful update', async () => {
      const updatedSettings = { ...mockSettings, siteName: 'Updated Site' };
      (seoService.updateSettings as any).mockResolvedValueOnce(updatedSettings);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // First ensure we have data
      await waitFor(() => {
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });

      // Reset the mock to track new calls after mutation
      (seoService.getSettings as any).mockClear();

      // Perform the mutation
      result.current.updateSettingsMutation.mutate(updatedSettings);

      await waitFor(() => {
        expect(result.current.updateSettingsMutation.isSuccess).toBe(true);
      });

      // Query should be refetched after mutation
      await waitFor(() => {
        expect(seoService.getSettings).toHaveBeenCalled();
      });
    });
  });

  describe('useResetSEOSettingsMutation', () => {
    it('should reset settings successfully', async () => {
      const defaultSettings = { ...mockSettings, siteName: 'Default Site' };
      (seoService.resetSettings as any).mockResolvedValueOnce(defaultSettings);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Perform the mutation
      result.current.resetSettingsMutation.mutate();

      await waitFor(() => {
        expect(result.current.resetSettingsMutation.isSuccess).toBe(true);
      });

      expect(seoService.resetSettings).toHaveBeenCalledTimes(1);
      expect(result.current.resetSettingsMutation.data).toEqual(defaultSettings);
    });

    it('should handle reset error', async () => {
      const error = new Error('Failed to reset settings');
      (seoService.resetSettings as any).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Perform the mutation
      result.current.resetSettingsMutation.mutate();

      await waitFor(() => {
        expect(result.current.resetSettingsMutation.isError).toBe(true);
      });

      expect(result.current.resetSettingsMutation.error).toEqual(error);
    });
  });

  describe('useValidateRobotsTxt', () => {
    it('should validate valid robots.txt', async () => {
      const validRobotsTxt = 'User-agent: *\nAllow: /\nDisallow: /admin/';
      (seoService.validateRobotsTxt as any).mockReturnValueOnce(true);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      const isValid = result.current.validateRobotsTxt(validRobotsTxt);

      expect(isValid).toBe(true);
      expect(seoService.validateRobotsTxt).toHaveBeenCalledWith(validRobotsTxt);
    });

    it('should validate invalid robots.txt', async () => {
      const invalidRobotsTxt = 'invalid robots content';
      (seoService.validateRobotsTxt as any).mockReturnValueOnce(false);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      const isValid = result.current.validateRobotsTxt(invalidRobotsTxt);

      expect(isValid).toBe(false);
      expect(seoService.validateRobotsTxt).toHaveBeenCalledWith(invalidRobotsTxt);
    });
  });

  describe('Loading States', () => {
    it('should show loading state during fetch', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      (seoService.getSettings as any).mockReturnValueOnce(promise);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Initially should be loading
      expect(result.current.settingsQuery.isLoading).toBe(true);

      // Resolve the promise
      resolvePromise!(mockSettings);

      await waitFor(() => {
        expect(result.current.settingsQuery.isLoading).toBe(false);
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });
    });

    it('should show loading state during update', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      (seoService.updateSettings as any).mockReturnValueOnce(promise);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Start the mutation
      result.current.updateSettingsMutation.mutate(mockSettings);

      // Should be loading
      expect(result.current.updateSettingsMutation.isPending).toBe(true);

      // Resolve the promise
      resolvePromise!(mockSettings);

      await waitFor(() => {
        expect(result.current.updateSettingsMutation.isPending).toBe(false);
        expect(result.current.updateSettingsMutation.isSuccess).toBe(true);
      });
    });
  });

  describe('Optimistic Updates', () => {
    it('should optimistically update settings', async () => {
      const updatedSettings = { ...mockSettings, siteName: 'Optimistic Site' };
      
      // Mock the service to return the updated settings
      (seoService.updateSettings as any).mockResolvedValueOnce(updatedSettings);
      
      // Mock getSettings to return original settings first, then updated
      (seoService.getSettings as any)
        .mockResolvedValueOnce(mockSettings)
        .mockResolvedValueOnce(updatedSettings);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Wait for initial data to load
      await waitFor(() => {
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });

      expect(result.current.settingsQuery.data?.siteName).toBe('Test Site');

      // Perform optimistic update
      result.current.updateSettingsMutation.mutate(updatedSettings);

      // Should immediately show optimistic data
      await waitFor(() => {
        expect(result.current.settingsQuery.data?.siteName).toBe('Optimistic Site');
      });

      // Should be successful after server confirmation
      await waitFor(() => {
        expect(result.current.updateSettingsMutation.isSuccess).toBe(true);
      });
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle concurrent settings updates', async () => {
      const updatedSettings1 = { ...mockSettings, siteName: 'Site 1' };
      const updatedSettings2 = { ...mockSettings, siteName: 'Site 2' };

      (seoService.updateSettings as any)
        .mockResolvedValueOnce(updatedSettings1)
        .mockResolvedValueOnce(updatedSettings2);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Trigger two concurrent updates
      result.current.updateSettingsMutation.mutate(updatedSettings1);
      result.current.updateSettingsMutation.mutate(updatedSettings2);

      await waitFor(() => {
        expect(result.current.updateSettingsMutation.isSuccess).toBe(true);
      });

      // Should have called update service twice
      expect(seoService.updateSettings).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from failed update with rollback', async () => {
      const updatedSettings = { ...mockSettings, siteName: 'Failed Update' };
      const error = new Error('Update failed');

      (seoService.updateSettings as any).mockRejectedValueOnce(error);
      
      // Mock getSettings to return original settings
      (seoService.getSettings as any).mockResolvedValueOnce(mockSettings);

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      // Wait for initial data
      await waitFor(() => {
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });

      expect(result.current.settingsQuery.data?.siteName).toBe('Test Site');

      // Perform failed update
      result.current.updateSettingsMutation.mutate(updatedSettings);

      await waitFor(() => {
        expect(result.current.updateSettingsMutation.isError).toBe(true);
      });

      // Should rollback to original data
      expect(result.current.settingsQuery.data?.siteName).toBe('Test Site');
    });
  });
});