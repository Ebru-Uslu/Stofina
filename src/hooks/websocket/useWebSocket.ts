"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { 
  WebSocketConfig, 
  WebSocketStatus, 
  WebSocketError, 
  UseWebSocketReturn 
} from '../../types/websocket.types';
import {
  WEBSOCKET_CONSTANTS,
  validateWebSocketUrl,
  createWebSocketError,
  parseWebSocketMessage,
  stringifyWebSocketMessage,
  calculateReconnectDelay,
  isWebSocketReady
} from '../../utils/websocket.utils';

/**
 * Base WebSocket hook for managing connections
 * Handles connection, reconnection, error management, and message sending
 */
export const useWebSocket = (config: WebSocketConfig): UseWebSocketReturn => {
  // Validate configuration on hook initialization
  if (!validateWebSocketUrl(config.url)) {
    throw new Error(`Invalid WebSocket URL: ${config.url}`);
  }

  // State management
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.DISCONNECTED);
  const [error, setError] = useState<WebSocketError | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  // Refs for managing reconnection and cleanup
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualDisconnect = useRef(false);

  // Configuration with defaults
  const {
    url,
    protocols,
    reconnectEnabled = true,
    reconnectDelay = WEBSOCKET_CONSTANTS.DEFAULT_RECONNECT_DELAY,
    maxReconnectAttempts = WEBSOCKET_CONSTANTS.MAX_RECONNECT_ATTEMPTS,
    connectionTimeout = WEBSOCKET_CONSTANTS.CONNECTION_TIMEOUT
  } = config;

  /**
   * Clear all timeouts to prevent memory leaks
   */
  const clearTimeouts = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  }, []);

  /**
   * Create and configure WebSocket connection
   */
  const createConnection = useCallback(() => {
    try {
      setStatus(WebSocketStatus.CONNECTING);
      setError(null);

      const ws = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

      // Connection timeout
      connectionTimeoutRef.current = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          setError(createWebSocketError('timeout', 'Connection timeout'));
          setStatus(WebSocketStatus.ERROR);
        }
      }, connectionTimeout);

      // Event handlers
      ws.onopen = () => {
        clearTimeouts();
        setSocket(ws);
        setStatus(WebSocketStatus.CONNECTED);
        setError(null);
        reconnectAttempts.current = 0;
        isManualDisconnect.current = false;
      };

      ws.onmessage = (event) => {
        const parsedMessage = parseWebSocketMessage(event.data);
        if (parsedMessage) {
          setLastMessage(parsedMessage);
        }
      };

      ws.onerror = () => {
        clearTimeouts();
        setError(createWebSocketError('connection', 'WebSocket connection error'));
        setStatus(WebSocketStatus.ERROR);
      };

      ws.onclose = (event) => {
        clearTimeouts();
        setSocket(null);
        
        if (!isManualDisconnect.current && reconnectEnabled && 
            reconnectAttempts.current < maxReconnectAttempts) {
          
          setStatus(WebSocketStatus.RECONNECTING);
          const delay = calculateReconnectDelay(reconnectAttempts.current, reconnectDelay);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            createConnection();
          }, delay);
        } else {
          setStatus(WebSocketStatus.DISCONNECTED);
          if (reconnectAttempts.current >= maxReconnectAttempts) {
            setError(createWebSocketError('connection', 'Max reconnection attempts reached'));
          }
        }
      };

    } catch (err) {
      clearTimeouts();
      setError(createWebSocketError('connection', 'Failed to create WebSocket connection'));
      setStatus(WebSocketStatus.ERROR);
    }
  }, [url, protocols, reconnectEnabled, reconnectDelay, maxReconnectAttempts, connectionTimeout, clearTimeouts]);

  /**
   * Manually connect to WebSocket
   */
  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }
    
    isManualDisconnect.current = false;
    reconnectAttempts.current = 0;
    createConnection();
  }, [socket, createConnection]);

  /**
   * Manually disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    isManualDisconnect.current = true;
    clearTimeouts();
    
    if (socket) {
      socket.close();
      setSocket(null);
    }
    
    setStatus(WebSocketStatus.DISCONNECTED);
    setError(null);
  }, [socket, clearTimeouts]);

  /**
   * Send message through WebSocket
   */
  const send = useCallback((data: any): boolean => {
    if (!isWebSocketReady(socket)) {
      setError(createWebSocketError('message', 'WebSocket is not connected'));
      return false;
    }

    try {
      const message = stringifyWebSocketMessage(data);
      socket!.send(message);
      return true;
    } catch (err) {
      setError(createWebSocketError('message', 'Failed to send message'));
      return false;
    }
  }, [socket]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [url]); // Only reconnect if URL changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Computed values
  const isConnected = status === WebSocketStatus.CONNECTED;
  const isConnecting = status === WebSocketStatus.CONNECTING || status === WebSocketStatus.RECONNECTING;

  return {
    socket,
    status,
    error,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    send,
    lastMessage
  };
};