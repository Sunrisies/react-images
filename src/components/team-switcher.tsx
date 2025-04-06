import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link className="flex items-center gap-2 px-2" to="/dashboard">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                  <span className="text-xl font-bold text-primary-foreground">
                    博
                  </span>
                </div>
                <span className="text-lg font-semibold">博客管理系统</span>
              </Link>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
