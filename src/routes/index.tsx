import { createFileRoute } from '@tanstack/react-router'
import { Table } from '@/components/table'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/utils/fetch'
import { ArticleType } from '@/types/article.types'
import Loading from '@/components/loading'
export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await request.get<ArticleType[]>(`/article/admin`)
      console.log(response, 'response')
      return response.data
    }
  })
  if (isPending) return Loading()
  if (error) return <div>Error: {error.message}</div>
  console.log(data, 'data')
  return (
    <>
      <Table list={data}></Table>
    </>
  )
}
