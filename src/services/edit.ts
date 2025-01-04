import { useAppAxios } from '@/hooks/useAppAxios'
import { addArticleType, UpdateType } from '@/types/edit.types'
import { useMutation } from '@tanstack/react-query'
export const usePostEdit = () => {
  const { post } = useAppAxios()
  return useMutation({
    mutationFn: async (params: UpdateType) => {
      const {code} = await post<addArticleType>('/article', params)
      return code
    }
  })
}