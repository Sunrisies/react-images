import { Layout } from '@/layout'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout>
        asasdasda
    </Layout>
}
