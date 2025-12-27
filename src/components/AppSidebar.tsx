import { LucideIcon, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  items: NavItem[];
}

const AppSidebar = ({ items }: AppSidebarProps) => {
  const sidebar = useSidebar();
  const collapsed = sidebar?.state === "collapsed";
  const isMobile = sidebar?.isMobile;
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  // On mobile, always show text (sidebar opens as sheet)
  const showText = isMobile || !collapsed;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Sidebar
      className="bg-card border-r border-border/50"
      collapsible="icon"
    >
      {/* Desktop sidebar trigger - hidden on mobile */}
      <div className="hidden md:block p-3 border-b border-border/50">
        <SidebarTrigger className="text-primary hover:bg-primary/10" />
      </div>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={`mx-2 rounded-lg transition-all duration-200 ${
                      isActive(item.url)
                        ? "bg-primary/20 text-primary glow-cyan"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5"
                      activeClassName="text-primary"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {showText && (
                        <span className="font-display text-sm tracking-wider">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="mx-2 rounded-lg transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <LogOut className="w-5 h-5 shrink-0" />
                {showText && (
                  <span className="font-display text-sm tracking-wider">
                    Logout
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
