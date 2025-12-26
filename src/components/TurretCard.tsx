import { Shield, Target, Zap, Thermometer, Crosshair, Radio, Waves } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  status: "online" | "offline";
  isActive: boolean;
  ringState: "ringing" | "idle";
  azimuth: number;
  elevation: number;
  ammunition: number;
  maxAmmunition: number;
  power: number;
  temperature: number;
  targetLocked: boolean;
  shieldActive: boolean;
}

interface Turret {
  id: string;
  name: string;
  ip: string;
  lastActivity: string;
  channels: [Channel, Channel];
}

interface TurretCardProps {
  turret: Turret;
}

const ChannelPanel = ({ channel, index }: { channel: Channel; index: number }) => {
  const ammoPercentage = (channel.ammunition / channel.maxAmmunition) * 100;
  const isOnline = channel.status === "online";

  return (
    <div className="bg-secondary/30 rounded-lg p-3 sm:p-4 border border-border/30 min-w-0">
      {/* Channel Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <Waves className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="font-display text-sm font-bold tracking-wider text-foreground block truncate">
              {channel.name}
            </span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${
              channel.isActive ? "text-success" : "text-muted-foreground"
            }`}>
              {channel.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
          channel.ringState === "ringing" 
            ? "bg-warning/20 text-warning" 
            : "bg-secondary/50 text-muted-foreground"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${channel.ringState === "ringing" ? "bg-warning animate-pulse" : "bg-muted-foreground"}`} />
          <span className="hidden xs:inline">{channel.ringState === "ringing" ? "Ringing" : "Idle"}</span>
          <span className="xs:hidden">{channel.ringState === "ringing" ? "Ring" : "Idle"}</span>
        </div>
      </div>

      {/* Position Data */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-background/50 rounded p-2">
          <div className="flex items-center gap-1 text-muted-foreground text-[10px] uppercase tracking-wider mb-0.5">
            <Crosshair className="w-2.5 h-2.5" />
            Azimuth
          </div>
          <p className="font-display text-lg font-bold text-primary">
            {channel.azimuth}°
          </p>
        </div>
        <div className="bg-background/50 rounded p-2">
          <div className="flex items-center gap-1 text-muted-foreground text-[10px] uppercase tracking-wider mb-0.5">
            <Crosshair className="w-2.5 h-2.5 rotate-90" />
            Elevation
          </div>
          <p className="font-display text-lg font-bold text-primary">
            {channel.elevation}°
          </p>
        </div>
      </div>

      {/* Stats Bars */}
      <div className="space-y-2 mb-3">
        {/* Ammunition */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Ammo</span>
            <span className="font-mono text-[10px] text-foreground">
              {channel.ammunition}/{channel.maxAmmunition}
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                ammoPercentage > 50 ? "bg-success" : ammoPercentage > 20 ? "bg-warning" : "bg-destructive"
              }`}
              style={{ width: `${ammoPercentage}%` }}
            />
          </div>
        </div>

        {/* Power */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-warning" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Power</span>
            </div>
            <span className="font-mono text-[10px] text-foreground">{channel.power}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-warning to-primary rounded-full transition-all duration-500"
              style={{ width: `${channel.power}%` }}
            />
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <Thermometer className="w-2.5 h-2.5 text-destructive" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Temp</span>
            </div>
            <span className="font-mono text-[10px] text-foreground">{channel.temperature}°C</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                channel.temperature < 50 ? "bg-success" : channel.temperature < 80 ? "bg-warning" : "bg-destructive"
              }`}
              style={{ width: `${Math.min(channel.temperature, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex gap-2">
        <div className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded border transition-all duration-300 ${
          channel.targetLocked 
            ? "border-destructive/50 bg-destructive/10 text-destructive" 
            : "border-border/50 bg-secondary/30 text-muted-foreground"
        }`}>
          <Target className={`w-3 h-3 ${channel.targetLocked ? "animate-pulse" : ""}`} />
          <span className="text-[10px] uppercase tracking-wider font-semibold">
            {channel.targetLocked ? "Locked" : "No Target"}
          </span>
        </div>
        <div className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded border transition-all duration-300 ${
          channel.shieldActive 
            ? "border-primary/50 bg-primary/10 text-primary" 
            : "border-border/50 bg-secondary/30 text-muted-foreground"
        }`}>
          <Shield className={`w-3 h-3 ${channel.shieldActive ? "animate-pulse" : ""}`} />
          <span className="text-[10px] uppercase tracking-wider font-semibold">
            {channel.shieldActive ? "Shield" : "No Shield"}
          </span>
        </div>
      </div>
    </div>
  );
};

const TurretCard = ({ turret }: TurretCardProps) => {
  const onlineChannels = turret.channels.filter(c => c.status === "online").length;

  return (
    <div className="card-tactical rounded-lg p-5 relative overflow-hidden group transition-all duration-300 hover:glow-cyan">
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground tracking-wider">
            {turret.name}
          </h3>
          <p className="text-muted-foreground text-xs font-body mt-0.5">
            ID: {turret.id}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Channels</div>
          <div className={`px-2 py-0.5 rounded text-xs font-mono ${
            onlineChannels === 2 ? "bg-success/20 text-success" : 
            onlineChannels === 1 ? "bg-warning/20 text-warning" : 
            "bg-destructive/20 text-destructive"
          }`}>
            {onlineChannels}/2 Online
          </div>
        </div>
      </div>

      {/* Network Info */}
      <div className="flex items-center gap-2 mb-4 text-muted-foreground">
        <Radio className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono text-xs">{turret.ip}</span>
      </div>

      {/* Channels Grid - Responsive: stack on small, side-by-side on larger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {turret.channels.map((channel, index) => (
          <ChannelPanel key={channel.id} channel={channel} index={index} />
        ))}
      </div>

      {/* Last Activity */}
      <div className="pt-3 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground">
          Last Activity: <span className="text-foreground font-mono">{new Date(turret.lastActivity).toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

export default TurretCard;
