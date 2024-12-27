import { Layout } from '@/layout'
import { isLogin } from '@/utils/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  beforeLoad: () => {
    // 判断是否登录
    if (!isLogin()) {
      return redirect({to:'/auth/login'})
    }
}
})

function RouteComponent() {
  return <Layout>asasdasda</Layout>
}
