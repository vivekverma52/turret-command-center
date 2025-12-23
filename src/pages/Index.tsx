import TurretCard from "@/components/TurretCard";

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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-wider mb-2">
          TURRET COMMAND CENTER
        </h1>
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          Dealing System Monitor
        </p>
      </div>

      {/* Main Content - Left Cards, Right Stats */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Side - Turret Cards (1 row, 4 cards) */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {turrets.map((turret) => (
              <TurretCard key={turret.callId} turret={turret} />
            ))}
          </div>
        </div>

        {/* Right Side - Summary Stats */}
        <div className="lg:w-72 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
            <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-4">
              System Overview
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                <span className="text-sm text-muted-foreground">Total Turrets</span>
                <span className="font-display text-2xl font-bold text-foreground">{totalTurrets}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/30">
                <span className="text-sm text-primary">Running</span>
                <span className="font-display text-2xl font-bold text-primary">{runningTurrets}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                <span className="text-sm text-destructive">Stopped</span>
                <span className="font-display text-2xl font-bold text-destructive">{stoppedTurrets}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-secondary/50">
                <span className="text-sm text-secondary-foreground">Cancelled</span>
                <span className="font-display text-2xl font-bold text-secondary-foreground">{cancelledTurrets}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
