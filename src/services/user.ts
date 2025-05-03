import { useAppAxios } from "@/hooks/useAppAxios";
import {request} from '@/utils/fetch'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from 'sonner';

export interface UserUpdateParams {
  user_name: string;
  pass_word?: string;
}

export interface User {
  id: number;
  user_name: string;
  email: string | null;
  phone: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// 获取用户列表
export const useGetUsers = (page: number, limit: number) => {
//   const { get } = useAppAxios();
  
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: async () => {
      const response = await request.get<User[]>(`/user?page=${page}&limit=${limit}`);
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

// 创建用户
export const useCreateUser = () => {
  const { post } = useAppAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UserUpdateParams) => {
      const { code } = await post('/auth/register', params);
      if (code === 200) {
        toast.success("创建用户成功");
      } else {
        toast.error("创建用户失败");
      }
      return code;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// 更新用户
export const useUpdateUser = () => {
  const { put } = useAppAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...params }: { id: number } & UserUpdateParams) => {
      const { code } = await put(`/user/${id}`, params);
      if (code === 200) {
        toast.success("更新成功");
      } else {
        toast.error("更新失败");
      }
      return code;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};