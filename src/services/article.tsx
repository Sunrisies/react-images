import { useAppAxios } from "@/hooks/useAppAxios"
import { ArticleType } from "@/types/article.types"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetArticle = () => {
  const { get } = useAppAxios()
  return  useQuery<ArticleType[],AxiosError>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const {data} = await get<ArticleType[]>(`/article/admin`)
      console.log(data,'================')
      return data
    },
  })
}