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
                <button className="rounded-full p-2 hover:bg-muted/50 transition-colors hover:text-foreground text-muted-foreground">
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
