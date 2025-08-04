"use client";

import { useCallback, useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { StockPrice, MarketDataUpdate, MarketDataSubscription } from '../../types/marketData.types';
import { WebSocketMessage } from '../../types/websocket.types';
import { getMarketDataWebSocketUrl, getConnectionSettings, WEBSOCKET_CONFIG } from '../../config/websocket.config';

/**
 * Market data streaming hook
 * Manages real-time stock price updates from Market Data Service
 */
export const useMarketDataStream = (marketDataUrl?: string) => {
  // State for market data
  const [stockPrices, setStockPrices] = useState<Map<string, StockPrice>>(new Map());
  const [subscribedSymbols, setSubscribedSymbols] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Get WebSocket configuration
  const connectionSettings = getConnectionSettings();
  
  // WebSocket connection to Market Data Service
  const { 
    isConnected, 
    isConnecting, 
    error, 
    send, 
    lastMessage 
  } = useWebSocket({
    url: marketDataUrl || getMarketDataWebSocketUrl(),
    ...connectionSettings
  });

  /**
   * Subscribe to specific stock symbols
   */
  const subscribeToSymbols = useCallback((symbols: string[]) => {
    if (!isConnected || symbols.length === 0) {
      return false;
    }

    const subscription: MarketDataSubscription = {
      symbols,
      updateFrequency: WEBSOCKET_CONFIG.MARKET_DATA.updateFrequency,
      includeVolume: true,
      includeExtendedHours: false
    };

    const message: WebSocketMessage<MarketDataSubscription> = {
      type: 'SUBSCRIBE',
      payload: subscription,
      timestamp: new Date().toISOString(),
      id: `sub-${Date.now()}`
    };

    const success = send(message);
    if (success) {
      setSubscribedSymbols(prev => {
        const newSet = new Set(prev);
        symbols.forEach(symbol => newSet.add(symbol.toUpperCase()));
        return newSet;
      });
    }

    return success;
  }, [isConnected, send]);

  /**
   * Unsubscribe from specific stock symbols
   */
  const unsubscribeFromSymbols = useCallback((symbols: string[]) => {
    if (!isConnected || symbols.length === 0) {
      return false;
    }

    const message: WebSocketMessage<string[]> = {
      type: 'UNSUBSCRIBE',
      payload: symbols.map(s => s.toUpperCase()),
      timestamp: new Date().toISOString(),
      id: `unsub-${Date.now()}`
    };

    const success = send(message);
    if (success) {
      setSubscribedSymbols(prev => {
        const newSet = new Set(prev);
        symbols.forEach(symbol => newSet.delete(symbol.toUpperCase()));
        return newSet;
      });

      // Remove prices for unsubscribed symbols
      setStockPrices(prev => {
        const newMap = new Map(prev);
        symbols.forEach(symbol => newMap.delete(symbol.toUpperCase()));
        return newMap;
      });
    }

    return success;
  }, [isConnected, send]);

  /**
   * Get current price for a specific symbol
   */
  const getStockPrice = useCallback((symbol: string): StockPrice | null => {
    return stockPrices.get(symbol.toUpperCase()) || null;
  }, [stockPrices]);

  /**
   * Get all current stock prices
   */
  const getAllStockPrices = useCallback((): StockPrice[] => {
    return Array.from(stockPrices.values());
  }, [stockPrices]);

  /**
   * Check if symbol is subscribed
   */
  const isSymbolSubscribed = useCallback((symbol: string): boolean => {
    return subscribedSymbols.has(symbol.toUpperCase());
  }, [subscribedSymbols]);

  // Process incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const message = lastMessage as WebSocketMessage<MarketDataUpdate>;
      
      if (message.type === 'MARKET_DATA_UPDATE') {
        const update = message.payload;
        
        switch (update.type) {
          case 'PRICE_UPDATE':
            if (update.symbol) {
              const priceData = update.data as StockPrice;
              setStockPrices(prev => {
                const newMap = new Map(prev);
                newMap.set(update.symbol!.toUpperCase(), {
                  ...priceData,
                  symbol: priceData.symbol.toUpperCase()
                });
                return newMap;
              });
              setLastUpdate(new Date());
            }
            break;
            
          case 'SYMBOL_LIST':
            // Handle bulk price updates
            const priceList = update.data as StockPrice[];
            if (Array.isArray(priceList)) {
              setStockPrices(prev => {
                const newMap = new Map(prev);
                priceList.forEach(price => {
                  newMap.set(price.symbol.toUpperCase(), {
                    ...price,
                    symbol: price.symbol.toUpperCase()
                  });
                });
                return newMap;
              });
              setLastUpdate(new Date());
            }
            break;
            
          case 'MARKET_STATUS':
            // Handle market status updates
            console.log('Market status:', update.data);
            break;
        }
      }
    } catch (err) {
      console.error('Failed to process market data message:', err);
    }
  }, [lastMessage]);

  // Auto-subscribe to default symbols when connected
  useEffect(() => {
    if (isConnected && subscribedSymbols.size === 0) {
      // Subscribe to default Turkish stocks from config
      const defaultSymbols = WEBSOCKET_CONFIG.MARKET_DATA.defaultSymbols;
      subscribeToSymbols(defaultSymbols);
    }
  }, [isConnected, subscribedSymbols.size, subscribeToSymbols]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    error,
    lastUpdate,
    
    // Data
    stockPrices: stockPrices,
    subscribedSymbols: Array.from(subscribedSymbols),
    
    // Methods
    subscribeToSymbols,
    unsubscribeFromSymbols,
    getStockPrice,
    getAllStockPrices,
    isSymbolSubscribed
  };
};