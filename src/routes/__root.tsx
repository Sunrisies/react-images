import NavMain from '@/components/app-sidebar'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
export const Route = createRootRoute({
  component: RootComponent
})

function RootComponent() {
  return (
    <>
      <NavMain>
        <Outlet />
      </NavMain>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
