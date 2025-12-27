import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar, { NavItem } from "./AppSidebar";
import AppHeader from "./AppHeader";
import { 
  Crosshair, 
  Settings, 
  BarChart3, 
  Bell, 
  FileAudio,
  Phone,
  PhoneOff,
  Radio
} from "lucide-react";

const navItems: NavItem[] = [
  { title: "Turrets", url: "/dashboard", icon: Crosshair },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Call Audit", url: "/reports/call-audit", icon: FileAudio },
  { title: "IP Phone Audit", url: "/reports/ip-phone-audit", icon: Phone },
  { title: "IP Disconnect", url: "/reports/ip-phone-disconnect", icon: PhoneOff },
  { title: "Turret Disconnect", url: "/reports/turret-disconnect", icon: Radio },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const currentNav = navItems.find((item) => item.url === location.pathname);
  const currentTitle = currentNav?.title || "Dashboard";
  const CurrentIcon = currentNav?.icon;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar items={navItems} />
        <div className="flex-1 flex flex-col">
          <AppHeader title={currentTitle} icon={CurrentIcon} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
