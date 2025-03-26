import { useAppAxios } from '@/hooks/useAppAxios'
import { ArticleType } from '@/types/article.types'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AxiosError } from 'axios'
import type { Comment } from "@/lib/utils"
export const useTextComments = ({ page, limit }: { page: number, limit: number }) => {
    const { get } = useAppAxios()
    return useQuery<{ data: Comment[], total?: number }, AxiosError>({
        queryKey: ['textComments', page, limit],
        queryFn: async () => await get<Comment[]>(`/comments/admin?page=${page}&limit=${limit}`),
        placeholderData: keepPreviousData
    })
}