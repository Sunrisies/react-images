import { ThemeProvider } from '@/components/theme-provider'
import { FC, ReactNode } from 'react'

export const useAppAntdConfig = () => {
  const AppConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    )
  }
  return { AppConfigProvider }
}
