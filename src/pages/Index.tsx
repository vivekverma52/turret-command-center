import TurretCard from "@/components/TurretCard";
import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react";

const turrets = [
  {
    turretName: "DEALING_TURRET_MUMBAI",
    partyNo: "PARTY_1001",
    lineNo: "LINE_03",
    deviceName: "IPC_TURRET_9000",
    callId: "CID_1728391029",
    state: "CONNECTED" as const,
  },
  {
    turretName: "DEALING_TURRET_DELHI",
    partyNo: "PARTY_1002",
    lineNo: "LINE_07",
    deviceName: "IPC_TURRET_8500",
    callId: "CID_1728391045",
    state: "RINGING" as const,
  },
  {
    turretName: "DEALING_TURRET_BANGALORE",
    partyNo: "PARTY_1003",
    lineNo: "LINE_12",
    deviceName: "IPC_TURRET_7200",
    callId: "CID_1728391087",
    state: "DISCONNECTED" as const,
  },
  {
    turretName: "DEALING_TURRET_CHENNAI",
    partyNo: "PARTY_1004",
    lineNo: "LINE_15",
    deviceName: "IPC_TURRET_6800",
    callId: "CID_1728391099",
    state: "HOLD" as const,
  },
];

const Index = () => {
  const totalTurrets = turrets.length;
  const runningTurrets = turrets.filter((t) => t.state === "CONNECTED").length;
  const stoppedTurrets = turrets.filter((t) => t.state === "DISCONNECTED").length;
  const cancelledTurrets = turrets.filter((t) => t.state === "HOLD" || t.state === "RINGING").length;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Turret Command Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time dealing system monitor
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Turret Cards */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {turrets.map((turret) => (
                <TurretCard key={turret.callId} turret={turret} />
              ))}
            </div>
          </div>

          {/* Right - Stats Panel */}
          <div className="lg:w-64 space-y-3">
            <h3 className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-4">
              Overview
            </h3>
            
            <StatCard 
              icon={Activity} 
              label="Total" 
              value={totalTurrets} 
              variant="default"
            />
            <StatCard 
              icon={CheckCircle2} 
              label="Running" 
              value={runningTurrets} 
              variant="success"
            />
            <StatCard 
              icon={XCircle} 
              label="Stopped" 
              value={stoppedTurrets} 
              variant="destructive"
            />
            <StatCard 
              icon={Clock} 
              label="On Hold" 
              value={cancelledTurrets} 
              variant="warning"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  variant 
}: { 
  icon: any; 
  label: string; 
  value: number;
  variant: 'default' | 'success' | 'destructive' | 'warning';
}) => {
  const variantStyles = {
    default: 'border-border/50 bg-card/50',
    success: 'border-success/20 bg-success/5',
    destructive: 'border-destructive/20 bg-destructive/5',
    warning: 'border-warning/20 bg-warning/5',
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-success',
    destructive: 'text-destructive',
    warning: 'text-warning',
  };

  const valueStyles = {
    default: 'text-foreground',
    success: 'text-success',
    destructive: 'text-destructive',
    warning: 'text-warning',
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border backdrop-blur-sm transition-all hover:scale-[1.02] ${variantStyles[variant]}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${iconStyles[variant]}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={`font-display text-xl font-bold ${valueStyles[variant]}`}>{value}</span>
    </div>
  );
};

export default Index;