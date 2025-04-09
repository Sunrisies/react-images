import {
  BookOpen,
  Bot,
  FileText,
  Home,
  Settings,
  Settings2,
  Users,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: {
    title: "主要功能",
    item: [
      {
        title: "仪表盘",
        url: "/dashboard",
        icon: Home,
        isActive: true,
      },
      {
        title: "文章管理",
        url: "/dashboard/posts",
        icon: FileText,
      },
      {
        title: "添加文件",
        url: "/dashboard/editor",
        icon: BookOpen,
      },
      {
        title: "历史数据",
        url: "/dashboard/articles",
        icon: Settings2,
      },
      {
        title: "评论管理",
        url: "/dashboard/comments",
        icon: Bot,
      },
      {
        title: "媒体库",
        url: "/dashboard/media",
        icon: Bot,
      },
      {
        title: "第三方库",
        url: "/dashboard/third",
        icon: Bot,
      },
      {
        title: "数据分析",
        url: "/dashboard/analytics",
        icon: Bot,
      },
    ],
  },
  system: {
    title: "系统设置",
    item: [
      {
        title: "用户管理",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "系统设置",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain items={data.system} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
