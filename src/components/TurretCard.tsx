import { Shield, Target, Zap, Thermometer, Crosshair, Radio } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Turret {
  id: string;
  name: string;
  ip: string;
  status: "online" | "offline";
  azimuth: number;
  elevation: number;
  ammunition: number;
  maxAmmunition: number;
  power: number;
  temperature: number;
  lastActivity: string;
  targetLocked: boolean;
  shieldActive: boolean;
}

interface TurretCardProps {
  turret: Turret;
}

const TurretCard = ({ turret }: TurretCardProps) => {
  const ammoPercentage = (turret.ammunition / turret.maxAmmunition) * 100;
  const isOnline = turret.status === "online";

  return (
    <div className="card-tactical rounded-lg p-6 relative overflow-hidden group transition-all duration-300 hover:glow-cyan">
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground tracking-wider">
            {turret.name}
          </h3>
          <p className="text-muted-foreground text-sm font-body mt-1">
            ID: {turret.id}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
          isOnline 
            ? "bg-success/20 text-success glow-success" 
            : "bg-destructive/20 text-destructive glow-destructive"
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-success animate-pulse" : "bg-destructive"}`} />
          {turret.status}
        </div>
      </div>

      {/* Network Info */}
      <div className="flex items-center gap-2 mb-6 text-muted-foreground">
        <Radio className="w-4 h-4 text-primary" />
        <span className="font-mono text-sm">{turret.ip}</span>
      </div>

      {/* Position Data */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1">
            <Crosshair className="w-3 h-3" />
            Azimuth
          </div>
          <p className="font-display text-2xl font-bold text-primary text-glow">
            {turret.azimuth}°
          </p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1">
            <Crosshair className="w-3 h-3 rotate-90" />
            Elevation
          </div>
          <p className="font-display text-2xl font-bold text-primary text-glow">
            {turret.elevation}°
          </p>
        </div>
      </div>

      {/* Stats Bars */}
      <div className="space-y-4 mb-6">
        {/* Ammunition */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Ammunition</span>
            <span className="font-mono text-sm text-foreground">
              {turret.ammunition}/{turret.maxAmmunition}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
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
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-warning" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Power</span>
            </div>
            <span className="font-mono text-sm text-foreground">{turret.power}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-warning to-primary rounded-full transition-all duration-500"
              style={{ width: `${turret.power}%` }}
            />
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="w-3 h-3 text-destructive" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Temperature</span>
            </div>
            <span className="font-mono text-sm text-foreground">{turret.temperature}°C</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                turret.temperature < 50 ? "bg-success" : turret.temperature < 80 ? "bg-warning" : "bg-destructive"
              }`}
              style={{ width: `${Math.min(turret.temperature, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex gap-3">
        <div className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all duration-300 ${
          turret.targetLocked 
            ? "border-destructive/50 bg-destructive/10 text-destructive" 
            : "border-border/50 bg-secondary/30 text-muted-foreground"
        }`}>
          <Target className={`w-4 h-4 ${turret.targetLocked ? "animate-pulse" : ""}`} />
          <span className="text-xs uppercase tracking-wider font-semibold">
            {turret.targetLocked ? "Locked" : "No Target"}
          </span>
        </div>
        <div className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all duration-300 ${
          turret.shieldActive 
            ? "border-primary/50 bg-primary/10 text-primary glow-cyan" 
            : "border-border/50 bg-secondary/30 text-muted-foreground"
        }`}>
          <Shield className={`w-4 h-4 ${turret.shieldActive ? "animate-pulse" : ""}`} />
          <span className="text-xs uppercase tracking-wider font-semibold">
            {turret.shieldActive ? "Shield On" : "Shield Off"}
          </span>
        </div>
      </div>

      {/* Last Activity */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          Last Activity: <span className="text-foreground font-mono">{new Date(turret.lastActivity).toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

export default TurretCard;
