import { IOptions, IParams } from '@/types';
import { DataOnly, GetRequestType, request } from '@/utils/fetch';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { URLSearchParamsUtils } from 'sunrise-utils'


// 获取分类列表
export const useCategories = (params: Partial<IParams> & { type?: string, search?: number | string } = {}) => {
    const mergedParams: IParams = {
        ...({ page: 1, limit: 10 } as IParams),
        ...params,
    };
    const newParams = URLSearchParamsUtils(mergedParams)
    return useQuery<DataOnly<IOptions[]>>({
        queryKey: ['categories', params],
        queryFn: async (): Promise<DataOnly<IOptions[]>> => {
            const response = await request.get<IOptions[]>(`/categories?${newParams}`);
            return response.data;
        }
    });
};

// 创建分类
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (category: {name:string}) => {
            console.log(category,'category')
            const response = await request.post('/categories', category);
            if (response.code === 200) {
                toast.success('创建成功');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });
};

// 更新分类
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (category: { name: string, id: number }) => {
            const response = await request.put(`/categories/${category.id}`, {name:category.name});
            if (response.code === 200) {
                toast.success('更新成功');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });
};

// 删除分类
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await request.delete(`/categories/${id}`);
            if (response.code === 200) {
                toast.success('删除成功');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });
};