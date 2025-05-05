import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string; // 标题，用于显示在侧边栏中，例如 "仪表盘" 或 "文章管理" 等
    item: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  };
}) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  // 从 localStorage 读取状态
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      setOpen(JSON.parse(savedState));
    }
  }, []);

  // 当状态改变时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(open));
  }, [open]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{items.title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.item.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              tooltip={item.title}
              asChild
              isActive={isActive(item.url)}
            >
              <Link href={item.url} to={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
