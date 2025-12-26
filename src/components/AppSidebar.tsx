import { useState } from "react";
import { LucideIcon, ChevronDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  children?: NavItem[];
}

interface AppSidebarProps {
  items: NavItem[];
}

const AppSidebar = ({ items }: AppSidebarProps) => {
  const sidebar = useSidebar();
  const collapsed = sidebar?.state === "collapsed";
  const isMobile = sidebar?.isMobile;
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isChildActive = (children?: NavItem[]) => 
    children?.some((child) => currentPath === child.url) || false;
  
  // On mobile, always show text (sidebar opens as sheet)
  const showText = isMobile || !collapsed;

  // Track open state for collapsible groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // Auto-open groups that contain the active route
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.children && isChildActive(item.children)) {
        initial[item.title] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
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
              {items.map((item) => {
                // If item has children, render as collapsible
                if (item.children && item.children.length > 0) {
                  const isGroupOpen = openGroups[item.title] || isChildActive(item.children);
                  
                  return (
                    <Collapsible
                      key={item.title}
                      open={showText ? isGroupOpen : false}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`mx-2 rounded-lg transition-all duration-200 w-[calc(100%-16px)] ${
                              isChildActive(item.children)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full px-3 py-2.5">
                              <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 shrink-0" />
                                {showText && (
                                  <span className="font-display text-sm tracking-wider">
                                    {item.title}
                                  </span>
                                )}
                              </div>
                              {showText && (
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    isGroupOpen ? "rotate-180" : ""
                                  }`}
                                />
                              )}
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <SidebarMenuButton
                              key={child.title}
                              asChild
                              isActive={isActive(child.url)}
                              className={`mx-2 rounded-lg transition-all duration-200 ${
                                isActive(child.url)
                                  ? "bg-primary/20 text-primary glow-cyan"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                              }`}
                            >
                              <NavLink
                                to={child.url}
                                end
                                className="flex items-center gap-3 px-3 py-2"
                                activeClassName="text-primary"
                              >
                                <child.icon className="w-4 h-4 shrink-0" />
                                <span className="font-display text-xs tracking-wider">
                                  {child.title}
                                </span>
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Regular menu item without children
                return (
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
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
