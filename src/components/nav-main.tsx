import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
interface NavMainProps {
  items: {
    title: string;
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
}
export function NavMain({
  items,
}: NavMainProps) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const {
    open,
    setOpen,
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
              <Link
                href={item.url}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 ${
                  isActive(item.url)
                    ? 'bg-accent/50 text-accent-foreground font-medium border-2 border-primary'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-l-2 hover:border-primary/50'
                }`}
              >
                {item.icon && (
                  <item.icon
                    className={`shrink-0 w-5 h-5 ${
                      isActive(item.url)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary group-hover:text-primary'
                    }`}
                  />
                )}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
