import NavMain from '@/components/app-sidebar'
import { Outlet, createRootRoute,createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
type RouterContext = {
  // authentication: AuthContext;
};
export const Route = createRootRouteWithContext<RouterContext>()({
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
