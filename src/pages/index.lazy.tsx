import { Layout } from '@/layout'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <Layout>
  index
</Layout>
}
