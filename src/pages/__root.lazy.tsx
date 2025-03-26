import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from "sonner"
export const Route = createRootRoute({
  component: RootComponent
})
function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster position="top-center" />
      {process.env.NODE_ENV === 'development' ? <TanStackRouterDevtools position="bottom-right" /> : ''}
    </>
  )
}
