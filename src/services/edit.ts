import { addArticleType, UpdateType } from '@/types/edit.types'
import { request } from '@/utils/fetch'
import { useMutation } from '@tanstack/react-query'
export const usePostEdit = () => {
  return useMutation({
    mutationFn: async (params: UpdateType) => {
      const { code, data } = await request.post<any, addArticleType>('/article', params)
      console.log(code, data, '添加文章')
      return code
    }
  })
}