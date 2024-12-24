import { createFileRoute, redirect } from '@tanstack/react-router'
import NavMain from '@/components/app-sidebar'
import { Table } from '@/components/table'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/utils/fetch'
import { ArticleType } from '@/types/article.types'
import Loading from '@/components/loading'
export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    // if (!isAuthenticated()) {
    throw redirect({
      to: '/login',
      search: {
        // Use the current location to power a redirect after login
        // (Do not use `router.state.resolvedLocation` as it can
        // potentially lag behind the actual current location)
        redirect: location.href,
      },
    })
    // }
  },
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
    <NavMain>
      <Table list={data}></Table>
    </NavMain>
  )
}
