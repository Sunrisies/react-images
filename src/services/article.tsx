import { useAppAxios } from "@/hooks/useAppAxios"
import { ArticleType } from "@/types/article.types"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetArticle = () => {
  const { http } = useAppAxios()
  return  useQuery<ArticleType[],AxiosError>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await http.get(`/article/admin`)
      console.log(response.data,'============')
      return response.data
    },
  })
}