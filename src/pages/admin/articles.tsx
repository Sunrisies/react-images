import Loading from '@/components/loading'
import { Table } from '@/components/table'
import { Layout } from '@/layout'
import { useGetArticle } from '@/services/article'
import { isLogin } from '@/utils/auth'
import { createFileRoute, redirect, useNavigate, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/articles')({
  component: RouteComponent,
  beforeLoad: () => {
    // 判断是否登录
    if (!isLogin()) {
      return redirect({ to: '/auth/login' })
    }
  },
  validateSearch: (search) => ({
    page: Number(search.page) || 1
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const  page  = useSearch({ from:'/admin/articles',select: (search) => search.page })
  const { data, isPending, error } = useGetArticle({ page: page, limit: 10 })
  if (isPending) return Loading()
  if (error) return <div>Error: {error.message}</div>
  return (
    <Layout>
      <Table
        list={data.data}
        total={data.total!}
        onChangePage={(page) => {
          navigate({
            search: { page: page } // 更新路由参数
          })
        }}
      ></Table>
    </Layout>
  )
}
