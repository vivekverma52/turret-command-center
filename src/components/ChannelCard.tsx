import { Phone, Radio, Hash, User, Waves } from "lucide-react";
import type { Channel } from "@/hooks/useChannels";

interface ChannelCardProps {
  channel: Channel;
}

const getStateVariant = (state: string) => {
  const lowerState = state?.toLowerCase() || "";
  if (lowerState.includes("active") || lowerState.includes("connected")) {
    return { bg: "bg-success/20", text: "text-success", dot: "bg-success" };
  }
  if (lowerState.includes("ringing") || lowerState.includes("alerting")) {
    return { bg: "bg-warning/20", text: "text-warning", dot: "bg-warning animate-pulse" };
  }
  if (lowerState.includes("idle") || lowerState.includes("free")) {
    return { bg: "bg-muted/20", text: "text-muted-foreground", dot: "bg-muted-foreground" };
  }
  if (lowerState.includes("busy") || lowerState.includes("hold")) {
    return { bg: "bg-primary/20", text: "text-primary", dot: "bg-primary" };
  }
  if (lowerState.includes("disconnect") || lowerState.includes("error")) {
    return { bg: "bg-destructive/20", text: "text-destructive", dot: "bg-destructive" };
  }
  return { bg: "bg-secondary/20", text: "text-foreground", dot: "bg-foreground" };
};

const ChannelCard = ({ channel }: ChannelCardProps) => {
  const stateVariant = getStateVariant(channel.state);

  return (
    <div className="card-tactical rounded-lg p-5 relative overflow-hidden group transition-all duration-300 hover:glow-cyan">
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-display text-lg font-bold text-foreground tracking-wider">
              {channel.turretName || "Unknown Turret"}
            </h3>
            <p className="text-muted-foreground text-xs font-body mt-0.5">
              Device: {channel.deviceName || "N/A"}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${stateVariant.bg} ${stateVariant.text}`}>
          <span className={`w-2 h-2 rounded-full ${stateVariant.dot}`} />
          {channel.state || "Unknown"}
        </div>
      </div>

      {/* Channel Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-secondary/30 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
            <Hash className="w-3 h-3" />
            Line No
          </div>
          <p className="font-mono text-sm font-bold text-primary">
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

      {/* Call Info */}
      <div className="bg-background/50 rounded-lg p-3 border border-border/30">
        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
          <Phone className="w-3 h-3" />
          Call ID
        </div>
        <p className="font-mono text-xs text-foreground truncate">
          {channel.callId || "No Active Call"}
        </p>
      </div>
    </div>
  );
};

export default ChannelCard;
