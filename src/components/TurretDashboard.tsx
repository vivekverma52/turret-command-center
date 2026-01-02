import React, { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff, Activity, Bell, Radio, Phone, PhoneCall, PhoneOff, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface ActiveTurret {
  id?: number;
  turretName: string;
  ip?: string;
  notificationIp?: string;
  port?: number;
  profileName?: string;
  subscribePort?: number;
  noOfChannel?: number;
  isActive?: boolean;
  // WebSocket live data
  partyNo?: string | null;
  lineNo?: string | null;
  deviceName?: string | null;
  callId?: string | null;
  state?: string | null;
  timestamp?: string | null;
  conversationCount?: number;
}

interface WebSocketData {
  turretName: string | null;
  partyNo: string | null;
  lineNo: string | null;
  deviceName: string | null;
  callId: string | null;
  state: string | null;
  timestamp: string | null;
  conversationCount: number;
}

function TurretDashboard() {
  const [turrets, setTurrets] = useState<ActiveTurret[]>([]);
  const [connected, setConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const stompClientRef = useRef<any>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch active turrets from API
  const { data: activeTurrets, isLoading } = useQuery({
    queryKey: ['activeTurrets'],
    queryFn: () => apiFetch<ActiveTurret[]>('/turrets/active'),
    refetchOnWindowFocus: false,
  });

  // Initialize turrets from API data
  useEffect(() => {
    if (activeTurrets) {
      setTurrets(activeTurrets);
    }
  }, [activeTurrets]);

  // WebSocket connection
  useEffect(() => {
    let stompClient: any;
    let isMounted = true;

    async function connect() {
      const { Client: StompClient } = await import('@stomp/stompjs');

      stompClient = new StompClient({
        brokerURL: 'ws://localhost:8083/ws/websocket',
        debug: () => {},
        reconnectDelay: 5000,
      });

      stompClient.onConnect = () => {
        if (!isMounted) return;
        setConnected(true);

        stompClient.subscribe('/topic/myTopic', (message: any) => {
          try {
            const wsData: WebSocketData = JSON.parse(message.body);
            
            // Update turret if turretName matches
            if (wsData.turretName) {
              setTurrets(prev => prev.map(turret => {
                if (turret.turretName === wsData.turretName) {
                  return {
                    ...turret,
                    partyNo: wsData.partyNo,
                    lineNo: wsData.lineNo,
                    deviceName: wsData.deviceName,
                    callId: wsData.callId,
                    state: wsData.state,
                    timestamp: wsData.timestamp,
                    conversationCount: wsData.conversationCount,
                  };
                }
                return turret;
              }));
            }

            setShowNotification(true);
            if (notificationTimeoutRef.current) {
              clearTimeout(notificationTimeoutRef.current);
            }
            notificationTimeoutRef.current = setTimeout(() => {
              setShowNotification(false);
            }, 2000);

          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
          }
        });
      };

      stompClient.onStompError = () => {
        if (!isMounted) return;
        setConnected(false);
      };

      stompClient.onWebSocketClose = () => {
        if (!isMounted) return;
        setConnected(false);
      };

      stompClient.activate();
      stompClientRef.current = stompClient;
    }

    connect();

    return () => {
      isMounted = false;
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const getStateColor = (state: string | null | undefined) => {
    if (!state) return 'bg-muted text-muted-foreground';
    switch (state) {
      case 'Conversation': return 'bg-success/20 text-success';
      case 'Ringing': return 'bg-warning/20 text-warning';
      case 'CommonHold': return 'bg-primary/20 text-primary';
      case 'Idle': return 'bg-secondary text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStateIcon = (state: string | null | undefined) => {
    switch (state) {
      case 'Conversation': return <PhoneCall className="w-4 h-4" />;
      case 'Ringing': return <Phone className="w-4 h-4 animate-pulse" />;
      case 'CommonHold': return <Clock className="w-4 h-4" />;
      default: return <PhoneOff className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Activity className="w-6 h-6 animate-pulse" />
          <span>Loading active turrets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 bg-success/90 text-success-foreground px-4 py-3 rounded-lg shadow-lg">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Live update received!</span>
          </div>
        </div>
      )}

      {/* Connection Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {connected ? (
              <Wifi className="w-5 h-5 text-success" />
            ) : (
              <WifiOff className="w-5 h-5 text-destructive" />
            )}
            <span className="text-sm text-muted-foreground">WebSocket:</span>
            <span className={`font-medium ${connected ? 'text-success' : 'text-destructive'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Active Turrets:</span>
            <span className="font-mono font-bold text-foreground">{turrets.length}</span>
          </div>
        </div>
      </div>

      {/* Turret Cards Grid */}
      {turrets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turrets.map((turret) => (
            <div
              key={turret.id || turret.turretName}
              className="card-tactical rounded-lg p-5 relative overflow-hidden group transition-all duration-300 hover:glow-cyan"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground tracking-wider">
                    {turret.turretName}
                  </h3>
                  {turret.profileName && (
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Profile: {turret.profileName}
                    </p>
                  )}
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStateColor(turret.state)}`}>
                  {getStateIcon(turret.state)}
                  <span>{turret.state || 'Unknown'}</span>
                </div>
              </div>

              {/* Network Info */}
              {turret.ip && (
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <Radio className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-xs">{turret.ip}</span>
                  {turret.port && <span className="font-mono text-xs">:{turret.port}</span>}
                </div>
              )}

              {/* Live Data Section */}
              <div className="space-y-2 bg-secondary/30 rounded-lg p-3 border border-border/30">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Party No:</span>
                    <p className="font-mono text-foreground">{turret.partyNo || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Line No:</span>
                    <p className="font-mono text-foreground">{turret.lineNo || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Device:</span>
                    <p className="font-mono text-foreground truncate">{turret.deviceName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conversations:</span>
                    <p className="font-mono text-foreground">{turret.conversationCount ?? 0}</p>
                  </div>
                </div>
                
                {turret.callId && (
                  <div className="pt-2 border-t border-border/30">
                    <span className="text-muted-foreground text-xs">Call ID:</span>
                    <p className="font-mono text-[10px] text-foreground truncate">{turret.callId}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 mt-3 border-t border-border/30 flex items-center justify-between">
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${turret.isActive ? 'text-success' : 'text-muted-foreground'}`}>
                  {turret.isActive ? '● Active' : '○ Inactive'}
                </span>
                {turret.noOfChannel && (
                  <span className="text-[10px] text-muted-foreground">
                    {turret.noOfChannel} Channel{turret.noOfChannel > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">No active turrets found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Waiting for turrets to come online...
          </p>
        </div>
      )}
    </div>
  );
}

export default TurretDashboard;
