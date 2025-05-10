import { ArticleType } from "@/types/article.types";
import { request } from '@/utils/fetch';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { message } from "antd";

export const useGetArticle = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["article", page, limit],
    queryFn: async () =>
      (await request.get<ArticleType[]>(`/article?page=${page}&limit=${limit}`)).data,
    placeholderData: keepPreviousData,
  });
};

// TODO: 由axios换成request还没有测试过
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { code } = await request.delete(`/article/${id}`);
      if (code === 200) {
        message.success("删除成功");
      } else {
        message.error("删除失败");
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });
};
// TODO: 由axios换成request还没有测试过
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...params }: Partial<ArticleType>) => {
      const { code } = await request.put(`/article/${id}`, params);
      if (code === 200) {
        message.success("更新成功");
      } else {
        message.error("更新失败");
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });
};
