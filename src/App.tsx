import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import AuditReport from "./pages/reports/AuditReport";
import IPPhoneAuditReport from "./pages/reports/IPPhoneAuditReport";
import IPPhoneDisconnectReport from "./pages/reports/IPPhoneDisconnectReport";
import TurretDisconnectReport from "./pages/reports/TurretDisconnectReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder pages
const Alerts = () => (
  <div className="p-6">
    <h2 className="font-display text-2xl font-bold text-foreground tracking-wider">Alerts Coming Soon</h2>
  </div>
);

const Settings = () => (
  <div className="p-6">
    <h2 className="font-display text-2xl font-bold text-foreground tracking-wider">Settings Coming Soon</h2>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports/call-audit" element={<AuditReport />} />
            <Route path="/reports/ip-phone-audit" element={<IPPhoneAuditReport />} />
            <Route path="/reports/ip-phone-disconnect" element={<IPPhoneDisconnectReport />} />
            <Route path="/reports/turret-disconnect" element={<TurretDisconnectReport />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
