import { ModeToggle } from "@/components/mode-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
// const CustomTrigger = () => {
//   const { toggleSidebar } = useSidebar();
//   // --sidebar-width-icon修改这个值可以修改侧边栏的宽度
//   // --sidebar-width-icon: 4rem;
//   return (
//     <button
//       onClick={() => toggleSidebar()}
//       //   style={{ "--sidebar-width": collapsed ? "5rem" : "16rem" }}
//     >
//       Toggle Sidebar
//     </button>
//   );
// };
export const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  // 添加退出登录处理函数
  const handleLogout = async () => {
    try {
      // 这里可以调用你的退出登录 API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        // 清除本地存储的用户信息
        localStorage.removeItem('token');
        // 重定向到登录页
        window.location.href = '/auth/login';
      } else {
        throw new Error('退出登录失败');
      }
    } catch (error) {
      console.error('退出登录出错:', error);
      // 这里可以添加错误提示，比如使用 toast 组件
    }
  };
  useEffect(() => {
    console.log(open, "open");
  }, [open]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className={`fixed  ${open ? "left-64" : "left-12"} right-0 h-16 shrink-0 items-center gap-2 transition-all duration-300 ease-linear justify-between px-6 border-b-2 border-muted/20 dark:border-neutral-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-neutral-900/30 flex`}
        >
          <div className="flex items-center gap-2 px-4 flex-1">
            {/* <CustomTrigger /> */}
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleLogout}
                  className="rounded-full p-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors hover:text-red-600 dark:hover:text-red-400 text-muted-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">登出</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>退出登录</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 mt-14">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
