import NavMain from '@/components/app-sidebar'
import React, {FC} from 'react'
import {ThemeProvider} from "@/components/theme-provider";
import {SidebarProvider} from "@/components/ui/sidebar";
import {DashboardSidebar} from "@/components/dashboard-sidebar";

export const Layout: FC<{ children: React.ReactNode }> = ({children}) => {
    return (<ThemeProvider defaultTheme="light">
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <DashboardSidebar/>
                <main className="flex-1">{children}</main>
            </div>
        </SidebarProvider>
    </ThemeProvider>)
}
