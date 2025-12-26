import TurretCard from "@/components/TurretCard";
import { Radio, Zap, Shield, Target } from "lucide-react";

const turrets = [
  {
    id: "T001",
    name: "Turret Alpha",
    ip: "192.168.1.101",
    lastActivity: new Date().toISOString(),
    channels: [
      {
        id: "T001-CH1",
        name: "Channel 1",
        status: "online" as const,
        azimuth: 45,
        elevation: 15,
        ammunition: 750,
        maxAmmunition: 1000,
        power: 85,
        temperature: 42,
        targetLocked: true,
        shieldActive: true,
      },
      {
        id: "T001-CH2",
        name: "Channel 2",
        status: "online" as const,
        azimuth: 120,
        elevation: 25,
        ammunition: 600,
        maxAmmunition: 1000,
        power: 78,
        temperature: 38,
        targetLocked: false,
        shieldActive: true,
      },
    ] as [typeof turrets[0]["channels"][0], typeof turrets[0]["channels"][0]],
  },
  {
    id: "T002",
    name: "Turret Beta",
    ip: "192.168.1.102",
    lastActivity: new Date().toISOString(),
    channels: [
      {
        id: "T002-CH1",
        name: "Channel 1",
        status: "offline" as const,
        azimuth: 0,
        elevation: 0,
        ammunition: 0,
        maxAmmunition: 1000,
        power: 0,
        temperature: 25,
        targetLocked: false,
        shieldActive: false,
      },
      {
        id: "T002-CH2",
        name: "Channel 2",
        status: "offline" as const,
        azimuth: 0,
        elevation: 0,
        ammunition: 0,
        maxAmmunition: 1000,
        power: 0,
        temperature: 25,
        targetLocked: false,
        shieldActive: false,
      },
    ] as [typeof turrets[0]["channels"][0], typeof turrets[0]["channels"][0]],
  },
  {
    id: "T003",
    name: "Turret Gamma",
    ip: "192.168.1.103",
    lastActivity: new Date().toISOString(),
    channels: [
      {
        id: "T003-CH1",
        name: "Channel 1",
        status: "online" as const,
        azimuth: 180,
        elevation: 30,
        ammunition: 250,
        maxAmmunition: 1000,
        power: 65,
        temperature: 78,
        targetLocked: false,
        shieldActive: true,
      },
      {
        id: "T003-CH2",
        name: "Channel 2",
        status: "offline" as const,
        azimuth: 90,
        elevation: 10,
        ammunition: 500,
        maxAmmunition: 1000,
        power: 0,
        temperature: 30,
        targetLocked: false,
        shieldActive: false,
      },
    ] as [typeof turrets[0]["channels"][0], typeof turrets[0]["channels"][0]],
  },
];

const Index = () => {
  const totalTurrets = turrets.length;
  const totalChannels = turrets.length * 2;
  const onlineChannels = turrets.reduce(
    (acc, t) => acc + t.channels.filter((c) => c.status === "online").length,
    0
  );
  const offlineChannels = totalChannels - onlineChannels;
  const activeShields = turrets.reduce(
    (acc, t) => acc + t.channels.filter((c) => c.shieldActive).length,
    0
  );
  const targetsLocked = turrets.reduce(
    (acc, t) => acc + t.channels.filter((c) => c.targetLocked).length,
    0
  );

  return (
    <div className="min-h-screen bg-background px-4 md:px-6 py-6 md:py-8">
      {/* Status Summary Panel */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="card-tactical rounded-lg p-4 md:p-6">
          <h2 className="font-display text-lg md:text-xl font-bold text-foreground tracking-wider text-center mb-6">
            SYSTEM STATUS OVERVIEW
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Total Turrets */}
            <div className="bg-secondary/50 rounded-lg p-3 md:p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider mb-2">
                <Radio className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                Total Turrets
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-primary text-glow">
                {totalTurrets}
              </p>
            </div>

            {/* Live Channels */}
            <div className="bg-secondary/50 rounded-lg p-3 md:p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider mb-2">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-success" />
                Live Channels
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-success">
                {onlineChannels}<span className="text-lg text-muted-foreground">/{totalChannels}</span>
              </p>
            </div>

            {/* Active Shields */}
            <div className="bg-secondary/50 rounded-lg p-3 md:p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider mb-2">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                Active Shields
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-primary text-glow">
                {activeShields}
              </p>
            </div>

            {/* Targets Locked */}
            <div className="bg-secondary/50 rounded-lg p-3 md:p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider mb-2">
                <Target className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
                Targets Locked
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-destructive">
                {targetsLocked}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Turret Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {turrets.map((turret) => (
          <TurretCard key={turret.id} turret={turret} />
        ))}
      </div>
    </div>
  );
};

export default Index;
