import { useAppAxios } from "@/hooks/useAppAxios";
import { ArticleType } from "@/types/article.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { message } from "antd";
import { AxiosError } from "axios";
import {request } from '@/utils/fetch'
import type { Comment } from "@/lib/utils";
export const useTextComments = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery<{ data: Comment[]; total?: number }, AxiosError>({
    queryKey: ["articleComments", page, limit],
    queryFn: async () =>
      (await request.get<Comment[]>(
        `/articleComments/admin?page=${page}&limit=${limit}`
      )).data,
    placeholderData: keepPreviousData,
  });
};
