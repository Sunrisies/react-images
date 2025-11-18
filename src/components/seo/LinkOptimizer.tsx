import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Link, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Filter, 
  Search,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  ArrowRight,
  Globe,
  Home,
  BarChart3
} from 'lucide-react';
import { useSEOLinks } from '@/hooks/useSEOLinks';
import { SEOLink, LinkStatus, LinkType } from '@/types/seo.types';
import { toast } from 'sonner';

const linkSchema = z.object({
  url: z.string().url(),
  anchorText: z.string().min(1),
  type: z.enum(['internal', 'external']),
  follow: z.boolean(),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.string().optional()
});

type LinkFormData = z.infer<typeof linkSchema>;

export const LinkOptimizer: React.FC = () => {
  const [selectedLink, setSelectedLink] = useState<SEOLink | null>(null);
  const [filterType, setFilterType] = useState<LinkType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<LinkStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const {
    links,
    brokenLinks,
    internalLinks,
    externalLinks,
    isLoading,
    scanForBrokenLinks,
    analyzeLinkProfile,
    suggestInternalLinks,
    updateLink,
    deleteLink,
    createLink,
    exportLinks,
    importLinks
  } = useSEOLinks();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema)
  });

  useEffect(() => {
    if (selectedLink) {
      reset({
        url: selectedLink.url,
        anchorText: selectedLink.anchorText,
        type: selectedLink.type,
        follow: selectedLink.follow,
        priority: selectedLink.priority,
        category: selectedLink.category || ''
      });
    }
  }, [selectedLink, reset]);

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.anchorText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || link.type === filterType;
    const matchesStatus = filterStatus === 'all' || link.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleScanBrokenLinks = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      const totalLinks = links.length;
      let processedLinks = 0;

      // Simulate progress updates
      const interval = setInterval(() => {
        processedLinks += Math.floor(totalLinks / 10);
        setScanProgress(Math.min((processedLinks / totalLinks) * 100, 95));
        
        if (processedLinks >= totalLinks) {
          clearInterval(interval);
        }
      }, 200);

      await scanForBrokenLinks();
      
      setScanProgress(100);
      setTimeout(() => {
        setIsScanning(false);
        setScanProgress(0);
        toast.success('Broken link scan completed');
      }, 500);
      
      clearInterval(interval);
    } catch (error) {
      setIsScanning(false);
      setScanProgress(0);
      toast.error('Failed to scan for broken links');
    }
  };

  const handleAnalyzeLinkProfile = async () => {
    try {
      await analyzeLinkProfile();
      toast.success('Link profile analysis completed');
    } catch (error) {
      toast.error('Failed to analyze link profile');
    }
  };

  const handleSuggestInternalLinks = async () => {
    try {
      const suggestions = await suggestInternalLinks();
      toast.success(`Found ${suggestions.length} internal link suggestions`);
    } catch (error) {
      toast.error('Failed to generate link suggestions');
    }
  };

  const onSubmit = async (data: LinkFormData) => {
    try {
      if (selectedLink) {
        await updateLink(selectedLink.id, data);
        toast.success('Link updated successfully');
      } else {
        await createLink(data);
        toast.success('Link created successfully');
      }
      
      setShowAddForm(false);
      setSelectedLink(null);
      reset();
    } catch (error) {
      toast.error('Failed to save link');
    }
  };

  const handleExport = async () => {
    try {
      await exportLinks();
      toast.success('Links exported successfully');
    } catch (error) {
      toast.error('Failed to export links');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importLinks(file);
      toast.success('Links imported successfully');
    } catch (error) {
      toast.error('Failed to import links');
    }
  };

  const getStatusBadge = (status: LinkStatus) => {
    const variants = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      broken: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
      warning: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
      redirect: { color: 'bg-blue-100 text-blue-800', icon: <ArrowRight className="w-3 h-3" /> }
    };

    const variant = variants[status];
    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        {variant.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: LinkType) => {
    const variants = {
      internal: { color: 'bg-blue-100 text-blue-800', icon: <Home className="w-3 h-3" /> },
      external: { color: 'bg-purple-100 text-purple-800', icon: <Globe className="w-3 h-3" /> }
    };

    const variant = variants[type];
    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        {variant.icon}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: links.length,
    internal: internalLinks.length,
    external: externalLinks.length,
    broken: brokenLinks.length,
    healthy: links.filter(l => l.status === 'active').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Link Optimizer</h2>
          <p className="text-gray-600">Optimize your link profile for better SEO</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" asChild>
            <label>
              <Upload className="w-4 h-4 mr-1" />
              Import
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internal Links</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.internal}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External Links</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.external}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Broken Links</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.broken}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Links</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.healthy}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleScanBrokenLinks} disabled={isScanning}>
          <RefreshCw className={`w-4 h-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? `Scanning... ${scanProgress.toFixed(0)}%` : 'Scan Broken Links'}
        </Button>
        <Button variant="outline" onClick={handleAnalyzeLinkProfile}>
          <BarChart3 className="w-4 h-4 mr-1" />
          Analyze Profile
        </Button>
        <Button variant="outline" onClick={handleSuggestInternalLinks}>
          <Search className="w-4 h-4 mr-1" />
          Suggest Internal Links
        </Button>
      </div>

      {/* Progress Bar for Scanning */}
      {isScanning && (
        <Alert>
          <AlertDescription>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Scanning links for issues...</span>
            </div>
            <Progress value={scanProgress} className="mt-2" />
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as LinkType | 'all')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as LinkStatus | 'all')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="broken">Broken</option>
              <option value="warning">Warning</option>
              <option value="redirect">Redirect</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedLink ? 'Edit Link' : 'Add New Link'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL *</label>
                <Input
                  {...register('url')}
                  placeholder="https://example.com"
                  className={errors.url ? 'border-red-500' : ''}
                />
                {errors.url && (
                  <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Anchor Text *</label>
                <Input
                  {...register('anchorText')}
                  placeholder="Link text"
                  className={errors.anchorText ? 'border-red-500' : ''}
                />
                {errors.anchorText && (
                  <p className="text-red-500 text-sm mt-1">{errors.anchorText.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    {...register('type')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  {...register('category')}
                  placeholder="Optional category"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('follow')}
                  className="rounded"
                />
                <label className="text-sm font-medium">Follow this link</label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : selectedLink ? 'Update Link' : 'Create Link'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedLink(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Link Management</CardTitle>
          <CardDescription>
            Manage and optimize your website links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Anchor Text</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Last Checked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="max-w-xs truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.url}
                      </a>
                    </TableCell>
                    <TableCell>{link.anchorText}</TableCell>
                    <TableCell>{getTypeBadge(link.type)}</TableCell>
                    <TableCell>{getStatusBadge(link.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{link.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      {link.lastChecked ? new Date(link.lastChecked).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedLink(link);
                            setShowAddForm(true);
                          }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLinks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No links found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Broken Links Alert */}
      {brokenLinks.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <span>Found {brokenLinks.length} broken links that need attention</span>
              <Button variant="outline" size="sm" onClick={() => setFilterStatus('broken')}>
                View All
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};