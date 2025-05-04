import { useAppAxios } from '@/hooks/useAppAxios'
import { addArticleType, UpdateType } from '@/types/edit.types'
import { useMutation } from '@tanstack/react-query'
import { request } from '@/utils/fetch'
export const usePostEdit = () => {
  // const { post } = useAppAxios()
  return useMutation({
    mutationFn: async (params: UpdateType) => {
      const { code,data } = await request.post<any, addArticleType>('/article', params)
      console.log(code,data,'添加文章')
      return code
    }
  })
}