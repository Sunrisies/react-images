import { IOptions, IParams } from '@/types';
import { DataOnly, request } from '@/utils/fetch';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { URLSearchParamsUtils } from 'sunrise-utils';

// 获取标签列表
export const useTags = (params: Partial<IParams> & { type?: string, search?: number | string } = {}) => {
    const mergedParams: IParams = {
        ...({ page: 1, limit: 10 } as IParams),
        ...params,
    };
    const newParams = URLSearchParamsUtils(mergedParams)
    return useQuery<DataOnly<IOptions[]>>({
        queryKey: ['tags', params],
        queryFn: async (): Promise<DataOnly<IOptions[]>> => {
            const response = await request.get<IOptions[]>(`/tags?${newParams}`);
            return response.data;
        }
    });
};

// 创建标签
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tag:  {name:string}) => {
      const response = await request.post('/tags', tag);
      if (response.code === 200) {
        toast.success('创建成功');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    }
  });
};

// 更新标签
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tag: { name: string, id: number }) => {
      const response = await request.put(`/tags/${tag.id}`, {name:tag.name});
      if (response.code === 200) {
        toast.success('更新成功');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    }
  });
};

// 删除标签
export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await request.delete(`/tags/${id}`);
      if (response.code === 200) {
        toast.success('删除成功');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    }
  });
};