import { ConfigProvider } from 'antd'
import { ThemeProvider } from '@/components/theme-provider'
import zhCN from 'antd/locale/zh_CN'
import { FC, ReactNode } from 'react'

export const useAppAntdConfig = () => {
  const AppConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <ConfigProvider locale={zhCN}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      </ConfigProvider>
    )
  }
  return {AppConfigProvider}
}
