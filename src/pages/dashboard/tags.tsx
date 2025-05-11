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
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/services/tags";
import { toast } from "sonner";
import { IOptions } from "@/types";

export const Route = createFileRoute("/dashboard/tags")({
  component: TagsPage,
});

function TagsPage() {
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<IOptions | null>(null);
  const [tagName, setTagName] = useState("");
  
  const { data, isLoading } = useTags({ search, page, limit: 10 });
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const handleSubmit = async () => {
    if (!tagName.trim()) {
      toast.error("标签名称不能为空");
      return;
    }

    try {
      if (editingTag) {
        await updateTag.mutateAsync({
          id: editingTag.value,
          name: tagName
        });
      } else {
        await createTag.mutateAsync({
          name: tagName
        });
      }
      setIsDialogOpen(false);
      setTagName("");
      setEditingTag(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (tag: IOptions) => {
    setEditingTag(tag);
    setTagName(tag.label);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个标签吗？")) {
      try {
        await deleteTag.mutateAsync(id);
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
      setSearch(searchValue);
      setPage(1);
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
          <h2 className="text-3xl font-bold tracking-tight">标签管理</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="px-4 py-2"
                onClick={() => {
                  setEditingTag(null);
                  setTagName("");
                }}
              >
                新增标签
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingTag ? "编辑标签" : "新增标签"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="请输入标签名称，回车确认"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
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
              placeholder="搜索标签..."
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
              {data?.data.map((tag) => (
                <TableRow key={tag.value}>
                  <TableCell className="font-medium">{tag.value}</TableCell>
                  <TableCell>{tag.label}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(tag)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(tag.value)}
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
