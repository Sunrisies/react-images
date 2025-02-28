import {createLazyFileRoute} from '@tanstack/react-router'
import {Layout} from "@/layout";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import {ChevronDown, Filter, MoreHorizontal, Search, UserPlus} from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
// import type {User} from "@/lib/utils"
export const Route = createLazyFileRoute('/dashboard/users')({
    component: RouteComponent,
})

function RouteComponent() {
    const users: any[] = [
        {
            id: "1",
            name: "李明",
            email: "liming@example.com",
            role: "admin",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "2",
            name: "王华",
            email: "wanghua@example.com",
            role: "editor",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "3",
            name: "张伟",
            email: "zhangwei@example.com",
            role: "author",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "4",
            name: "刘芳",
            email: "liufang@example.com",
            role: "author",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "5",
            name: "赵明",
            email: "zhaoming@example.com",
            role: "editor",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "6",
            name: "孙丽",
            email: "sunli@example.com",
            role: "author",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ]

    return (
        <Layout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">用户管理</h2>
                    <Button className="bg-primary">
                        <UserPlus className="mr-2 h-4 w-4"/>
                        添加用户
                    </Button>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="搜索用户..."
                                className="w-full pl-8"
                            />
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
                                <DropdownMenuItem>全部用户</DropdownMenuItem>
                                <DropdownMenuItem>管理员</DropdownMenuItem>
                                <DropdownMenuItem>编辑</DropdownMenuItem>
                                <DropdownMenuItem>作者</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>共 {users.length} 个用户</span>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>用户</TableHead>
                                <TableHead>邮箱</TableHead>
                                <TableHead>角色</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} alt={user.name}/>
                                                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{user.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.role === "admin" ? (
                                            <Badge variant="outline"
                                                   className="bg-primary/10 text-primary hover:bg-primary/10">
                                                管理员
                                            </Badge>
                                        ) : user.role === "editor" ? (
                                            <Badge variant="outline"
                                                   className="bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400">
                                                编辑
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline"
                                                   className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                                                作者
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                    <span className="sr-only">操作菜单</span>\
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>编辑</DropdownMenuItem>
                                                <DropdownMenuItem>删除</DropdownMenuItem>
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
