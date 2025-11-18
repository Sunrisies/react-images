import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Globe, 
  Twitter, 
  Facebook, 
  Smartphone, 
  Tablet, 
  Monitor,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { useSEOMetaTags } from '@/hooks/useSEOMetaTags';
import { SEOMetaTag, SEOMetaTagTemplate } from '@/types/seo.types';
import { toast } from 'sonner';

const metaTagSchema = z.object({
  title: z.string().min(10).max(60),
  description: z.string().min(50).max(160),
  keywords: z.string().optional(),
  author: z.string().optional(),
  canonical: z.string().url().optional(),
  robots: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  ogType: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url().optional(),
  twitterCard: z.string().optional(),
});

type MetaTagFormData = z.infer<typeof metaTagSchema>;

export const MetaTagsManager: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedField, setCopiedField] = useState<string>('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SEOMetaTagTemplate | null>(null);

  const {
    metaTags,
    templates,
    isLoading,
    createMetaTag,
    updateMetaTag,
    deleteMetaTag,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    generateFromContent,
    validateMetaTags
  } = useSEOMetaTags();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<MetaTagFormData>({
    resolver: zodResolver(metaTagSchema)
  });

  const watchedValues = watch();

  useEffect(() => {
    if (selectedPage) {
      const pageMeta = metaTags.find(tag => tag.pageUrl === selectedPage);
      if (pageMeta) {
        reset({
          title: pageMeta.title,
          description: pageMeta.description,
          keywords: pageMeta.keywords?.join(', '),
          author: pageMeta.author,
          canonical: pageMeta.canonical,
          robots: pageMeta.robots,
          ogTitle: pageMeta.ogTitle,
          ogDescription: pageMeta.ogDescription,
          ogImage: pageMeta.ogImage,
          ogType: pageMeta.ogType,
          twitterTitle: pageMeta.twitterTitle,
          twitterDescription: pageMeta.twitterDescription,
          twitterImage: pageMeta.twitterImage,
          twitterCard: pageMeta.twitterCard
        });
      }
    }
  }, [selectedPage, metaTags, reset]);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setValue('title', template.titleTemplate);
        setValue('description', template.descriptionTemplate);
      }
    }
  }, [selectedTemplate, templates, setValue]);

  const handleGenerateFromContent = async () => {
    try {
      const generated = await generateFromContent(selectedPage);
      if (generated) {
        reset({
          ...watchedValues,
          title: generated.title,
          description: generated.description,
          keywords: generated.keywords?.join(', ')
        });
        toast.success('Meta tags generated from content');
      }
    } catch (error) {
      toast.error('Failed to generate meta tags');
    }
  };

  const handleValidate = async () => {
    try {
      const validation = await validateMetaTags({
        pageUrl: selectedPage,
        title: watchedValues.title,
        description: watchedValues.description,
        keywords: watchedValues.keywords?.split(',').map(k => k.trim()).filter(Boolean),
        author: watchedValues.author,
        canonical: watchedValues.canonical,
        robots: watchedValues.robots,
        ogTitle: watchedValues.ogTitle,
        ogDescription: watchedValues.ogDescription,
        ogImage: watchedValues.ogImage,
        ogType: watchedValues.ogType,
        twitterTitle: watchedValues.twitterTitle,
        twitterDescription: watchedValues.twitterDescription,
        twitterImage: watchedValues.twitterImage,
        twitterCard: watchedValues.twitterCard
      });
      
      if (validation.isValid) {
        toast.success('Meta tags are valid');
      } else {
        toast.error(`Validation failed: ${validation.issues.join(', ')}`);
      }
    } catch (error) {
      toast.error('Validation failed');
    }
  };

  const onSubmit = async (data: MetaTagFormData) => {
    try {
      const metaTagData: Partial<SEOMetaTag> = {
        pageUrl: selectedPage,
        title: data.title,
        description: data.description,
        keywords: data.keywords?.split(',').map(k => k.trim()).filter(Boolean),
        author: data.author,
        canonical: data.canonical,
        robots: data.robots,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        ogType: data.ogType,
        twitterTitle: data.twitterTitle,
        twitterDescription: data.twitterDescription,
        twitterImage: data.twitterImage,
        twitterCard: data.twitterCard
      };

      const existingTag = metaTags.find(tag => tag.pageUrl === selectedPage);
      if (existingTag) {
        await updateMetaTag(existingTag.id, metaTagData);
        toast.success('Meta tags updated successfully');
      } else {
        await createMetaTag(metaTagData as SEOMetaTag);
        toast.success('Meta tags created successfully');
      }
    } catch (error) {
      toast.error('Failed to save meta tags');
    }
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const renderPreview = () => {
    const getPreviewWidth = () => {
      switch (previewMode) {
        case 'mobile': return 'w-[375px]';
        case 'tablet': return 'w-[768px]';
        default: return 'w-full max-w-4xl';
      }
    };

    return (
      <div className={`${getPreviewWidth()} mx-auto bg-white rounded-lg shadow-lg overflow-hidden`}>
        <div className="bg-gray-100 p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 ml-4">{selectedPage || 'example.com'}</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-600 truncate">
              {watchedValues.title || 'Page Title'}
            </h3>
            <p className="text-sm text-green-700">{selectedPage || 'example.com'}</p>
            <p className="text-sm text-gray-600 mt-1">
              {watchedValues.description || 'Page description...'}
            </p>
          </div>

          {watchedValues.ogTitle && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-3">
                {watchedValues.ogImage && (
                  <img 
                    src={watchedValues.ogImage} 
                    alt="OG Image"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{watchedValues.ogTitle}</h4>
                  <p className="text-sm text-gray-600">{watchedValues.ogDescription}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedPage}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meta Tags Manager</h2>
          <p className="text-gray-600">Manage meta tags for optimal SEO performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleCopyToClipboard(window.location.href, 'url')}>
            {copiedField === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copy URL
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Selection</CardTitle>
              <CardDescription>Select a page to manage its meta tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="page-select">Page URL</Label>
                  <select
                    id="page-select"
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                  >
                    <option value="">Select a page...</option>
                    {metaTags.map(tag => (
                      <option key={tag.id} value={tag.pageUrl}>{tag.pageUrl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="template-select">Template (Optional)</Label>
                  <select
                    id="template-select"
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">No template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateFromContent}
                    disabled={!selectedPage}
                  >
                    <Search className="w-4 h-4 mr-1" />
                    Auto Generate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleValidate}
                    disabled={!selectedPage || !watchedValues.title}
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Validate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="opengraph">Open Graph</TabsTrigger>
                <TabsTrigger value="twitter">Twitter</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter page title (10-60 characters)"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{watchedValues.title?.length || 0} characters</span>
                    <span>Recommended: 50-60 characters</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Enter page description (50-160 characters)"
                    rows={3}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{watchedValues.description?.length || 0} characters</span>
                    <span>Recommended: 150-160 characters</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Textarea
                    id="keywords"
                    {...register('keywords')}
                    placeholder="Enter keywords separated by commas"
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="opengraph" className="space-y-4">
                <div>
                  <Label htmlFor="ogTitle">Open Graph Title</Label>
                  <Input
                    id="ogTitle"
                    {...register('ogTitle')}
                    placeholder="Enter Open Graph title"
                  />
                </div>

                <div>
                  <Label htmlFor="ogDescription">Open Graph Description</Label>
                  <Textarea
                    id="ogDescription"
                    {...register('ogDescription')}
                    placeholder="Enter Open Graph description"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="ogImage">Open Graph Image URL</Label>
                  <Input
                    id="ogImage"
                    {...register('ogImage')}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="ogType">Open Graph Type</Label>
                  <select
                    id="ogType"
                    {...register('ogType')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select type...</option>
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="product">Product</option>
                    <option value="profile">Profile</option>
                  </select>
                </div>
              </TabsContent>

              <TabsContent value="twitter" className="space-y-4">
                <div>
                  <Label htmlFor="twitterTitle">Twitter Title</Label>
                  <Input
                    id="twitterTitle"
                    {...register('twitterTitle')}
                    placeholder="Enter Twitter title"
                  />
                </div>

                <div>
                  <Label htmlFor="twitterDescription">Twitter Description</Label>
                  <Textarea
                    id="twitterDescription"
                    {...register('twitterDescription')}
                    placeholder="Enter Twitter description"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="twitterImage">Twitter Image URL</Label>
                  <Input
                    id="twitterImage"
                    {...register('twitterImage')}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="twitterCard">Twitter Card Type</Label>
                  <select
                    id="twitterCard"
                    {...register('twitterCard')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select card type...</option>
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    {...register('author')}
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <Label htmlFor="canonical">Canonical URL</Label>
                  <Input
                    id="canonical"
                    {...register('canonical')}
                    placeholder="https://example.com/canonical-url"
                  />
                </div>

                <div>
                  <Label htmlFor="robots">Robots</Label>
                  <Input
                    id="robots"
                    {...register('robots')}
                    placeholder="index, follow"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2">
              <Button type="submit" disabled={!selectedPage || isLoading}>
                {isLoading ? 'Saving...' : 'Save Meta Tags'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>See how your meta tags will appear</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderPreview()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Manage meta tag templates</CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowTemplateForm(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templates.map(template => (
                  <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {templates.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No templates created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};