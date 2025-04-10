import { useAppAxios } from "@/hooks/useAppAxios";
import { IThird } from "@/types/third.type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { request } from "@/utils/fetch";
export const getThirdApi = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    return useQuery<{ data: IThird[] }, AxiosError>({
        queryKey: ["thirdPartyLibrary", page, limit],
        queryFn: async () => {
            const response = await request.get<IThird[]>(`/thirdPartyLibrary?page=${page}&limit=${limit}`);
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
            // 成功后刷新数据
            queryClient.invalidateQueries({ queryKey: ['thirdPartyLibrary'] })
        }
    })
}

export const usePutThirdApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: { id: number, update: IThird }) => {
            const { id, update } = params
            const response = await request.put<IThird, any>(`/thirdPartyLibrary/${id}`, update)
            console.log(response, '更新第三方库') // 这里可以根据实际情况进行处理，比如返回错误信息等，这里只是一个示例，具体根据业务逻辑进行处理即可。
            return response
        },
        onSuccess: () => {
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
            // 成功后刷新数据
            queryClient.invalidateQueries({ queryKey: ['thirdPartyLibrary'] })
        }
    })
}