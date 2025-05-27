import { IParams } from '@/types';
import { DataOnly, request } from '@/utils/fetch';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { URLSearchParamsUtils } from 'sunrise-utils';

interface Link {
  value: number;
  label: string;
  url: string;
  description?: string;
}

interface LinkResponse {
  data: Link[];
  pagination: {
    total: number;
    limit: number;
    page: number;
  };
}

interface LinkParams {
  search?: string;
  page?: number;
  limit?: number;
}
// 获取友链列表

export const useLinks = (params: Partial<IParams> & { type?: string, search?: number | string } = {}) => {
    const mergedParams: IParams = {
        ...({ page: 1, limit: 10 } as IParams),
        ...params,
    };
    const newParams = URLSearchParamsUtils(mergedParams)
    return useQuery<DataOnly<LinkResponse[]>>({
        queryKey: ['links', params],
        queryFn: async (): Promise<DataOnly<LinkResponse[]>> => {
            const response = await request.get<LinkResponse[]>(`/links?${newParams}`);
            return response.data;
        }
    });
};

// 创建友链
export const useCreateLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (link: Omit<Link, 'value'>) => {
      const response = await request.post('/new/api/links', link);
      if (response.code === 200) {
        toast.success('创建成功');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    }
  });
};

// 更新友链
export const useUpdateLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (link: Link) => {
      const response = await request.put(`/new/api/links/${link.value}`, link);
      if (response.code === 200) {
        toast.success('更新成功');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    }
  });
};

// 删除友链
export const useDeleteLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await request.delete(`/new/api/links/${id}`);
      if (response.code === 200) {
        toast.success('删除成功');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    }
  });
};