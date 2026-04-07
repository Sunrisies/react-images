import Loading from "@/components/loading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaginationWrapper } from "@/components/ui/pagination-wrapper"
import { Layout } from "@/layout"
import { useGetArticle } from "@/services/article"
import { createFileRoute } from "@tanstack/react-router"
import { ChevronDown, Divide, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash } from "lucide-react"
import DataTable from "@/components/data-table"
import { useState } from "react"

export const Route = createFileRoute("/dashboard/articles")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => ({
    page: search.page ? Number(search.page) : 1,
    search: search?.search ?? "",

  }),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  // const { page } = Route.useSearch()
  const { page, search: searchQuery } = Route.useSearch()
  let [isLoading, setIsLoading] = useState(false)

  const { data, isPending, error } = useGetArticle({ page: page, limit: 10 })
  console.log(data, '==============')
  if (isPending) return Loading()
  if (error) return <div>Error: { error.message }</div>
  const { data: article, pagination } = data

  // 状态映射函数
  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant="outline" className={ status ? "bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400" : "bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400" }>
        { status ? "已发布" : "未发布" }
      </Badge>
    )
  }

  const columns = [
    {
      key: "title",
      title: "标题",
    },
    {
      key: "is_top",
      title: "置顶",
    },
    {
      key: "author",
      title: "作者",
    },
    {
      key: "publish_time",
      title: "发布时间",
    },
    {
      key: "views",
      title: "浏览量",
    },
    {
      key: "comments",
      title: "评论数",
    },
  ]

  return (
    <Layout>
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">文章管理</h2>
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Button>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="搜索文章..." className="w-full pl-8" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  筛选
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>全部文章</DropdownMenuItem>
                <DropdownMenuItem>已发布</DropdownMenuItem>
                <DropdownMenuItem>草稿</DropdownMenuItem>
                <DropdownMenuItem>已计划</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>共 { pagination!.total } 篇文章</span>
          </div>
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={ columns }
            data={ data?.data || [] }
            loading={ isLoading }
            search={ {
              placeholder: "搜索文章...",
              onSearch: (value) => {
                navigate({
                  to: "/dashboard/articles",
                  search: { page: 1, search: value }
                })
              }
            } }
            cellProps={ (column, record, index) => {
              // 根据列键设置不同的样式
              if (column.key === 'title') {
                return { className: 'font-medium text-blue-600 w-64 max-w-[600px]' }
              }
              if (column.key === 'is_top') {
                return { className: 'text-center w-24' }
              }
              return {}
            } }
            cellRender={ (column, value, record, index) => {
              if (column.key === "title") {
                return (
                  <div className="flex flex-col">
                    <div className="group relative">
                      <span className="truncate block" title={ record.title }>
                        { record.title }
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground truncate" title={ record.description }>
                      { record.description || '暂无描述' }
                    </span>
                  </div>
                )
              }
              if (column.key === "is_top") {
                return <Badge variant="outline" className={ record.is_top ? "bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" : "bg-gray-50 text-gray-700 hover:bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400" }>
                  { record.is_top ? "已置顶" : "未置顶" }
                </Badge>
              }
              if (column.key === "author") {
                return <span>{ record.author }</span>
              }
              if (column.key === "publish_time") {
                return record.publish_time ? (
                  <div className="flex flex-col">
                    { record.publish_time }
                  </div>
                ) : "—"
              }
              if (column.key === "views") {
                return (

                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    { record.views || 0 }
                  </div>
                )
              }
              if (column.key === "comments") {
                return <span>
                  { record.comments || 0 }
                </span>
              }

            } }
            actions={ {
              render: (record: IOptions) => (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">操作菜单</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={ () => navigate({ to: '/dashboard/editor', search: { id: post.id } }) }>
                    <Edit className="mr-2 h-4 w-4" />
                    编辑
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    预览
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                    <Trash className="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )
            } }
            pagination={ {
              current: page,
              total: data?.pagination?.total || 0,
              pageSize: 10,
              onChange: (newPage) => {
                navigate({
                  to: "/dashboard/articles",
                  search: { page: newPage, search: searchQuery }
                })
              }
            } }
          />
        </div>
      </div>
    </Layout>
  )
}
