import { routeTree } from "@/routeTree.gen"
import { createRouter, RouterProvider } from "@tanstack/react-router"
const router = createRouter({
  routeTree,
  defaultPreload: 'intent'
})
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
export const useAppRouter = () => {
  const AppRouterProvider = () => {
    return <RouterProvider router={router} />
  }

  return {
    AppRouterProvider
  }
}
