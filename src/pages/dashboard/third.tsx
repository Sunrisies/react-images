import Loading from "@/components/loading";
import { ThirdForm } from "@/components/third/third-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layout } from "@/layout/index";
import { getCategoriesApi } from "@/services/common";
import { getThirdApi, useDeleteThirdApi } from "@/services/third";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/dashboard/third")({
  component: RouteComponent,
  validateSearch: (search: { page: string }) => ({
    page: search.page ? Number(search.page) : 1,
  }),
});

function RouteComponent() {
  const { mutateAsync: delThird } = useDeleteThirdApi();
  const { data: categories } = getCategoriesApi();
  // 新增搜索表单
  const searchForm = useForm({
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });
  const [searchParams, setSearchParams] = useState<{
    name?: string;
    categoryId?: string;
  }>({});
  // 添加防抖处理
  useEffect(() => {
    const subscription = searchForm.watch((value) => {
      console.log(value, "value"); // 打印响应数据以进行调试
      const timer = setTimeout(() => {
        setSearchParams(value);
        console.log(value, "value"); // 打印响应数据以进行调试
      }, 500);
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, []); // 空依赖数组确保只运行一次
  const navigate = Route.useNavigate();
  const { page } = Route.useSearch();
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isPending, error } = getThirdApi({
    page: page,
    limit: 10,
    ...searchParams,
  });
  if (isPending) return Loading();
  if (error) return <div>Error: {error.message}</div>;
  const editItem = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };
  const deleteItem = async ({ id }: any) => {
    await delThird(id);
  };

  return (
    <Layout>
      {/* 添加搜索功能比如名称搜索，分类搜索等 */}
      <div className="p-6 space-y-4">
        <div className="flex gap-4 items-center">
          <Label>名称搜索</Label>
          <Input
            placeholder="按名称搜索"
            className="max-w-[300px]"
            {...searchForm.register("name")}
          />
          <Label>分类</Label>

          <Select
            onValueChange={(value) => searchForm.setValue("categoryId", value)}
            value={searchForm.watch("categoryId")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value.toString()}
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              searchForm.reset();
              navigate({ search: { page: 1 } });
            }}
          >
            重置
          </Button>
        </div>
        <div>{JSON.stringify(selectedItem)}</div>
        <div className="flex justify-end">
          <Dialog
            open={isDialogOpen}
            onOpenChange={() => {
              setIsDialogOpen(!isDialogOpen);
              setSelectedItem(undefined);
            }}
          >
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
                }}
                initialData={selectedItem}
                categories={categories!}
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
                  {new Date(item.created_at!).toLocaleDateString()}
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
        {/* 添加分页 */}
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        page: 1,
                      }),
                    })
                  }
                  className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                />
              </PaginationItem>
              {Array.from(
                {
                  length: Math.ceil(
                    data.pagination!.total / data.pagination!.limit
                  ),
                },
                (_, i) => i + 1
              ).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => navigate({ search: { page: p } })}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        page: Math.min(
                          Math.ceil(
                            data.pagination!.total / data.pagination!.limit
                          ),
                          page + 1
                        ),
                      }),
                    })
                  }
                  className={
                    page ===
                    Math.ceil(data.pagination!.total / data.pagination!.limit)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Layout>
  );
}
