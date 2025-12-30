import { LucideIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

interface AppHeaderProps {
  title: string;
  icon?: LucideIcon;
}

const AppHeader = ({ title, icon: Icon }: AppHeaderProps) => {
  return (
    <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-sm flex items-center px-4 sticky top-0 z-50">
      {/* Mobile sidebar trigger */}
      <div className="md:hidden">
        <SidebarTrigger className="text-primary hover:bg-primary/10" />
      </div>

      {/* Centered title */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
          <h1 className="font-display text-lg font-bold tracking-wider text-foreground uppercase">NO-REC NO-CALL</h1>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
