import { AppSidebar } from '@/components/dashboard-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from './mode-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { logoutApi } from '@/api'
import { useNavigate } from '@tanstack/react-router'

export default function NavMain({ children }: any) {
  const navigate = useNavigate()
  const list = [
    {
      name: '退出登录',
      key: 'logout'
    },
    {
      name: 'Billing',
      key: 'billing'
    },
    {
      name: 'Team',
      key: 'team'
    },
    {
      name: 'Subscription',
      key:'subscription'
    }
  ]
  // 点击头像
  const handleAvatarClick = () => {
    console.log('avatar clicked')
  }
  const handleBreadcrumbClick = (name: string) => {
    console.log('breadcrumb clicked', name)
    if (name === 'logout') {
      logoutApi()
      // 跳转到登录页面
      navigate({to:'/login'})
      window.location.reload()
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <DropdownMenu >
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer" onClick={() => handleAvatarClick()}>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent >
                  <DropdownMenuLabel>我的设置</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {list.map((item) => (
                    <DropdownMenuItem key={item.key} onClick={() => handleBreadcrumbClick(item.key)}>{item.name}</DropdownMenuItem>
                  ))}
                  {/* <DropdownMenuItem onClick={() => console.log('clicked')}>退出登录</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>

              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
