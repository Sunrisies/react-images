import NavMain from '@/components/app-sidebar'
import Loading from '@/components/loading'
import { Table } from '@/components/table'
import { ArticleType } from '@/types/article.types'
import { isLogin } from '@/utils/auth'
import { request } from '@/utils/fetch'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
export const Route = createFileRoute('/index1')({
  component: RouteComponent,
  beforeLoad: async () => {
    console.log(isLogin(), 'isLogin---')

    if (!isLogin()) {
      //   router.push('/login')
      console.log(isLogin(), 'isLogin')
      throw redirect({ to: '/login' })
      //   // throw redirect({
      //   //   to: '/login',
      //   //   // search: {
      //   //   //   // redirect: location.href,
      //   //   // },
      //   // })
    }
  },
})

function RouteComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await request.get<ArticleType[]>(`/article/admin`)
      console.log(response, 'response')
      return response.data
    },
  })
  if (isPending) return Loading()
  if (error) return <div>Error: {error.message}</div>
  console.log(data, 'data')
  return (
    // <NavMain>
    <Table list={data}></Table>
    // </NavMain>
  )
}
