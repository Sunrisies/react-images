import {
  BookOpen,
  Database,
  FileText,
  Home,
  Image,
  LineChart,
  MessageSquare,
  Settings,
  Users,
  Info
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
        icon: Database,  // 修改为数据库图标
      },
      {
        title: "评论管理",
        url: "/dashboard/comments",
        icon: MessageSquare,  // 修改为评论图标
      },
      {
        title: "媒体库",
        url: "/dashboard/media",
        icon: Image,  // 修改为图片图标
      },
      {
        title: "第三方库",
        url: "/dashboard/third",
        icon: Database,  // 修改为数据库图标
      },
      {
        title: "数据分析",
        url: "/dashboard/analytics",
        icon: LineChart,  // 修改为图表图标
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
      {
        title: "关于",
        url: "/dashboard/about",
        icon: Info,  // 修改为 Info 图标
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
