import { Radio, Hash, User, Globe } from "lucide-react";
import type { Channel } from "@/hooks/useChannels";

interface ChannelCardProps {
  channel: Channel;
}

const ChannelCard = ({ channel }: ChannelCardProps) => {
  const isActive = channel.isActive;
  const stateVariant = isActive 
    ? { bg: "bg-success/20", text: "text-success", dot: "bg-success", label: "Active" }
    : { bg: "bg-destructive/20", text: "text-destructive", dot: "bg-destructive", label: "Inactive" };

  return (
    <div className="card-tactical rounded-lg p-5 relative overflow-hidden group transition-all duration-300 hover:glow-cyan">
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground tracking-wider">
            {channel.turretName || "Unknown Turret"}
          </h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${stateVariant.bg} ${stateVariant.text}`}>
          <span className={`w-2 h-2 rounded-full ${stateVariant.dot}`} />
          {stateVariant.label}
        </div>
      </div>

      {/* IP Address */}
      <div className="bg-background/50 rounded-lg p-3 border border-border/30 mb-4">
        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
          <Globe className="w-3 h-3" />
          IP Address
        </div>
        <p className="font-mono text-sm font-bold text-primary">
          {channel.ip || "N/A"}
        </p>
      </div>

      {/* Channel Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/30 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
            <Hash className="w-3 h-3" />
            Line No
          </div>
          <p className="font-mono text-sm font-bold text-foreground">
            {channel.lineNo || "N/A"}
          </p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
            <User className="w-3 h-3" />
            Party No
          </div>
          <p className="font-mono text-sm font-bold text-foreground">
            {channel.partyNo || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
