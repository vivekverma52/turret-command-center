import React, { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff, Monitor, Activity, Bell } from 'lucide-react';

interface MessagePayload {
  [key: string]: any;
}

interface WebSocketMessage {
  id: number;
  timestamp: string;
  outer: {
    turretName?: string;
    consumerTopic?: string;
    status?: string;
  };
  payload: MessagePayload;
}

function TurretDashboard() {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const stompClientRef = useRef<any>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const turretName = connected ? 'axisMF12' : 'axisMF11';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            const outerData = JSON.parse(message.body);
            let parsedContent: any = null;

            if (outerData.content) {
              try {
                parsedContent = JSON.parse(outerData.content);
              } catch {
                parsedContent = { raw: outerData.content };
              }
            }

            const newMessage: WebSocketMessage = {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              outer: {
                turretName: outerData.turretName,
                consumerTopic: outerData.consumerTopic,
                status: outerData.status,
              },
              payload: parsedContent || outerData.payload || {},
            };

            setMessages(prev => [...prev, newMessage]);

            setShowNotification(true);
            if (notificationTimeoutRef.current) {
              clearTimeout(notificationTimeoutRef.current);
            }
            notificationTimeoutRef.current = setTimeout(() => {
              setShowNotification(false);
            }, 3000);

          } catch (e) {
            const errorMessage: WebSocketMessage = {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              outer: {},
              payload: { message: message.body, error: 'Failed to parse message' }
            };
            setMessages(prev => [...prev, errorMessage]);
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

  const getStateColorClasses = (state: string) => {
    if (state === 'Conversation') return 'text-green-400';
    if (state === 'Ringing') return 'text-yellow-400';
    if (state === 'CommonHold') return 'text-blue-400';
    if (state === 'Idle') return 'text-red-400';
    return 'text-white';
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const allKeys = [...new Set(messages.flatMap(msg => Object.keys(msg.payload || {})))];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="flex items-center gap-2 bg-green-500/90 text-white px-4 py-3 rounded-lg shadow-lg">
            <Bell className="w-5 h-5" />
            New data received!
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-700/50 p-6">
            <div className="flex items-center gap-3">
              <Monitor className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">STOMP WebSocket Monitor</span>
            </div>
            <p className="text-gray-400 mt-2">Real-time message monitoring system</p>
          </div>

          {/* Status Bar */}
          <div className="border-b border-gray-700/50 p-4 flex flex-wrap gap-6">
            {/* Connection Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {connected ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <span className="text-sm text-gray-400">Connection Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className={`font-medium ${connected ? 'text-green-400' : 'text-red-400'}`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Turret Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Turret Information</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Name:</span>
                <span className="text-purple-400 font-mono bg-purple-400/10 px-2 py-0.5 rounded">
                  {turretName}
                </span>
              </div>
            </div>

            {/* Clear Button */}
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="ml-auto px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Clear Messages
              </button>
            )}
          </div>

          {/* Messages Table */}
          <div className="p-4">
            {messages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Timestamp</th>
                      {allKeys.map((key) => (
                        <th key={key} className="text-left py-3 px-4 text-gray-400 font-medium capitalize">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                        <td className="py-3 px-4 text-gray-300 font-mono text-xs">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </td>
                        {allKeys.map((key) => (
                          <td key={key} className={`py-3 px-4 font-mono text-xs ${key === 'state' ? getStateColorClasses(msg.payload[key]) : 'text-gray-300'}`}>
                            {msg.payload[key] !== null && msg.payload[key] !== undefined && msg.payload[key] !== ''
                              ? msg.payload[key].toString()
                              : 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="py-16">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No messages received</p>
                  <p className="text-gray-500 text-sm mt-1">Waiting for WebSocket messages...</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700/50 p-4 text-center">
            <p className="text-gray-500 text-sm">
              Real-time monitoring • WebSocket endpoint: localhost:8083
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TurretDashboard;
