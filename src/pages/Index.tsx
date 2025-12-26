import TurretCard from "@/components/TurretCard";
import { Shield } from "lucide-react";

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
  const totalChannels = turrets.length * 2;
  const onlineChannels = turrets.reduce(
    (acc, t) => acc + t.channels.filter((c) => c.status === "online").length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-cyan">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider text-foreground">
                DEFENSE COMMAND
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Turret Control System v2.4
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-foreground tracking-wider mb-2">
            ACTIVE TURRETS
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            <span className="text-sm text-muted-foreground font-mono">
              {onlineChannels}/{totalChannels} CHANNELS ONLINE
            </span>
          </div>
        </div>

        {/* Turret Grid - 3 turrets in a single row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {turrets.map((turret) => (
            <TurretCard key={turret.id} turret={turret} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-auto">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-xs text-muted-foreground font-mono">
            SYSTEM STATUS: OPERATIONAL • ENCRYPTED CONNECTION •{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
