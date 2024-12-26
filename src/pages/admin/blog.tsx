import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/blog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/blog"!</div>
}
