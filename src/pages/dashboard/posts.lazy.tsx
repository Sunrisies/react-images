import {createLazyFileRoute} from '@tanstack/react-router'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import {ChevronDown, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash} from "lucide-react"
import {Layout} from "@/layout";

export const Route = createLazyFileRoute('/dashboard/posts')({
    component: RouteComponent,
})

function RouteComponent() {
    const posts = [
        {
            id: "1",
            title: "中国传统文化在现代设计中的应用",
            status: "published",
            publishedAt: "2023-05-15",
            author: "李明",
            views: 1245,
            comments: 32,
        },
        {
            id: "2",
            title: "数字化转型：企业面临的挑战与机遇",
            status: "draft",
            publishedAt: null,
            author: "王华",
            views: 0,
            comments: 0,
        },
        {
            id: "3",
            title: "可持续发展：绿色科技的未来",
            status: "scheduled",
            publishedAt: "2023-06-01",
            author: "张伟",
            views: 0,
            comments: 0,
        },
        {
            id: "4",
            title: "人工智能在医疗领域的应用前景",
            status: "published",
            publishedAt: "2023-05-10",
            author: "刘芳",
            views: 876,
            comments: 15,
        },
        {
            id: "5",
            title: "5G技术如何改变我们的生活",
            status: "published",
            publishedAt: "2023-05-05",
            author: "赵明",
            views: 1532,
            comments: 45,
        },
        {
            id: "6",
            title: "区块链技术在供应链管理中的应用",
            status: "draft",
            publishedAt: null,
            author: "孙丽",
            views: 0,
            comments: 0,
        },
        {
            id: "7",
            title: "中国古代建筑的美学特点",
            status: "published",
            publishedAt: "2023-04-28",
            author: "李明",
            views: 2145,
            comments: 67,
        },
        {
            id: "8",
            title: "现代艺术与传统文化的碰撞",
            status: "scheduled",
            publishedAt: "2023-06-05",
            author: "王华",
            views: 0,
            comments: 0,
        },
    ]

    return (
        <Layout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">文章管理</h2>
                    <Button className="bg-primary">
                        <Plus className="mr-2 h-4 w-4"/>
                        新建文章
                    </Button>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input type="search" placeholder="搜索文章..." className="w-full pl-8"/>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9">
                                    <Filter className="mr-2 h-4 w-4"/>
                                    筛选
                                    <ChevronDown className="ml-2 h-4 w-4"/>
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
                        <span>共 {posts.length} 篇文章</span>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>标题</TableHead>
                                <TableHead>状态</TableHead>
                                <TableHead>作者</TableHead>
                                <TableHead className="hidden md:table-cell">发布日期</TableHead>
                                <TableHead className="hidden md:table-cell">浏览量</TableHead>
                                <TableHead className="hidden md:table-cell">评论数</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>
                                        {post.status === "published" ? (
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                                            >
                                                已发布
                                            </Badge>
                                        ) : post.status === "scheduled" ? (
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                                            >
                                                已计划
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
                                            >
                                                草稿
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{post.author}</TableCell>
                                    <TableCell className="hidden md:table-cell">{post.publishedAt || "—"}</TableCell>
                                    <TableCell className="hidden md:table-cell">{post.views || "—"}</TableCell>
                                    <TableCell className="hidden md:table-cell">{post.comments || "—"}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                    <span className="sr-only">操作菜单</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4"/>
                                                    编辑
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4"/>
                                                    预览
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                    <Trash className="mr-2 h-4 w-4"/>
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
    )
}
