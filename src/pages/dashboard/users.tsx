import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserFormDialog } from '@/components/user-form-dialog';
import { Layout } from "@/layout";
import { useDeleteUser, useGetUsers } from '@/services/user';
import { User } from '@/types/user.type';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronDown, Filter, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { useState } from 'react';

export const Route = createFileRoute('/dashboard/users')({
  component: RouteComponent,
  validateSearch: (search: { page?: string, limit?: string, search?: string }) => {
    const result: { page: number; limit: number; search?: string } = {
      page: search.page ? Number(search.page) : 1,
      limit: search.limit ? Number(search.limit) : 10,
    };

    if (search.search) {
      result.search = search.search;
    }

    return result;
  },
})

function RouteComponent() {
  // 使用 useSearch 获取验证后的搜索参数
  const { page, limit, search } = Route.useSearch()
  const navigate = Route.useNavigate()

  // 处理搜索事件
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value;
      navigate({
        search: {
          page: 1,
          limit,
          ...(value ? { search: value } : {})
        }
      })
    }
  };

  // 使用搜索参数进行查询
  const { data } = useGetUsers(page, limit, search || '');

  const deleteUser = useDeleteUser();

  const users = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0 };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  console.log(data, 'data');

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };


  // 修改页码变化的处理函数
  const handlePageChange = (newPage: number) => {
    // 使用 navigate 更新 URL
    navigate({
      search: {
        page: newPage,
        limit
      }
    })
  }

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">用户管理</h2>
          <Button className="bg-primary" onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            添加用户
          </Button>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索用户..."
                className="w-full pl-8"
                defaultValue={search || ''}
                onKeyDown={handleSearch}
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
                <DropdownMenuItem>全部用户</DropdownMenuItem>
                <DropdownMenuItem>管理员</DropdownMenuItem>
                <DropdownMenuItem>编辑</DropdownMenuItem>
                <DropdownMenuItem>作者</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>共 {pagination.total} 个用户</span>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>电话</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image || undefined} alt={user.user_name} />
                        <AvatarFallback>{user.user_name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.user_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email || '未设置'}</TableCell>
                  <TableCell>{user.phone || '未设置'}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">操作菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            if (window.confirm('确定要删除这个用户吗？此操作不可撤销。')) {
                              deleteUser.mutateAsync(user.id);
                            }
                          }}
                        >
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            上一页
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">第 {page} 页</span>
            <span className="text-sm text-muted-foreground">
              共 {Math.ceil(pagination.total / limit)} 页
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= Math.ceil(pagination.total / limit)}
          >
            下一页
          </Button>
        </div>
      </div>
      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSuccess={() => {
          setIsDialogOpen(false);
        }}
      />

    </Layout>
  );
}

