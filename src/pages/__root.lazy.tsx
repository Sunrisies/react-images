import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import NavMain from '@/components/app-sidebar'
import { isLogin } from '@/utils/auth'
import { useEffect } from 'react'
export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async () => {
    console.log(isLogin(), 'isLogin111---')
    if (!isLogin()) {
      console.log(isLogin(), 'isLogin')
    }
  }
})

function RootComponent() {
  if (!isLogin()) {
    console.log(isLogin(), 'isLogin-1-2-12--12')
    return (
      <>
        <Outlet />
      </>
    )
  }
  console.log('登录成功')
  return (
    <>
      <NavMain>
        <Outlet />
      </NavMain>

      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
