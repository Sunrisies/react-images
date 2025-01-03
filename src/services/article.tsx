import { useAppAxios } from '@/hooks/useAppAxios'
import { ArticleType } from '@/types/article.types'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AxiosError } from 'axios'

export const useGetArticle = ({page, limit}: {page: number, limit: number}) => {
  const { get } = useAppAxios()
  return useQuery<{ data: ArticleType[], total?: number }, AxiosError>({
    queryKey: ['article', page, limit],
    queryFn: async () => await get<ArticleType[]>(`/article/admin?page=${page}&limit=${limit}`),
    placeholderData:keepPreviousData
  })
}

export const useDeleteArticle = () => {
  const { del } = useAppAxios()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { code } = await del(`/article/${id}`)
      if (code === 200) {
        message.success('删除成功')
      } else {
        message.error('删除失败')
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['article'] })
    }
  })
}
export const useUpdateArticle = () => {
  const { put } = useAppAxios()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...params }: Partial<ArticleType>) => {
      const { code } = await put(`/article/${id}`, params)
      if (code === 200) {
        message.success('更新成功')
      } else {
        message.error('更新失败')
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['article'] })
    }
  })
}
