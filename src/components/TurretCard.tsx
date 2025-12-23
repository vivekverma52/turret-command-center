import { 
  Phone, 
  PhoneOff, 
  Radio, 
  Server, 
  Hash, 
  User,
  PhoneIncoming,
  Pause
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
  const getStateConfig = (state: string) => {
    switch (state) {
      case 'CONNECTED': 
        return { 
          color: 'text-success', 
          bg: 'bg-success/10', 
          border: 'border-success/30',
          glow: 'shadow-[0_0_20px_hsl(142_76%_46%/0.2)]'
        };
      case 'DISCONNECTED': 
        return { 
          color: 'text-destructive', 
          bg: 'bg-destructive/10', 
          border: 'border-destructive/30',
          glow: 'shadow-[0_0_20px_hsl(0_72%_51%/0.2)]'
        };
      case 'RINGING': 
        return { 
          color: 'text-warning', 
          bg: 'bg-warning/10', 
          border: 'border-warning/30',
          glow: 'shadow-[0_0_20px_hsl(38_92%_50%/0.2)]'
        };
      case 'HOLD': 
        return { 
          color: 'text-info', 
          bg: 'bg-info/10', 
          border: 'border-info/30',
          glow: 'shadow-[0_0_20px_hsl(199_89%_48%/0.2)]'
        };
      default: 
        return { 
          color: 'text-muted-foreground', 
          bg: 'bg-muted', 
          border: 'border-border',
          glow: ''
        };
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'CONNECTED': return <Phone className="w-4 h-4" />;
      case 'DISCONNECTED': return <PhoneOff className="w-4 h-4" />;
      case 'RINGING': return <PhoneIncoming className="w-4 h-4 animate-pulse" />;
      case 'HOLD': return <Pause className="w-4 h-4" />;
      default: return <PhoneOff className="w-4 h-4" />;
    }
  };

  const config = getStateConfig(turret.state);

  return (
    <div className={`
      relative overflow-hidden rounded-xl glass-card
      transition-all duration-300 hover:scale-[1.02] 
      ${config.glow}
      group
    `}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-semibold text-foreground truncate">
              {turret.turretName}
            </h3>
            <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
              {getStateIcon(turret.state)}
              <span>{turret.state}</span>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className={`
            w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1
            ${turret.state === 'CONNECTED' ? 'bg-success animate-pulse-soft' : ''}
            ${turret.state === 'DISCONNECTED' ? 'bg-destructive' : ''}
            ${turret.state === 'RINGING' ? 'bg-warning animate-pulse' : ''}
            ${turret.state === 'HOLD' ? 'bg-info' : ''}
          `} />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2">
          <DetailItem icon={User} label="Party" value={turret.partyNo} />
          <DetailItem icon={Radio} label="Line" value={turret.lineNo} />
          <DetailItem icon={Server} label="Device" value={turret.deviceName} />
          <DetailItem icon={Hash} label="Call ID" value={turret.callId} />
        </div>
      </div>

      {/* Bottom accent */}
      <div className={`h-0.5 w-full bg-gradient-to-r from-transparent ${
        turret.state === 'CONNECTED' ? 'via-success' : 
        turret.state === 'DISCONNECTED' ? 'via-destructive' : 
        turret.state === 'RINGING' ? 'via-warning' : 'via-info'
      } to-transparent opacity-60`} />
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-2 min-w-0">
    <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xs font-medium text-foreground truncate">{value}</p>
    </div>
  </div>
);

export default TurretCard;