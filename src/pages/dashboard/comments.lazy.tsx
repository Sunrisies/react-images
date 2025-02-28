import {createLazyFileRoute} from '@tanstack/react-router'
import {Layout} from '@/layout'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import {Check, ChevronDown, Filter, MessageSquare, MoreHorizontal, Search, Trash, X} from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import type {Comment} from "@/lib/utils"

export const Route = createLazyFileRoute('/dashboard/comments')({
    component: RouteComponent,
})

function RouteComponent() {
    const comments: Comment[] = [
        {
            id: "1",
            postId: "1",
            author: {
                name: "陈小明",
                email: "chen@example.com",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            content: "这篇文章写得非常好，对我帮助很大！",
            status: "approved",
            createdAt: "2023-05-15 10:30",
        },
        {
            id: "2",
            postId: "4",
            author: {
                name: "李华",
                email: "lihua@example.com",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            content: "我对这个话题很感兴趣，希望能看到更多相关内容。",
            status: "pending",
            createdAt: "2023-05-15 09:45",
        },
        {
            id: "3",
            postId: "1",
            author: {
                name: "王芳",
                email: "wangfang@example.com",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            content: "文章中提到的观点很有启发性，但我有不同的看法...",
            status: "pending",
            createdAt: "2023-05-14 16:20",
        },
        {
            id: "4",
            postId: "7",
            author: {
                name: "张伟",
                email: "zhangwei@example.com",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            content: "非常感谢分享这些信息，我学到了很多！",
            status: "approved",
            createdAt: "2023-05-14 14:15",
        },
        {
            id: "5",
            postId: "5",
            author: {
                name: "刘强",
                email: "liuqiang@example.com",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            content: "这篇文章有一些错误信息，我认为应该修正...",
            status: "spam",
            createdAt: "2023-05-13 20:30",
        },
        {
            id: "6",
            postId: "4",
            author: {
                name: "赵明",
                email: "zhaoming@example.com",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            content: "我完全同意作者的观点，这确实是一个重要的问题。",
            status: "approved",
            createdAt: "2023-05-13 18:45",
        },
        {
            id: "7",
            postId: "1",
            author: {
                name: "孙丽",
                email: "sunli@example.com",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            content: "这篇文章对我的研究很有帮助，感谢分享！",
            status: "pending",
            createdAt: "2023-05-12 11:20",
        },
    ]

    return (
        <Layout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">评论管理</h2>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input type="search" placeholder="搜索评论..." className="w-full pl-8"/>
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
                                <TableHead>评论内容</TableHead>
                                <TableHead className="hidden md:table-cell">文章</TableHead>
                                <TableHead className="hidden md:table-cell">状态</TableHead>
                                <TableHead className="hidden md:table-cell">日期</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comments.map((comment) => (
                                <TableRow key={comment.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={comment.author.avatar} alt={comment.author.name}/>
                                                <AvatarFallback>{comment.author.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{comment.author.name}</div>
                                                <div
                                                    className="text-xs text-muted-foreground">{comment.author.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs truncate">{comment.content}</div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                            <span>
                      {comment.postId === "1"
                          ? "中国传统文化在现代设计中的应用"
                          : comment.postId === "4"
                              ? "人工智能在医疗领域的应用前景"
                              : comment.postId === "5"
                                  ? "5G技术如何改变我们的生活"
                                  : comment.postId === "7"
                                      ? "中国古代建筑的美学特点"
                                      : "未知文章"}
                    </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {comment.status === "approved" ? (
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                                            >
                                                已批准
                                            </Badge>
                                        ) : comment.status === "pending" ? (
                                            <Badge
                                                variant="outline"
                                                className="bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
                                            >
                                                待审核
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                                            >
                                                垃圾评论
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{comment.createdAt}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {comment.status !== "approved" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/20"
                                                >
                                                    <Check className="h-4 w-4"/>
                                                    <span className="sr-only">批准</span>
                                                </Button>
                                            )}
                                            {comment.status !== "spam" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20"
                                                >
                                                    <X className="h-4 w-4"/>
                                                    <span className="sr-only">标记为垃圾评论</span>
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                        <span className="sr-only">更多操作</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>回复</DropdownMenuItem>
                                                    <DropdownMenuItem>编辑</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                        <Trash className="mr-2 h-4 w-4"/>
                                                        删除
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
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
