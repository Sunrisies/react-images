import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/layout";
import { useCreateLink, useDeleteLink, useLinks, useUpdateLink } from "@/services/links";
import { createFileRoute } from "@tanstack/react-router";
import { KeyboardEvent, useState } from "react";
import { toast } from "sonner";

interface LinkForm {
  label: string;
  url: string;
  description?: string;
}

export const Route = createFileRoute("/dashboard/links")({
  component: LinksPage,
});

function LinksPage() {
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkForm | null>(null);
  const [formData, setFormData] = useState<LinkForm>({
    label: "",
    url: "",
    description: ""
  });
  
  const { data, isLoading } = useLinks({ search, page, limit: 10 });
  if(Loading) return Loading();
  const createLink = useCreateLink();
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();

  const handleSubmit = async () => {
    if (!formData.label.trim() || !formData.url.trim()) {
      toast.error("名称和链接不能为空");
      return;
    }

    try {
      if (editingLink) {
        await updateLink.mutateAsync({
          ...formData,
          value: editingLink.value
        });
      } else {
        await createLink.mutateAsync(formData);
      }
      setIsDialogOpen(false);
      setFormData({ label: "", url: "", description: "" });
      setEditingLink(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (link: LinkForm) => {
    setEditingLink(link);
    setFormData(link);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个友情链接吗？")) {
      try {
        await deleteLink.mutateAsync(id);
      } catch (error) {
        console.error(error);
      }
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
          <h2 className="text-3xl font-bold tracking-tight">友情链接</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="px-4 py-2"
                onClick={() => {
                  setEditingLink(null);
                  setFormData({ label: "", url: "", description: "" });
                }}
              >
                新增友链
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingLink ? "编辑友链" : "新增友链"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="请输入网站名称"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  autoFocus
                />
                <Input
                  placeholder="请输入网站链接"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                <Textarea
                  placeholder="请输入网站描述（可选）"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Button onClick={handleSubmit}>
                  {editingLink ? "保存" : "创建"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <div className="flex items-center justify-between p-4 border-b">
            <Input
              placeholder="搜索友链..."
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
                <TableHead>链接</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="w-[150px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((link) => (
                <TableRow key={link.value}>
                  <TableCell className="font-medium">{link.value}</TableCell>
                  <TableCell>{link.label}</TableCell>
                  <TableCell>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell>{link.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(link)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(link.value)}
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
