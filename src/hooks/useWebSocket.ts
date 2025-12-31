import { useEffect, useRef, useState, useCallback } from 'react';
import type { Channel } from '@/hooks/useChannels';

export interface WebSocketPayload {
  id?: number;
  turretName?: string;
  partyNumber?: string;
  partyNo?: string;
  lineName?: string;
  lineNo?: string;
  systemName?: string;
  deviceName?: string;
  callId?: string;
  state?: string;
  ip?: string;
  isActive?: boolean;
}

export interface WebSocketMessage {
  id: number;
  timestamp: string;
  turretName: string;
  payload: WebSocketPayload;
}

export const useWebSocket = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [connected, setConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const stompClientRef = useRef<any>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    let stompClient: any;
    let isMounted = true;

    async function connect() {
      const SockJS = (await import('sockjs-client')).default;
      const { Client: StompClient } = await import('@stomp/stompjs');

      const socket = new SockJS('http://192.168.100.34:8080/ws');
      stompClient = new StompClient({
        webSocketFactory: () => socket,
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

            const payload = parsedContent || outerData.payload || outerData;
            
            const newMessage: WebSocketMessage = {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              turretName: outerData.turretName || payload.turretName || 'Unknown',
              payload: payload,
            };

            setMessages(prev => [...prev.slice(-99), newMessage]);

            // Update channels state with new data
            setChannels(prev => {
              const channelKey = `${payload.turretName}-${payload.lineName || payload.lineNo}`;
              const existingIndex = prev.findIndex(
                c => `${c.turretName}-${c.lineNo}` === channelKey
              );

              const updatedChannel: Channel = {
                id: payload.id || Date.now(),
                turretName: payload.turretName || 'Unknown',
                partyNo: payload.partyNumber || payload.partyNo || '',
                lineNo: payload.lineName || payload.lineNo || '',
                deviceName: payload.systemName || payload.deviceName || '',
                callId: payload.callId || '',
                state: payload.state || 'Idle',
                ip: payload.ip || '',
                isActive: payload.state === 'Conversation' || payload.state === 'Ringing',
              };

              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = updatedChannel;
                return updated;
              }
              return [...prev, updatedChannel];
            });

            setShowNotification(true);
            if (notificationTimeoutRef.current) {
              clearTimeout(notificationTimeoutRef.current);
            }
            notificationTimeoutRef.current = setTimeout(() => {
              setShowNotification(false);
            }, 3000);

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

  return {
    messages,
    channels,
    connected,
    showNotification,
    clearMessages,
  };
};
