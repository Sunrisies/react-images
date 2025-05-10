import { createFileRoute } from '@tanstack/react-router'
import { useVisitLogs } from '@/services/visitLog';
import { Layout } from '@/layout/index'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { getRelativeTime } from 'sunrise-utils'
import { zhCN } from 'date-fns/locale';
import { Monitor, Globe, Chrome, Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState } from 'react';
import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const Route = createFileRoute('/dashboard/visit-log')({
  component: RouteComponent,
  validateSearch: (search: { page: string }) => ({
    page: search.page ? Number(search.page) : 1,
  }),
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;
  const { page } = Route.useSearch();
  const { data, isLoading, error, refetch } = useVisitLogs({
    page: page,
    limit: pageSize
  });
  const navigate = Route.useNavigate();

  // 搜索处理函数
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // 重置处理函数
  const handleReset = () => {
    setSearchTerm('');
    refetch();
  };

  // 过滤数据
  const filteredData = data?.data.filter(log =>
    log.url_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.page_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.session.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex items-center justify-center h-full">加载中...</div>
  if (error) return <div className="text-red-500">错误: {error.message}</div>
  if (!data) return <div>暂无数据</div>

  // 统计设备类型
  const deviceStats = data.data.reduce((acc, curr) => {
    acc[curr.session.device] = (acc[curr.session.device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 统计浏览器类型
  const browserStats = data.data.reduce((acc, curr) => {
    acc[curr.session.browser] = (acc[curr.session.browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 统计操作系统
  const osStats = data.data.reduce((acc, curr) => {
    acc[curr.session.os] = (acc[curr.session.os] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 统计城市
  const cityStats = data.data.reduce((acc, curr) => {
    acc[curr.session.city] = (acc[curr.session.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* 搜索栏 */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索访问记录..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="">
          {/* 访问详情表格 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>访问详情</CardTitle>
              <div className="text-sm text-muted-foreground">
                共 {filteredData?.length || 0} 条记录
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">访问页面</TableHead>
                    <TableHead className="w-[200px]">页面标题</TableHead>
                    <TableHead className="w-[150px]">访问时间</TableHead>
                    <TableHead className="w-[150px]">来源域名</TableHead>
                    <TableHead className="w-[150px]">设备信息</TableHead>
                    <TableHead className="w-[150px]">地理位置</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData?.map((log) => (
                    <TableRow key={log.event_id}>
                      <TableCell className="font-medium">{log.url_path}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-help">
                              {log.page_title || '-'}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs break-words">{log.page_title || '-'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {getRelativeTime(new Date(log.created_at))}
                      </TableCell>
                      <TableCell>{log.referrer_domain || '直接访问'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
                          {log.session.device} / {log.session.browser}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900">
                          {log.session.city} ({log.session.country})
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 分页 */}
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => navigate({ search: { page: 1 } })}
                        className={cn(page === 1 ? "opacity-50 cursor-not-allowed" : "", 'cursor-pointer')}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(data.pagination!.total / pageSize) }, (_, i) => i + 1)
                      .filter(pageNum => {
                        // 显示第一页、最后一页，和当前页附近的页码
                        const lastPage = Math.ceil(data.pagination!.total / pageSize);
                        return pageNum === 1 ||
                          pageNum === lastPage ||
                          (pageNum >= page - 1 && pageNum <= page + 1);
                      })
                      .map((p, index, array) => (
                        <React.Fragment key={p}>
                          {index > 0 && array[index - 1] !== p - 1 && (
                            <PaginationEllipsis />
                          )}
                          <PaginationItem>
                            <PaginationLink
                              isActive={page === p}
                              onClick={() => navigate({ search: { page: p } })}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              page: Math.min(
                                Math.ceil(
                                  data!.pagination!.total / data!.pagination!.limit
                                ),
                                page + 1
                              ),
                            }),
                          })
                        }
                        className={cn(page >= Math.ceil(data.pagination!.total / pageSize) ? "opacity-50 cursor-not-allowed" : "", 'cursor-pointer')}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
