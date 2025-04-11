import { useAppAxios } from "@/hooks/useAppAxios";
import { URLSearchParamsUtils } from 'sunrise-utils'
import { IThird } from "@/types/third.type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { request } from "@/utils/fetch";
import { toast } from 'sonner'
import { IPagination, IParams } from "@/types";
export const getThirdApi = (params: Partial<IParams> & { name?: string, categoryId?: number | string } = {}) => {
    const mergedParams: IParams = {
        ...({ page: 1, limit: 10 } as IParams),
        ...params,
    };
    const newParams = URLSearchParamsUtils(mergedParams)
    return useQuery<{ data: IThird[], pagination: IPagination }, AxiosError>({
        queryKey: ["thirdPartyLibrary", params.page, params.limit, params.name, params.categoryId],
        queryFn: async () => {
            const response = await request.get<IThird[]>(`/thirdPartyLibrary?${newParams}`);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}

export const usePostThirdApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: IThird) => {
            const response = await request.post<IThird, any>('/thirdPartyLibrary', params)
            console.log(response, '========') // 这里可以根据实际情况进行处理，比如返回错误信息等，这里只是一个示例，具体根据业务逻辑进行处理即可。
            return response
        },
        onSuccess: () => {
            toast.success('添加成功', {
                duration: 3000,
            })
            // 成功后刷新数据
            queryClient.invalidateQueries({ queryKey: ['thirdPartyLibrary'] })
        }
    })
}
type UpdateParams = { id: number, update: Partial<Omit<IThird, 'id' | 'created_at' | 'updated_at'>> } // 这里的update是一个对象，包含需要更新的字段和值，比如name: 'x', age:
export const usePutThirdApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: UpdateParams) => {
            const { id, update } = params
            const response = await request.put<UpdateParams['update'], any>(`/thirdPartyLibrary/${id}`, update)
            console.log(response, '更新第三方库') // 这里可以根据实际情况进行处理，比如返回错误信息等，这里只是一个示例，具体根据业务逻辑进行处理即可。
            return response
        },
        onSuccess: () => {
            toast.success('更新成功', {
                duration: 3000,
            })
            // 成功后刷新数据
            queryClient.invalidateQueries({ queryKey: ['thirdPartyLibrary'] })
        }
    })
}

export const useDeleteThirdApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await request.delete<IThird, any>(`/thirdPartyLibrary/${id}`)
            console.log(response, '========删除第三方库') // 这里可以根据实际情况进行处理，比如返回错误信息等，这里只是一个示例，具体根据业务逻辑进行处理即可。
            return response
        },
        onSuccess: () => {
            toast.success('删除成功', {
                duration: 3000,
            })
            // 成功后刷新数据
            queryClient.invalidateQueries({ queryKey: ['thirdPartyLibrary'] })
        }
    })
}