import { Layout } from "@/layout";
import { createFileRoute } from "@tanstack/react-router";
import { useState, KeyboardEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/services/categories";
import { toast } from "sonner";
import { IOptions } from "@/types";
import Loading from "@/components/loading";
export const Route = createFileRoute("/dashboard/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IOptions | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [searchValue, setSearchValue] = useState("");  // 新增一个状态用于输入框的值
  
  const { data, isLoading } = useCategories({ search, page, limit: 10 });
  if(isLoading) return Loading()
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error("分类名称不能为空");
      return;
    }

    try {
        if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.value,
          name: categoryName
        });
      } else {
        await createCategory.mutateAsync({
          name: categoryName
        });
      }
      setIsDialogOpen(false);
      setCategoryName("");
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: IOptions) => {
    setEditingCategory(category);
    setCategoryName(category.label);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个分类吗？")) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearch(searchValue);  // 只在回车时更新搜索条件
      setPage(1);  // 重置页码
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">分类管理</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="px-4 py-2"
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryName("");
                }}
              >
                新增分类
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingCategory ? "编辑分类" : "新增分类"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="请输入分类名称，回车确认"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="col-span-3"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <div className="flex items-center justify-between p-4 border-b">
            <Input
              placeholder="搜索分类..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>名称</TableHead>
                <TableHead className="w-[150px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((category) => (
                <TableRow key={category.value}>
                  <TableCell className="font-medium">{category.value}</TableCell>
                  <TableCell>{category.label}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category.value)}
                      >
                        删除
                      </Button>
                    </div>
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
