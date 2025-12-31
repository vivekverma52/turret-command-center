import StatusPanel from "@/components/StatusPanel";
import ChannelCard from "@/components/ChannelCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Radio, Zap, Phone, Wifi, WifiOff, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { channels, messages, connected, showNotification, clearMessages } = useWebSocket();

  // Calculate stats from real-time data
  const uniqueTurrets = [...new Set(channels.map(c => c.turretName))].length;
  const activeChannels = channels.filter(c => c.isActive === true).length;
  const inactiveChannels = channels.filter(c => c.isActive === false).length;

  const getStateColor = (state: string) => {
    switch (state) {
      case 'Conversation': return 'text-success';
      case 'Ringing': return 'text-warning';
      case 'CommonHold': return 'text-primary';
      case 'Idle': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="h-full bg-background px-4 md:px-6 py-6 md:py-8">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/20 border border-success/30 text-success">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">New data received!</span>
          </div>
        </div>
      )}

      {/* Connection Status & Stats */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {connected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
                <Wifi className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/30">
                <WifiOff className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Disconnected</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              WebSocket: 192.168.100.34:8080
            </span>
          </div>
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearMessages} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear ({messages.length})
            </Button>
          )}
        </div>

        <StatusPanel
          items={[
            {
              label: "Total Channels",
              value: channels.length,
              icon: Radio,
              iconColor: "text-primary",
              valueColor: "text-primary text-glow",
            },
            {
              label: "Active",
              value: activeChannels,
              icon: Zap,
              iconColor: "text-success",
              valueColor: "text-success",
            },
            {
              label: "Inactive",
              value: inactiveChannels,
              icon: Phone,
              iconColor: "text-destructive",
              valueColor: "text-destructive",
            },
          ]}
        />
      </div>

      {/* Channels Grid */}
      {channels.length === 0 ? (
        <div className="text-center py-12">
          <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-display font-bold text-foreground mb-2">
            {connected ? "Waiting for Data" : "Connecting..."}
          </h3>
          <p className="text-muted-foreground">
            {connected 
              ? "Real-time channel data will appear here." 
              : "Attempting to connect to WebSocket server..."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {channels.map((channel) => (
            <ChannelCard key={`${channel.turretName}-${channel.lineNo}`} channel={channel} />
          ))}
        </div>
      )}

      {/* Recent Messages Log */}
      {messages.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold text-foreground mb-4 tracking-wider">
            Recent Activity
          </h3>
          <div className="card-tactical rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Time</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Turret</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Line</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">State</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Party</th>
                  </tr>
                </thead>
                <tbody>
                  {[...messages].reverse().slice(0, 20).map((msg) => (
                    <tr key={msg.id} className="border-t border-border/30 hover:bg-secondary/20">
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2 text-foreground">{msg.payload.turretName || 'N/A'}</td>
                      <td className="px-4 py-2 font-mono text-primary">{msg.payload.lineName || msg.payload.lineNo || 'N/A'}</td>
                      <td className={`px-4 py-2 font-medium ${getStateColor(msg.payload.state || '')}`}>
                        {msg.payload.state || 'N/A'}
                      </td>
                      <td className="px-4 py-2 font-mono text-foreground">{msg.payload.partyNumber || msg.payload.partyNo || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
