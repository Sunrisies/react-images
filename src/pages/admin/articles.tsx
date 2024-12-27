import Loading from '@/components/loading'
import { Table } from '@/components/table'
import { Layout } from '@/layout'
import { useGetArticle } from '@/services/article'
import { isLogin } from '@/utils/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/articles')({
  component: RouteComponent,
  beforeLoad: () => {
    // 判断是否登录
    if (!isLogin()) {
      return redirect({to:'/auth/login'})
    }
  }
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
