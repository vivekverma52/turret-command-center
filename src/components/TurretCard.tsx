import { 
  Phone, 
  PhoneOff, 
  Radio, 
  Server, 
  Hash, 
  User
} from 'lucide-react';

interface TurretData {
  turretName: string;
  partyNo: string;
  lineNo: string;
  deviceName: string;
  callId: string;
  state: 'CONNECTED' | 'DISCONNECTED' | 'RINGING' | 'HOLD';
}

interface TurretCardProps {
  turret: TurretData;
}

const TurretCard = ({ turret }: TurretCardProps) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'CONNECTED': return 'text-green-400';
      case 'DISCONNECTED': return 'text-red-400';
      case 'RINGING': return 'text-yellow-400';
      case 'HOLD': return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'CONNECTED': return <Phone className="w-5 h-5" />;
      case 'DISCONNECTED': return <PhoneOff className="w-5 h-5" />;
      case 'RINGING': return <Phone className="w-5 h-5 animate-pulse" />;
      case 'HOLD': return <Phone className="w-5 h-5" />;
      default: return <PhoneOff className="w-5 h-5" />;
    }
  };

  const isConnected = turret.state === 'CONNECTED';

  return (
    <div className={`
      relative overflow-hidden rounded-lg border 
      ${isConnected ? 'border-primary/50 bg-card/80' : 'border-destructive/30 bg-card/40'}
      backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary
      group
    `}>
      {/* Glow effect */}
      <div className={`
        absolute inset-0 opacity-20 blur-xl transition-opacity
        ${isConnected ? 'bg-primary' : 'bg-destructive'}
        group-hover:opacity-30
      `} />
      
      {/* Content */}
      <div className="relative p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-foreground tracking-wide">
              {turret.turretName}
            </h3>
            <div className={`flex items-center gap-2 ${getStateColor(turret.state)}`}>
              {getStateIcon(turret.state)}
              <span className="text-sm font-medium uppercase tracking-wider">
                {turret.state}
              </span>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className={`
            w-3 h-3 rounded-full animate-pulse
            ${isConnected ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]'}
          `} />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-wider opacity-70">Party No</p>
              <p className="text-sm font-medium text-foreground">{turret.partyNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Radio className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-wider opacity-70">Line No</p>
              <p className="text-sm font-medium text-foreground">{turret.lineNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Server className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-wider opacity-70">Device</p>
              <p className="text-sm font-medium text-foreground truncate max-w-[120px]">{turret.deviceName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-wider opacity-70">Call ID</p>
              <p className="text-sm font-medium text-foreground">{turret.callId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`
        h-1 w-full
        ${isConnected 
          ? 'bg-gradient-to-r from-transparent via-primary to-transparent' 
          : 'bg-gradient-to-r from-transparent via-destructive to-transparent'}
      `} />
    </div>
  );
};

export default TurretCard;
