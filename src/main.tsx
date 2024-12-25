import '@/assets/styles/global.scss'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ConfigProvider } from 'antd'
import {routeTree} from './routeTree.gen'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import ReactDOM from 'react-dom/client'
import { routes } from '../routes'

const router = createRouter({
  routeTree,
  // routes,
  defaultPreload: 'intent'
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const queryClient = new QueryClient()
const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </ConfigProvider>{' '}
    </QueryClientProvider>
  )
}
