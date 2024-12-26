import '@/assets/styles/global.scss'
import 'dayjs/locale/zh-cn'
import ReactDOM from 'react-dom/client'

import { useAppAntdConfig } from '@/hooks/useAppAntdConfig'
import { useAppQuery } from '@/hooks/useAppQuery'
import { useAppRouter } from '@/hooks/useAppRouter'
const App = () => {
  const { AppQueryProvider } = useAppQuery()
  const rootElement = document.getElementById('app')!
  const { AppRouterProvider } = useAppRouter()
  const { AppConfigProvider } = useAppAntdConfig()
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <AppQueryProvider>
        <AppConfigProvider>
          <AppRouterProvider />
        </AppConfigProvider>
      </AppQueryProvider>
    )
  }
}
App()
