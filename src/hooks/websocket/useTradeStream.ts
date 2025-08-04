"use client";

import { useCallback, useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { Trade, TradeEvent } from '../../types/trading.types';
import { WebSocketMessage } from '../../types/websocket.types';
import { getTradeEventsWebSocketUrl, getConnectionSettings, WEBSOCKET_CONFIG } from '../../config/websocket.config';

/**
 * Trade stream specific error type
 */
export interface TradeStreamError {
  type: 'connection' | 'data' | 'subscription';
  message: string;
  symbol?: string;
  timestamp: Date;
}

/**
 * Trade statistics interface
 */
export interface TradeStatistics {
  totalVolume: number;
  totalTrades: number;
  averagePrice: number;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
}

/**
 * Trade stream hook
 * Manages real-time trade events from Order Service
 */
export const useTradeStream = (symbol: string, orderServiceUrl?: string) => {
  // Validate symbol parameter
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Symbol is required and must be a string');
  }

  // State management
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState<string>(symbol.toUpperCase());
  const [tradeStats, setTradeStats] = useState<TradeStatistics | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [tradeError, setTradeError] = useState<TradeStreamError | null>(null);

  // Configuration from WebSocket config
  const MAX_TRADES_HISTORY = WEBSOCKET_CONFIG.TRADE_EVENTS.maxHistoryCount;
  const STATS_UPDATE_INTERVAL = 1000; // Update stats every second

  // Get WebSocket configuration
  const connectionSettings = getConnectionSettings();

  // WebSocket connection to Order Service
  const { 
    isConnected, 
    isConnecting, 
    error: connectionError, 
    send, 
    lastMessage 
  } = useWebSocket({
    url: orderServiceUrl || getTradeEventsWebSocketUrl(currentSymbol),
    ...connectionSettings,
    maxReconnectAttempts: 15 // Override for trade events
  });

  /**
   * Pure function: Validate trade data
   */
  const isValidTrade = useCallback((trade: any): trade is Trade => {
    return (
      trade &&
      typeof trade.id === 'string' &&
      typeof trade.symbol === 'string' &&
      typeof trade.price === 'number' &&
      typeof trade.quantity === 'number' &&
      typeof trade.side === 'string' &&
      typeof trade.timestamp === 'string' &&
      trade.price > 0 &&
      trade.quantity > 0 &&
      ['BUY', 'SELL'].includes(trade.side)
    );
  }, []);

  /**
   * Pure function: Sort trades by timestamp (newest first)
   */
  const sortTradesByTime = useCallback((trades: Trade[]): Trade[] => {
    return [...trades].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, []);

  /**
   * Pure function: Calculate trade statistics
   */
  const calculateTradeStatistics = useCallback((trades: Trade[]): TradeStatistics => {
    if (trades.length === 0) {
      return {
        totalVolume: 0,
        totalTrades: 0,
        averagePrice: 0,
        lastPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        highPrice: 0,
        lowPrice: 0
      };
    }

    const sortedTrades = sortTradesByTime(trades);
    const lastPrice = sortedTrades[0].price;
    const firstPrice = sortedTrades[sortedTrades.length - 1].price;
    
    const totalVolume = trades.reduce((sum, trade) => sum + (trade.price * trade.quantity), 0);
    const totalQuantity = trades.reduce((sum, trade) => sum + trade.quantity, 0);
    const averagePrice = totalQuantity > 0 ? totalVolume / totalQuantity : 0;
    
    const priceChange = lastPrice - firstPrice;
    const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
    
    const prices = trades.map(trade => trade.price);
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);

    return {
      totalVolume: Number(totalVolume.toFixed(2)),
      totalTrades: trades.length,
      averagePrice: Number(averagePrice.toFixed(4)),
      lastPrice: Number(lastPrice.toFixed(4)),
      priceChange: Number(priceChange.toFixed(4)),
      priceChangePercent: Number(priceChangePercent.toFixed(2)),
      highPrice: Number(highPrice.toFixed(4)),
      lowPrice: Number(lowPrice.toFixed(4))
    };
  }, [sortTradesByTime]);

  /**
   * Add new trade to the trade history
   */
  const addTrade = useCallback((newTrade: Trade) => {
    if (!isValidTrade(newTrade)) {
      setTradeError({
        type: 'data',
        message: 'Invalid trade data received',
        symbol: currentSymbol,
        timestamp: new Date()
      });
      return;
    }

    // Ensure trade belongs to current symbol
    if (newTrade.symbol.toUpperCase() !== currentSymbol) {
      return;
    }

    setTrades(prev => {
      const updatedTrades = [newTrade, ...prev];
      const limitedTrades = updatedTrades.slice(0, MAX_TRADES_HISTORY);
      return sortTradesByTime(limitedTrades);
    });

    setLastUpdate(new Date());
    setTradeError(null);
  }, [isValidTrade, currentSymbol, sortTradesByTime, MAX_TRADES_HISTORY]);

  /**
   * Get trades filtered by side (BUY or SELL)
   */
  const getTradesBySide = useCallback((side: 'BUY' | 'SELL'): Trade[] => {
    return trades.filter(trade => trade.side === side);
  }, [trades]);

  /**
   * Get trades within specific time range
   */
  const getTradesInTimeRange = useCallback((fromTime: Date, toTime: Date): Trade[] => {
    return trades.filter(trade => {
      const tradeTime = new Date(trade.timestamp);
      return tradeTime >= fromTime && tradeTime <= toTime;
    });
  }, [trades]);

  /**
   * Get recent trades (last N trades)
   */
  const getRecentTrades = useCallback((count: number = 10): Trade[] => {
    return trades.slice(0, Math.min(count, trades.length));
  }, [trades]);

  /**
   * Get latest trade price
   */
  const getLastTradePrice = useCallback((): number | null => {
    return trades.length > 0 ? trades[0].price : null;
  }, [trades]);

  /**
   * Check if price is trending up based on recent trades
   */
  const isPriceTrendingUp = useCallback((lookbackCount: number = 5): boolean | null => {
    if (trades.length < lookbackCount) return null;
    
    const recentTrades = trades.slice(0, lookbackCount);
    const firstPrice = recentTrades[lookbackCount - 1].price;
    const lastPrice = recentTrades[0].price;
    
    return lastPrice > firstPrice;
  }, [trades]);

  /**
   * Subscribe to trade events for current symbol
   */
  const subscribeToTrades = useCallback(() => {
    if (!isConnected) return false;

    const message: WebSocketMessage<{ symbol: string }> = {
      type: 'SUBSCRIBE_TRADES',
      payload: { symbol: currentSymbol },
      timestamp: new Date().toISOString(),
      id: `trades-sub-${currentSymbol}-${Date.now()}`
    };

    return send(message);
  }, [isConnected, currentSymbol, send]);

  /**
   * Clear trade history
   */
  const clearTrades = useCallback(() => {
    setTrades([]);
    setTradeStats(null);
    setLastUpdate(null);
    setTradeError(null);
  }, []);

  // Process incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const message = lastMessage as WebSocketMessage<TradeEvent>;
      
      if (message.type === 'TRADE_EVENT') {
        const event = message.payload;
        
        // Validate symbol matches
        if (event.symbol.toUpperCase() !== currentSymbol) {
          return;
        }
        
        switch (event.type) {
          case 'TRADE_EXECUTED':
            if (event.trade) {
              addTrade(event.trade);
            }
            break;
            
          case 'ORDER_MATCHED':
            // Order matched events might contain trade data
            if (event.trade) {
              addTrade(event.trade);
            }
            break;
            
          case 'ORDER_CANCELLED':
            // Handle order cancellation if needed
            console.log('Order cancelled:', event);
            break;
        }
      }
    } catch (err) {
      setTradeError({
        type: 'data',
        message: 'Failed to process trade event',
        symbol: currentSymbol,
        timestamp: new Date()
      });
      console.error('Trade stream message processing error:', err);
    }
  }, [lastMessage, currentSymbol, addTrade]);

  // Handle symbol changes
  useEffect(() => {
    if (symbol.toUpperCase() !== currentSymbol) {
      clearTrades();
      setCurrentSymbol(symbol.toUpperCase());
    }
  }, [symbol, currentSymbol, clearTrades]);

  // Auto-subscribe when connected
  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        subscribeToTrades();
      }, 500); // Small delay to ensure connection is stable
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, subscribeToTrades]);

  // Update trade statistics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (trades.length > 0) {
        const stats = calculateTradeStatistics(trades);
        setTradeStats(stats);
      }
    }, STATS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [trades, calculateTradeStatistics, STATS_UPDATE_INTERVAL]);

  // Computed values
  const isLoading = isConnecting || (isConnected && trades.length === 0);
  const error = connectionError || tradeError;
  const lastTradePrice = getLastTradePrice();
  const priceTrend = isPriceTrendingUp();

  return {
    // Trade Data
    trades,
    tradeStats,
    lastTradePrice,
    priceTrend,
    
    // Connection State
    isConnected,
    isLoading,
    error,
    lastUpdate,
    
    // Current State
    symbol: currentSymbol,
    
    // Business Methods
    getTradesBySide,
    getTradesInTimeRange,
    getRecentTrades,
    getLastTradePrice,
    isPriceTrendingUp,
    subscribeToTrades,
    clearTrades
  };
};