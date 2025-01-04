import Loading from '@/components/loading'
import { Table } from '@/components/table'
import { Layout } from '@/layout'
import { useGetArticle } from '@/services/article'
import { isLogin } from '@/utils/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/articles')({
  component: RouteComponent,
  beforeLoad: () => {
    if (!isLogin()) {
      return redirect({ to: '/auth/login' })
    }
  },
  validateSearch: (search: { page: string }) => ({
    page: search.page ? Number(search.page) : 1
  })
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { page } = Route.useSearch()
  const { data, isPending, error } = useGetArticle({ page: page, limit: 10 })
  if (isPending) return Loading()
  if (error) return <div>Error: {error.message}</div>
  return (
    <Layout>
      <Table
        list={data.data}
        total={data.total!}
        onChangePage={(currenPage) => navigate({ search: { page: currenPage } })}
      ></Table>
    </Layout>
  )
}
