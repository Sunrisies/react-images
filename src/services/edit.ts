import { useAppAxios } from '@/hooks/useAppAxios'
import { addArticleType, UpdateType } from '@/types/edit.types'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
export const usePostEdit = () => {
  const { post } = useAppAxios()
  return useMutation({
    mutationFn: async (params: UpdateType) => {
      console.log(params, '上传文件')

      const {code,data} = await post<addArticleType>('/article', params)
      console.log(data, 'code, data--------------------------')
      if (code === 200) {
        message.success('发布成功')
      } else {
        message.error('发布失败')
      }
      // callback()
      return data
    }
  })
  // return mutate
  // const { code, data } = await post<addArticleType>('/article', params)
  // console.log(data, 'code, data')
  // if (code === 200) {
  //   message.success('发布成功')
  // } else {
  //   message.error('发布失败')
  // }
  // callback()
  // return data
}