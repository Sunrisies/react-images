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
import { getThirdApi } from "@/services/third";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/third")({
  component: RouteComponent,
  validateSearch: (search: { page: string }) => ({
    page: search.page ? Number(search.page) : 1,
  }),
});

function RouteComponent() {
  // 模拟数据 - 实际应从API获取
  const navigate = Route.useNavigate();
  const { page } = Route.useSearch();

  const { data, isPending, error } = getThirdApi({ page: page, limit: 10 });
  if (isPending) return Loading();
  if (error) return <div>Error: {error.message}</div>;
  console.log(data, "data");
  return (
    <Layout>
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => navigate({ to: "/dashboard/third/create" })}
            variant="default"
          >
            新增
          </Button>
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
                    <Button>修改</Button>
                    <Button>删除</Button>
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
