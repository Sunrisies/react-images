import { User, UserUpdateParams } from "@/types/user.type";
import { request } from "@/utils/fetch";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// 获取用户列表
export const useGetUsers = (
  page: number,
  limit: number,
  user_name?: string,
) => {
  return useQuery({
    queryKey: ["users", page, limit, user_name],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (user_name) {
        params.append("user_name", user_name);
      }
      const response = await request.get<User[]>(
        `/v1/users?${params.toString()}`,
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

// 创建用户
// TODO: 换成fetch没有测试
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: UserUpdateParams) => {
      const { code } = await request.post("/auth/register", params);
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
// TODO: 换成fetch没有测试
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...params
    }: { id: number } & UserUpdateParams) => {
      const { code } = await request.put(`/user/${id}`, params);
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

// 删除用户
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { code } = await request.delete(`/user/${id}`);
      if (code === 200) {
        toast.success("删除成功");
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
