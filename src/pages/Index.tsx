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
];

const Index = () => {
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

      {/* Turret Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {turrets.map((turret) => (
          <TurretCard key={turret.callId} turret={turret} />
        ))}
      </div>
    </div>
  );
};

export default Index;
