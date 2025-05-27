import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layout } from "@/layout";
import { useTextComments } from "@/services/textComments";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-react";
import { formatChineseDateTime } from "sunrise-utils";
import Loading from "@/components/loading";
export const Route = createFileRoute("/dashboard/comments")({
  component: RouteComponent,
  validateSearch: (search: { page: string }) => ({
    page: search.page ? Number(search.page) : 1,
  }),
});
function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page } = Route.useSearch();
  console.log(page, "page");
  const { data, isPending, error } = useTextComments({ page: page, limit: 10 });
  if (isPending) return Loading();
  console.log(data, "data");
  const comments = data?.data!;

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">评论管理</h2>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索评论..."
                className="w-full pl-8"
              />
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
                <DropdownMenuItem>全部评论</DropdownMenuItem>
                <DropdownMenuItem>已批准</DropdownMenuItem>
                <DropdownMenuItem>待审核</DropdownMenuItem>
                <DropdownMenuItem>垃圾评论</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>共 {comments.length} 条评论</span>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>评论者</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>评论内容</TableHead>
                <TableHead className="hidden md:table-cell">文章</TableHead>
                {/* <TableHead className="hidden md:table-cell">状态</TableHead> */}
                <TableHead className="hidden md:table-cell">日期</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">
                          {comment.nickname || "匿名"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {comment.email || "未提供"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{comment.content}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{comment.articleTitle!}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatChineseDateTime(comment.created_at)}{" "}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">更多操作</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>回复</DropdownMenuItem>
                        <DropdownMenuItem>编辑</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                          <Trash className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
