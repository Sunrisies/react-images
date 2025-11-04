import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  useSidebar
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LogOut, PanelLeft } from "lucide-react"
import React, { FC, useEffect, useState } from "react"
const CustomTrigger = () => {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      onClick={ () => toggleSidebar() }
    >
      <PanelLeft />
    </button>
  )
}
export const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从 localStorage 读取初始状态，如果没有则默认为 true
  const initialState = localStorage.getItem('sidebarState')
    ? JSON.parse(localStorage.getItem('sidebarState')!)
    : true

  const [open, setOpen] = useState(initialState)

  // 当状态改变时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(open))
  }, [open])

  // 添加退出登录处理函数
  const handleLogout = async () => {
    try {
      // 这里可以调用你的退出登录 API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        // 清除本地存储的用户信息
        localStorage.removeItem('token')
        // 重定向到登录页
        window.location.href = '/auth/login'
      } else {
        throw new Error('退出登录失败')
      }
    } catch (error) {
      console.error('退出登录出错:', error)
      // 这里可以添加错误提示，比如使用 toast 组件
    }
  }

  return (
    <SidebarProvider open={ open } onOpenChange={ setOpen }>
      <AppSidebar />
      <SidebarInset>
        <header
          className={ `fixed  ${open ? "left-48" : "left-16"} right-0 h-16 shrink-0 items-center gap-2 transition-all duration-300 ease-linear justify-between px-6 border-b-2 border-muted/20 dark:border-neutral-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-neutral-900/30 flex z-[999]` }
        >
          <div className="flex items-center gap-2 px-4 flex-1">
            <CustomTrigger></CustomTrigger>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={ handleLogout }
                  className="rounded-full p-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors hover:text-red-600 dark:hover:text-red-400 text-muted-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">退出</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>退出登录</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 mt-14">{ children }</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
