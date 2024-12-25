import { createFileRoute ,Outlet} from '@tanstack/react-router'
import {Layout} from '@/layout'
export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout>
  <div>
    Hello "/"!
    <Outlet />
  </div>
</Layout>
}
