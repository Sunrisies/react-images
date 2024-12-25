import Loading from '@/components/loading'
import { Table } from '@/components/table'
import { ArticleType } from '@/types/article.types'
import { request } from '@/utils/fetch'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articles')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await request.get<ArticleType[]>(`/article/admin`)
      return response.data
    }
  })
  if (isPending) return Loading()
  if (error) return <div>Error: {error.message}</div>
  return (
    <>
      <Table list={data}></Table>
    </>
  )
}
