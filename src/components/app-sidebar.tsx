import { AppSidebar } from '@/components/dashboard-sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { logoutApi } from '@/services/login'
import { useNavigate } from '@tanstack/react-router'
import { ModeToggle } from './mode-toggle'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useState } from 'react'
import { Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'
import { Button } from './ui/button'

export default function NavMain({ children }: any) {
  const navigate = useNavigate()
  const list = [
    {
      name: '退出登录',
      key: 'logout'
    },
    {
      name: '账号绑定',
      key: 'bind-email'
    },
    {
      name: '个人信息',
      key: 'personal-info'
    }
  ]
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 点击头像
  const handleAvatarClick = () => {
    console.log('avatar clicked')
  }
  const handleBreadcrumbClick = (name: string) => {
    console.log('breadcrumb clicked', name)
    if (name === 'logout') {
      logoutApi()
      // 跳转到登录页面
      navigate({ to: '/auth/login' })
      // window.location.reload()
    } else if (name === 'bind-email') {
      console.log('bind email')
      setIsModalOpen(true)
    } else if (name === 'personal-info') {
      navigate({ to: '/admin/personalInfo' })
    }
  }
  const [bindings, setBindings] = useState({
    qq: false,
    wechat: false,
    email: false,
    phone: false
  })

  const handleBinding = (type: keyof typeof bindings) => {
    setBindings(prev => ({ ...prev, [type]: !prev[type] }))
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
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer" onClick={() => handleAvatarClick()}>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>我的设置</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {list.map((item) => (
                    <DropdownMenuItem key={item.key} onClick={() => handleBreadcrumbClick(item.key)}>
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>账号绑定</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* QQ Account */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">绑定QQ</h3>
                <p className="text-sm text-muted-foreground">
                  {bindings.qq ? '已绑定QQ账号' : '当前未绑定QQ账号'}
                </p>
              </div>
            </div>
            <Button 
              variant="link" 
              className="text-blue-500"
              onClick={() => handleBinding('qq')}
            >
              {bindings.qq ? '更换绑定' : '绑定'}
            </Button>
          </div>

          {/* WeChat Account */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-green-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">绑定微信</h3>
                <p className="text-sm text-muted-foreground">
                  {bindings.wechat ? '已绑定微信账号' : '当前未绑定微信账号'}
                </p>
              </div>
            </div>
            <Button 
              variant="link" 
              className="text-blue-500"
              onClick={() => handleBinding('wechat')}
            >
              {bindings.wechat ? '更换绑定' : '绑定'}
            </Button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-50 rounded-lg">
                <Mail className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium">绑定邮箱</h3>
                <p className="text-sm text-muted-foreground">
                  {bindings.email ? '已绑定邮箱账号' : '当前未绑定邮箱账号'}
                </p>
              </div>
            </div>
            <Button 
              variant="link" 
              className="text-blue-500"
              onClick={() => handleBinding('email')}
            >
              {bindings.email ? '更换绑定' : '绑定'}
            </Button>
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-orange-50 rounded-lg">
                <Phone className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium">绑定手机</h3>
                <p className="text-sm text-muted-foreground">
                  {bindings.phone ? '已绑定手机号码' : '当前未绑定手机号码'}
                </p>
              </div>
            </div>
            <Button 
              variant="link" 
              className="text-blue-500"
              onClick={() => handleBinding('phone')}
            >
              {bindings.phone ? '更换绑定' : '绑定'}
            </Button>
          </div>
        </div>
      </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
