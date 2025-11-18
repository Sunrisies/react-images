import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Globe,
  Target
} from 'lucide-react';
import { useSEORankings } from '@/hooks/useSEORankings';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface RankingTrackerProps {
  className?: string;
}

export const RankingTracker: React.FC<RankingTrackerProps> = ({ className }) => {
  const {
    rankings,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedEngine,
    setSelectedEngine,
    dateRange,
    setDateRange,
    refreshRankings,
    exportRankings,
    filters,
    setFilters
  } = useSEORankings();

  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const handleKeywordSelect = (keywordId: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(keywordId)) {
      newSelected.delete(keywordId);
    } else {
      newSelected.add(keywordId);
    }
    setSelectedKeywords(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedKeywords.size === rankings.length) {
      setSelectedKeywords(new Set());
    } else {
      setSelectedKeywords(new Set(rankings.map(r => r.id)));
    }
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getRankChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank <= 3) return 'default';
    if (rank <= 10) return 'secondary';
    if (rank <= 30) return 'outline';
    return 'destructive';
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            排名追踪
          </CardTitle>
          <CardDescription>监控关键词在搜索引擎中的排名表现</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">加载排名数据失败: {error.message}</p>
            <Button onClick={refreshRankings} className="mt-4">
              重试
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedEngine} onValueChange={setSelectedEngine}>
              <SelectTrigger className="w-[180px]">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baidu">百度</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="sogou">搜狗</SelectItem>
                <SelectItem value="360">360搜索</SelectItem>
                <SelectItem value="bing">Bing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">最近7天</SelectItem>
                <SelectItem value="30d">最近30天</SelectItem>
                <SelectItem value="90d">最近90天</SelectItem>
                <SelectItem value="custom">自定义</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={refreshRankings}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={exportRankings}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">排名范围</label>
                  <Select
                    value={filters.rankRange}
                    onValueChange={(value) => setFilters({ ...filters, rankRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="1-10">前10名</SelectItem>
                      <SelectItem value="11-30">11-30名</SelectItem>
                      <SelectItem value="31-100">31-100名</SelectItem>
                      <SelectItem value="100+">100名以外</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">变化趋势</label>
                  <Select
                    value={filters.trend}
                    onValueChange={(value) => setFilters({ ...filters, trend: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="up">上升</SelectItem>
                      <SelectItem value="down">下降</SelectItem>
                      <SelectItem value="stable">稳定</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">搜索量</label>
                  <Select
                    value={filters.searchVolume}
                    onValueChange={(value) => setFilters({ ...filters, searchVolume: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="high">高 ( 10000)</SelectItem>
                      <SelectItem value="medium">中 (1000-10000)</SelectItem>
                      <SelectItem value="low">低 (1000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">总关键词数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rankings.length}</div>
            <p className="text-xs text-gray-500">活跃追踪</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">前10名</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rankings.filter(r => r.currentRank <= 10).length}
            </div>
            <Progress
              value={(rankings.filter(r => r.currentRank <= 10).length / rankings.length) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">平均排名</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rankings.length > 0
                ? Math.round(rankings.reduce((sum, r) => sum + r.currentRank, 0) / rankings.length)
                : 0
              }
            </div>
            <p className="text-xs text-gray-500">所有关键词</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">上升关键词</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rankings.filter(r => r.rankChange > 0).length}
            </div>
            <p className="text-xs text-gray-500">较上期</p>
          </CardContent>
        </Card>
      </div>

      {/* Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            详细排名数据
          </CardTitle>
          <CardDescription>
            {selectedKeywords.size > 0 && (
              <span className="text-blue-600">已选择 {selectedKeywords.size} 个关键词</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedKeywords.size === rankings.length && rankings.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>关键词</TableHead>
                  <TableHead className="text-center">当前排名</TableHead>
                  <TableHead className="text-center">变化</TableHead>
                  <TableHead className="text-center">搜索量</TableHead>
                  <TableHead className="text-center">竞争度</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">更新时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        正在加载排名数据...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : rankings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      暂无排名数据，请先添加关键词进行追踪
                    </TableCell>
                  </TableRow>
                ) : (
                  rankings.map((ranking) => (
                    <TableRow key={ranking.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedKeywords.has(ranking.id)}
                          onChange={() => handleKeywordSelect(ranking.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ranking.keyword}</div>
                          <div className="text-sm text-gray-500">
                            {ranking.category} • {ranking.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getRankBadgeVariant(ranking.currentRank)}>
                          #{ranking.currentRank}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRankChangeColor(ranking.rankChange)}`}>
                          {getRankChangeIcon(ranking.rankChange)}
                          {ranking.rankChange > 0 ? '+' : ''}{ranking.rankChange}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm font-medium">
                          {ranking.searchVolume?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ranking.cpc ? `¥${ranking.cpc}` : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${ranking.competition}%` }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-600">
                            {ranking.competition}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={ranking.url}>
                          <a
                            href={ranking.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {ranking.url}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {format(new Date(ranking.lastUpdated), 'MM-dd HH:mm', { locale: zhCN })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};