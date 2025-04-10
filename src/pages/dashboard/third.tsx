import { createFileRoute } from "@tanstack/react-router";
import Loading from "@/components/loading";
import { Layout } from "@/layout/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getThirdApi, useDeleteThirdApi } from "@/services/third";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ThirdForm } from "@/components/third/third-form";

export const Route = createFileRoute("/dashboard/third")({
  component: RouteComponent,
  validateSearch: (search: { page: string }) => ({
    page: search.page ? Number(search.page) : 1,
  }),
});

function RouteComponent() {
  const { mutateAsync: delThird } = useDeleteThirdApi();
  // 模拟数据 - 实际应从API获取
  const navigate = Route.useNavigate();
  const { page } = Route.useSearch();
  const [selectedItem, setSelectedItem] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isPending, error } = getThirdApi({ page: page, limit: 10 });
  if (isPending) return Loading();
  if (error) return <div>Error: {error.message}</div>;
  console.log(data, "data");
  const editItem = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };
  const deleteItem = async ({ id }: any) => {
    // 实现删除逻辑
    console.log(`Deleting item: `, id);
    await delThird(id);
  };

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <div>{JSON.stringify(selectedItem)}</div>
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">新增</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedItem ? "编辑" : "新增"}第三方库
                </DialogTitle>
              </DialogHeader>
              <ThirdForm
                onSuccess={() => {
                  setIsDialogOpen(false);
                  // 这里添加数据刷新逻辑
                }}
                initialData={selectedItem}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>官方链接</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>标签</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {item.officialUrl}
                  </a>
                </TableCell>
                <TableCell>{item.category.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button onClick={() => editItem(item)}>修改</Button>
                    <Button onClick={() => deleteItem(item)}>删除</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
