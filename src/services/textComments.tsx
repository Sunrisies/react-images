import type { Comment } from "@/lib/utils";
import { request } from '@/utils/fetch';
import {
  keepPreviousData,
  useQuery
} from "@tanstack/react-query";
export const useTextComments = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery<{ data: Comment[]; total?: number }>({
    queryKey: ["articleComments", page, limit],
    queryFn: async () =>
      (await request.get<Comment[]>(
        `/articleComments/admin?page=${page}&limit=${limit}`
      )).data,
    placeholderData: keepPreviousData,
  });
};
