"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  FileText,
  Home,
  Image,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between w-64">
        <Link className="flex items-center gap-2 px-2" to="/dashboard">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <span className="text-xl font-bold text-primary-foreground">
              博
            </span>
          </div>
          <span className="text-lg font-semibold">博客管理系统</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>主要功能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <Link href="/dashboard" to={"/dashboard"}>
                    <Home />
                    <span>仪表盘</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/posts")}
                >
                  <Link href="/dashboard/posts" to={"/dashboard/posts"}>
                    <FileText />
                    <span>文章管理</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/editor")}
                >
                  <Link href="/dashboard/editor" to={"/dashboard/editor"}>
                    <Image />
                    <span>添加文件</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/articles")}
                >
                  <Link href="/dashboard/articles" to={"/dashboard/articles"}>
                    <Image />
                    <span>历史数据</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/comments")}
                >
                  <Link href="/dashboard/comments" to={"/dashboard/comments"}>
                    <MessageSquare />
                    <span>评论管理</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/media")}
                >
                  <Link href="/dashboard/media" to={"/dashboard/media"}>
                    <Image />
                    <span>媒体库</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/analytics")}
                >
                  <Link href="/dashboard/analytics" to={"/dashboard/analytics"}>
                    <BarChart3 />
                    <span>数据分析</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>系统管理</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/users")}
                >
                  <Link href="/dashboard/users" to={"/dashboard/users"}>
                    <Users />
                    <span>用户管理</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/settings")}
                >
                  <Link href="/dashboard/settings" to={"/dashboard/settings"}>
                    <Settings />
                    <span>系统设置</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Admin"
              />
              <AvatarFallback>管理</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">管理员</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
