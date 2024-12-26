import Loading from '@/components/loading'
import { Table } from '@/components/table'
import { Layout } from '@/layout'
import { useGetArticle } from '@/services/article'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/articles')({
  component: RouteComponent
})

function RouteComponent() {
  const { data, isPending, error } = useGetArticle()
  if (isPending) return Loading()
  if (error) return <div>Error: {error.message}</div>
  return (
    <Layout>
      <Table list={data}></Table>
    </Layout>
  )
}
