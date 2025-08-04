"use client";

import { useCallback, useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { OrderBook, OrderBookEntry, OrderBookUpdate } from '../../types/trading.types';
import { WebSocketMessage } from '../../types/websocket.types';
import { getOrderBookWebSocketUrl, getConnectionSettings, WEBSOCKET_CONFIG } from '../../config/websocket.config';

/**
 * Order book specific error type
 */
export interface OrderBookError {
  type: 'connection' | 'data' | 'subscription';
  message: string;
  symbol?: string;
  timestamp: Date;
}

/**
 * Order book stream hook
 * Manages real-time order book updates from Order Service
 */
export const useOrderBookStream = (symbol: string, orderServiceUrl?: string) => {
  // Validate symbol parameter
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Symbol is required and must be a string');
  }

  // State management
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState<string>(symbol.toUpperCase());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [orderBookError, setOrderBookError] = useState<OrderBookError | null>(null);

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
    url: orderServiceUrl || getOrderBookWebSocketUrl(currentSymbol),
    ...connectionSettings,
    maxReconnectAttempts: 15 // Override for order book
  });

  /**
   * Pure function: Sort buy orders (highest price first)
   */
  const sortBuyOrders = useCallback((orders: OrderBookEntry[]): OrderBookEntry[] => {
    return [...orders].sort((a, b) => b.price - a.price);
  }, []);

  /**
   * Pure function: Sort sell orders (lowest price first)
   */
  const sortSellOrders = useCallback((orders: OrderBookEntry[]): OrderBookEntry[] => {
    return [...orders].sort((a, b) => a.price - b.price);
  }, []);

  /**
   * Pure function: Validate order book entry
   */
  const isValidOrderEntry = useCallback((entry: any): entry is OrderBookEntry => {
    return (
      entry &&
      typeof entry.price === 'number' &&
      typeof entry.quantity === 'number' &&
      entry.price > 0 &&
      entry.quantity > 0
    );
  }, []);

  /**
   * Pure function: Calculate spread between best bid and ask
   */
  const calculateSpread = useCallback((): number => {
    const bestBid = buyOrders[0]?.price || 0;
    const bestAsk = sellOrders[0]?.price || 0;
    
    if (bestBid === 0 || bestAsk === 0) return 0;
    return Number((bestAsk - bestBid).toFixed(4));
  }, [buyOrders, sellOrders]);

  /**
   * Get best bid price (highest buy order)
   */
  const getBestBid = useCallback((): number | null => {
    return buyOrders.length > 0 ? buyOrders[0].price : null;
  }, [buyOrders]);

  /**
   * Get best ask price (lowest sell order)
   */
  const getBestAsk = useCallback((): number | null => {
    return sellOrders.length > 0 ? sellOrders[0].price : null;
  }, [sellOrders]);

  /**
   * Get total quantity at specific price level
   */
  const getOrderDepth = useCallback((price: number, side: 'buy' | 'sell'): number => {
    const orders = side === 'buy' ? buyOrders : sellOrders;
    const order = orders.find(o => Math.abs(o.price - price) < 0.01);
    return order?.quantity || 0;
  }, [buyOrders, sellOrders]);

  /**
   * Get mid price (average of best bid and ask)
   */
  const getMidPrice = useCallback((): number | null => {
    const bestBid = getBestBid();
    const bestAsk = getBestAsk();
    
    if (bestBid === null || bestAsk === null) return null;
    return Number(((bestBid + bestAsk) / 2).toFixed(4));
  }, [getBestBid, getBestAsk]);

  /**
   * Update buy orders with new data
   */
  const updateBuyOrders = useCallback((newOrders: OrderBookEntry[]) => {
    const validOrders = newOrders.filter(isValidOrderEntry);
    const sortedOrders = sortBuyOrders(validOrders);
    const limitedOrders = sortedOrders.slice(0, WEBSOCKET_CONFIG.ORDER_BOOK.maxLevels);
    
    setBuyOrders(limitedOrders);
  }, [isValidOrderEntry, sortBuyOrders]);

  /**
   * Update sell orders with new data
   */
  const updateSellOrders = useCallback((newOrders: OrderBookEntry[]) => {
    const validOrders = newOrders.filter(isValidOrderEntry);
    const sortedOrders = sortSellOrders(validOrders);
    const limitedOrders = sortedOrders.slice(0, WEBSOCKET_CONFIG.ORDER_BOOK.maxLevels);
    
    setSellOrders(limitedOrders);
  }, [isValidOrderEntry, sortSellOrders]);

  /**
   * Handle full order book update
   */
  const handleFullUpdate = useCallback((orderBook: OrderBook) => {
    if (orderBook.symbol.toUpperCase() !== currentSymbol) {
      return; // Ignore updates for different symbols
    }

    updateBuyOrders(orderBook.buyOrders);
    updateSellOrders(orderBook.sellOrders);
    setLastUpdate(new Date());
    setOrderBookError(null);
  }, [currentSymbol, updateBuyOrders, updateSellOrders]);

  /**
   * Handle incremental order book update
   */
  const handleIncrementalUpdate = useCallback((updates: OrderBookEntry[], side: 'buy' | 'sell') => {
    if (side === 'buy') {
      setBuyOrders(prev => {
        const newOrders = [...prev];
        
        updates.forEach(update => {
          if (!isValidOrderEntry(update)) return;
          
          const existingIndex = newOrders.findIndex(
            order => Math.abs(order.price - update.price) < 0.01
          );
          
          if (existingIndex !== -1) {
            if (update.quantity === 0) {
              // Remove order if quantity is 0
              newOrders.splice(existingIndex, 1);
            } else {
              // Update existing order
              newOrders[existingIndex] = { ...update, total: update.price * update.quantity };
            }
          } else if (update.quantity > 0) {
            // Add new order
            newOrders.push({ ...update, total: update.price * update.quantity });
          }
        });
        
        return sortBuyOrders(newOrders).slice(0, WEBSOCKET_CONFIG.ORDER_BOOK.maxLevels);
      });
    } else {
      setSellOrders(prev => {
        const newOrders = [...prev];
        
        updates.forEach(update => {
          if (!isValidOrderEntry(update)) return;
          
          const existingIndex = newOrders.findIndex(
            order => Math.abs(order.price - update.price) < 0.01
          );
          
          if (existingIndex !== -1) {
            if (update.quantity === 0) {
              // Remove order if quantity is 0
              newOrders.splice(existingIndex, 1);
            } else {
              // Update existing order
              newOrders[existingIndex] = { ...update, total: update.price * update.quantity };
            }
          } else if (update.quantity > 0) {
            // Add new order
            newOrders.push({ ...update, total: update.price * update.quantity });
          }
        });
        
        return sortSellOrders(newOrders).slice(0, WEBSOCKET_CONFIG.ORDER_BOOK.maxLevels);
      });
    }
    
    setLastUpdate(new Date());
  }, [isValidOrderEntry, sortBuyOrders, sortSellOrders]);

  /**
   * Subscribe to order book updates for current symbol
   */
  const subscribeToOrderBook = useCallback(() => {
    if (!isConnected) return false;

    const message: WebSocketMessage<{ symbol: string }> = {
      type: 'SUBSCRIBE_ORDER_BOOK',
      payload: { symbol: currentSymbol },
      timestamp: new Date().toISOString(),
      id: `orderbook-sub-${currentSymbol}-${Date.now()}`
    };

    return send(message);
  }, [isConnected, currentSymbol, send]);

  /**
   * Clear order book data
   */
  const clearOrderBook = useCallback(() => {
    setBuyOrders([]);
    setSellOrders([]);
    setLastUpdate(null);
    setOrderBookError(null);
  }, []);

  // Process incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const message = lastMessage as WebSocketMessage<OrderBookUpdate>;
      
      if (message.type === 'ORDER_BOOK_UPDATE') {
        const update = message.payload;
        
        // Validate symbol matches
        if (update.symbol.toUpperCase() !== currentSymbol) {
          return;
        }
        
        switch (update.type) {
          case 'FULL_UPDATE':
            const orderBook = update.data as OrderBook;
            handleFullUpdate(orderBook);
            break;
            
          case 'INCREMENTAL_UPDATE':
            const entries = update.data as { side: 'buy' | 'sell', orders: OrderBookEntry[] };
            if (Array.isArray(entries)) {
              // Legacy format support
              handleIncrementalUpdate(entries, 'buy');
            } else {
              handleIncrementalUpdate(entries.orders, entries.side);
            }
            break;
            
          case 'TRADE_EXECUTED':
            // Trade execution might affect order book, request full update
            setTimeout(() => subscribeToOrderBook(), 100);
            break;
        }
      }
    } catch (err) {
      setOrderBookError({
        type: 'data',
        message: 'Failed to process order book update',
        symbol: currentSymbol,
        timestamp: new Date()
      });
      console.error('Order book message processing error:', err);
    }
  }, [lastMessage, currentSymbol, handleFullUpdate, handleIncrementalUpdate, subscribeToOrderBook]);

  // Handle symbol changes
  useEffect(() => {
    if (symbol.toUpperCase() !== currentSymbol) {
      clearOrderBook();
      setCurrentSymbol(symbol.toUpperCase());
    }
  }, [symbol, currentSymbol, clearOrderBook]);

  // Auto-subscribe when connected
  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        subscribeToOrderBook();
      }, 500); // Small delay to ensure connection is stable
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, subscribeToOrderBook]);

  // Computed values
  const spread = calculateSpread();
  const depth = buyOrders.length + sellOrders.length;
  const isLoading = isConnecting || (isConnected && buyOrders.length === 0 && sellOrders.length === 0);
  const error = connectionError || orderBookError;

  return {
    // Order Book Data
    buyOrders,
    sellOrders,
    spread,
    depth,
    
    // Connection State
    isConnected,
    isLoading,
    error,
    lastUpdate,
    
    // Current State
    symbol: currentSymbol,
    
    // Business Methods
    getBestBid,
    getBestAsk,
    getMidPrice,
    getOrderDepth,
    subscribeToOrderBook,
    clearOrderBook
  };
};