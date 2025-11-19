import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Link,
  Search,
  Globe,
  Plus,
  Trash2,
  BarChart3,
  Download,
  RefreshCw,
  Eye,
  Filter,
  Award,
  Zap,
  Clock
} from 'lucide-react'
import { useSEOCompetitors } from '@/hooks/useSEOCompetitors'
import { SEOCompetitor, CompetitorKeyword, CompetitorBacklink } from '@/types/seo.types'
import { toast } from 'sonner'
import { Input } from '../ui/input'

export const CompetitorAnalysis: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('')
  const [analysisType, setAnalysisType] = useState<'keywords' | 'backlinks' | 'rankings'>('keywords')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompetitorUrl, setNewCompetitorUrl] = useState('')

  const {
    competitors,
    competitorKeywords,
    competitorBacklinks,
    isLoading,
    addCompetitor,
    removeCompetitor,
    analyzeCompetitor,
    compareKeywords,
    analyzeBacklinks,
    getRankingComparison,
    exportAnalysis
  } = useSEOCompetitors()

  const handleAddCompetitor = async () => {
    if (!newCompetitorUrl) {
      toast.error('Please enter a competitor URL')
      return
    }

    try {
      await addCompetitor(newCompetitorUrl)
      toast.success('Competitor added successfully')
      setNewCompetitorUrl('')
      setShowAddForm(false)
    } catch (error) {
      toast.error('Failed to add competitor')
    }
  }

  const handleAnalyzeCompetitor = async (competitorId: string) => {
    setIsAnalyzing(true)
    try {
      await analyzeCompetitor(competitorId)
      toast.success('Competitor analysis completed')
    } catch (error) {
      toast.error('Failed to analyze competitor')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExportAnalysis = async () => {
    try {
      await exportAnalysis()
      toast.success('Analysis exported successfully')
    } catch (error) {
      toast.error('Failed to export analysis')
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 text-gray-500">—</div>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-green-100 text-green-800', text: 'Strong' }
    if (score >= 60) return { color: 'bg-yellow-100 text-yellow-800', text: 'Moderate' }
    return { color: 'bg-red-100 text-red-800', text: 'Weak' }
  }

  // Mock data for demonstration
  const mockCompetitors = [
    {
      id: '1',
      domain: 'competitor1.com',
      name: 'Competitor One',
      organicTraffic: 45000,
      keywords: 1250,
      backlinks: 3400,
      domainAuthority: 65,
      lastAnalyzed: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '2',
      domain: 'competitor2.com',
      name: 'Competitor Two',
      organicTraffic: 32000,
      keywords: 980,
      backlinks: 2800,
      domainAuthority: 58,
      lastAnalyzed: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '3',
      domain: 'competitor3.com',
      name: 'Competitor Three',
      organicTraffic: 28000,
      keywords: 850,
      backlinks: 2100,
      domainAuthority: 52,
      lastAnalyzed: new Date().toISOString(),
      status: 'active'
    }
  ]

  const mockKeywords = [
    {
      id: '1',
      keyword: 'seo optimization',
      yourRank: 8,
      competitorRank: 3,
      searchVolume: 12100,
      difficulty: 65,
      trend: 'up' as const,
      competitorId: '1'
    },
    {
      id: '2',
      keyword: 'digital marketing',
      yourRank: 15,
      competitorRank: 7,
      searchVolume: 33100,
      difficulty: 78,
      trend: 'stable' as const,
      competitorId: '1'
    },
    {
      id: '3',
      keyword: 'content strategy',
      yourRank: 22,
      competitorRank: 11,
      searchVolume: 8100,
      difficulty: 58,
      trend: 'down' as const,
      competitorId: '2'
    }
  ]

  const mockBacklinks = [
    {
      id: '1',
      url: 'https://authoritysite.com/article',
      anchorText: 'SEO best practices',
      domainAuthority: 85,
      follow: true,
      competitorId: '1',
      discovered: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '2',
      url: 'https://techblog.com/guide',
      anchorText: 'digital marketing tools',
      domainAuthority: 72,
      follow: true,
      competitorId: '1',
      discovered: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '3',
      url: 'https://marketinghub.com/resources',
      anchorText: 'content optimization',
      domainAuthority: 68,
      follow: false,
      competitorId: '2',
      discovered: new Date().toISOString(),
      status: 'active'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Competitor Analysis</h2>
          <p className="text-gray-600">Analyze your competitors' SEO strategies</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={ handleExportAnalysis }>
            <Download className="w-4 h-4 mr-1" />
            Export Analysis
          </Button>
          <Button onClick={ () => setShowAddForm(true) }>
            <Plus className="w-4 h-4 mr-1" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Add Competitor Form */ }
      { showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Competitor</CardTitle>
            <CardDescription>
              Enter your competitor's website URL to start analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="https://competitor-website.com"
                value={ newCompetitorUrl }
                onChange={ (e) => setNewCompetitorUrl(e.target.value) }
                className="flex-1"
              />
              <Button onClick={ handleAddCompetitor }>
                Add Competitor
              </Button>
              <Button
                variant="outline"
                onClick={ () => {
                  setShowAddForm(false)
                  setNewCompetitorUrl('')
                } }
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) }

      {/* Competitor Overview */ }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        { mockCompetitors.map(competitor => (
          <Card key={ competitor.id } className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                { competitor.domain }
              </CardTitle>
              <Badge className={ getScoreBadge(competitor.domainAuthority).color }>
                DA: { competitor.domainAuthority }
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Organic Traffic</span>
                  <span className="font-semibold">{ competitor.organicTraffic.toLocaleString() }</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Keywords</span>
                  <span className="font-semibold">{ competitor.keywords.toLocaleString() }</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Backlinks</span>
                  <span className="font-semibold">{ competitor.backlinks.toLocaleString() }</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Last analyzed:</span>
                  <span>{ new Date(competitor.lastAnalyzed).toLocaleDateString() }</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={ () => handleAnalyzeCompetitor(competitor.id) }
                  disabled={ isAnalyzing }
                >
                  { isAnalyzing ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <BarChart3 className="w-3 h-3" />
                  ) }
                  Analyze
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={ () => removeCompetitor(competitor.id) }
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) }
      </div>

      {/* Analysis Type Selection */ }
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>
            Choose the type of analysis you want to perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Button
              variant={ analysisType === 'keywords' ? 'default' : 'outline' }
              onClick={ () => setAnalysisType('keywords') }
            >
              <Search className="w-4 h-4 mr-2" />
              Keyword Comparison
            </Button>
            <Button
              variant={ analysisType === 'backlinks' ? 'default' : 'outline' }
              onClick={ () => setAnalysisType('backlinks') }
            >
              <Link className="w-4 h-4 mr-2" />
              Backlink Analysis
            </Button>
            <Button
              variant={ analysisType === 'rankings' ? 'default' : 'outline' }
              onClick={ () => setAnalysisType('rankings') }
            >
              <Target className="w-4 h-4 mr-2" />
              Ranking Comparison
            </Button>
          </div>

          {/* Keyword Comparison */ }
          { analysisType === 'keywords' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Keyword Comparison</h3>
                <Input
                  placeholder="Search keywords..."
                  value={ searchTerm }
                  onChange={ (e) => setSearchTerm(e.target.value) }
                  className="max-w-xs"
                />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Search Volume</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Your Rank</TableHead>
                      <TableHead>Competitor Rank</TableHead>
                      <TableHead>Difference</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Opportunity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { mockKeywords
                      .filter(kw => kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(keyword => {
                        const rankDiff = keyword.yourRank - keyword.competitorRank
                        const opportunity = rankDiff > 0 ? 'Improve' : 'Maintain'

                        return (
                          <TableRow key={ keyword.id }>
                            <TableCell className="font-medium">{ keyword.keyword }</TableCell>
                            <TableCell>{ keyword.searchVolume.toLocaleString() }</TableCell>
                            <TableCell>
                              <Badge variant="outline">{ keyword.difficulty }</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={ keyword.yourRank <= 10 ? 'default' : 'secondary' }
                              >
                                #{ keyword.yourRank }
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={ keyword.competitorRank <= 10 ? 'default' : 'secondary' }
                              >
                                #{ keyword.competitorRank }
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={ rankDiff > 0 ? 'text-red-600' : 'text-green-600' }>
                                { rankDiff > 0 ? `+${rankDiff}` : rankDiff }
                              </span>
                            </TableCell>
                            <TableCell>
                              { getTrendIcon(keyword.trend) }
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={ opportunity === 'Improve' ? 'destructive' : 'outline' }
                              >
                                { opportunity }
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      }) }
                  </TableBody>
                </Table>
              </div>
            </div>
          ) }

          {/* Backlink Analysis */ }
          { analysisType === 'backlinks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Competitor Backlinks</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Filter backlinks..."
                    value={ searchTerm }
                    onChange={ (e) => setSearchTerm(e.target.value) }
                    className="max-w-xs"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referring Page</TableHead>
                      <TableHead>Anchor Text</TableHead>
                      <TableHead>Domain Authority</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Competitor</TableHead>
                      <TableHead>Discovered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { mockBacklinks
                      .filter(b => b.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.anchorText.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(backlink => (
                        <TableRow key={ backlink.id }>
                          <TableCell className="max-w-xs truncate">
                            <a
                              href={ backlink.url }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              { backlink.url }
                            </a>
                          </TableCell>
                          <TableCell>{ backlink.anchorText }</TableCell>
                          <TableCell>
                            <Badge className={ getScoreBadge(backlink.domainAuthority).color }>
                              { backlink.domainAuthority }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={ backlink.follow ? 'default' : 'secondary' }>
                              { backlink.follow ? 'Follow' : 'No-Follow' }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            { mockCompetitors.find(c => c.id === backlink.competitorId)?.domain }
                          </TableCell>
                          <TableCell>
                            { new Date(backlink.discovered).toLocaleDateString() }
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) }
                  </TableBody>
                </Table>
              </div>
            </div>
          ) }

          {/* Ranking Comparison */ }
          { analysisType === 'rankings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Top Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    { mockKeywords.slice(0, 5).map((keyword, index) => (
                      <div key={ keyword.id } className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">#{ index + 1 }</Badge>
                          <span className="font-medium">{ keyword.keyword }</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default">#{ keyword.competitorRank }</Badge>
                          { getTrendIcon(keyword.trend) }
                        </div>
                      </div>
                    )) }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    Traffic Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Competitor Traffic</span>
                      <span className="font-semibold">34,667</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Keyword Gap</span>
                      <span className="font-semibold text-red-600">-450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Backlink Gap</span>
                      <span className="font-semibold text-red-600">-2,100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Opportunity Score</span>
                      <Badge className="bg-blue-100 text-blue-800">High</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) }
        </CardContent>
      </Card>

      {/* Strategic Insights */ }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Strategic Insights
          </CardTitle>
          <CardDescription>
            Actionable recommendations based on competitor analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600">Opportunities</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Target high-value keywords</p>
                    <p className="text-sm text-gray-600">Focus on keywords where competitors rank 5-15</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Build quality backlinks</p>
                    <p className="text-sm text-gray-600">Target domains linking to competitors but not you</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Content gap analysis</p>
                    <p className="text-sm text-gray-600">Create content for competitor keywords you don't target</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-600">Threats</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Competitor content velocity</p>
                    <p className="text-sm text-gray-600">Competitors publishing 3x more content monthly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Brand mention gap</p>
                    <p className="text-sm text-gray-600">Competitors mentioned 40% more in industry</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Technical SEO advantage</p>
                    <p className="text-sm text-gray-600">Competitors have better Core Web Vitals scores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}