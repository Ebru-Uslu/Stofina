"use client";

import React, { memo } from 'react';
import { OrderBookEntry } from '../../../../../types/trading.types';
import { 
  formatPriceToTurkishLira, 
  formatQuantity 
} from '../../../../../utils/priceFormatters';
import { 
  sortBuyOrdersByPrice, 
  sortSellOrdersByPrice,
  calculateSpreadBetweenPrices,
  getBestBidPrice,
  getBestAskPrice
} from '../../../../../utils/tradingCalculations';
import styles from '../Trading.module.css';

/**
 * Props for OrderBookTable component
 */
interface OrderBookTableProps {
  buyOrders: OrderBookEntry[];
  sellOrders: OrderBookEntry[];
  symbol: string;
  maxLevels?: number;
  showSpread?: boolean;
}

/**
 * Single order row component
 * Memoized to prevent unnecessary re-renders
 */
const OrderRow: React.FC<{ 
  order: OrderBookEntry; 
  side: 'buy' | 'sell';
  onClick?: (price: number) => void;
}> = memo(({ order, side, onClick }) => {
  const handleRowClick = () => {
    if (onClick) {
      onClick(order.price);
    }
  };

  return (
    <div 
      className={styles.orderRow} 
      onClick={handleRowClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <span className={styles.orderPrice}>
        {formatPriceToTurkishLira(order.price)}
      </span>
      <span className={styles.orderQuantity}>
        {formatQuantity(order.quantity)}
      </span>
      <span className={styles.orderTotal}>
        {formatQuantity(order.total)}
      </span>
    </div>
  );
});

OrderRow.displayName = 'OrderRow';

/**
 * Spread indicator component
 */
const SpreadIndicator: React.FC<{
  buyOrders: OrderBookEntry[];
  sellOrders: OrderBookEntry[];
}> = memo(({ buyOrders, sellOrders }) => {
  const bestBid = getBestBidPrice(buyOrders);
  const bestAsk = getBestAskPrice(sellOrders);
  const spread = bestBid && bestAsk ? calculateSpreadBetweenPrices(bestBid, bestAsk) : 0;

  return (
    <div className={styles.spreadIndicator}>
      <span className={styles.spreadArrows}>⬆⬇</span>
      <span className={styles.spreadLabel}>
        Spread: {formatPriceToTurkishLira(spread)}
      </span>
    </div>
  );
});

SpreadIndicator.displayName = 'SpreadIndicator';

/**
 * OrderBookTable Component
 * Single Responsibility: Display real-time order book data
 * Memoized to prevent unnecessary re-renders when parent updates
 */
export const OrderBookTable: React.FC<OrderBookTableProps> = memo(({
  buyOrders,
  sellOrders,
  symbol,
  maxLevels = 20,
  showSpread = true
}) => {
  /**
   * Pure function: Prepare display data for buy orders
   */
  const getDisplayBuyOrders = (): OrderBookEntry[] => {
    return sortBuyOrdersByPrice(buyOrders).slice(0, maxLevels);
  };

  /**
   * Pure function: Prepare display data for sell orders
   */
  const getDisplaySellOrders = (): OrderBookEntry[] => {
    return sortSellOrdersByPrice(sellOrders).slice(0, maxLevels);
  };

  /**
   * Handle order row click for price selection
   */
  const handleOrderPriceClick = (price: number) => {
    // Could emit event to parent or use context to update trading form
    console.log(`Selected price: ${price} for ${symbol}`);
  };

  // Early return for invalid symbol
  if (!symbol) {
    return (
      <div className={styles.orderBook}>
        <div className={styles.orderBookHeader}>
          <div>Invalid Symbol</div>
        </div>
      </div>
    );
  }

  const displayBuyOrders = getDisplayBuyOrders();
  const displaySellOrders = getDisplaySellOrders();

  // Show loading state when no orders available
  if (displayBuyOrders.length === 0 && displaySellOrders.length === 0) {
    return (
      <div className={styles.orderBook}>
        <div className={styles.orderBookHeader}>
          <div className={styles.buyHeader}>Alım Emirleri</div>
          <div className={styles.sellHeader}>Satım Emirleri</div>
        </div>
        <div className={styles.orderBookContent}>
          <div className={styles.emptyOrderBook}>
            <span>Order book yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderBook}>
      {/* Order Book Header */}
      <div className={styles.orderBookHeader}>
        <div className={styles.buyHeader}>
          <span>Alım Emirleri</span>
        </div>
        <div className={styles.sellHeader}>
          <span>Satım Emirleri</span>
        </div>
      </div>

      {/* Spread Indicator */}
      {showSpread && (
        <SpreadIndicator buyOrders={buyOrders} sellOrders={sellOrders} />
      )}

      {/* Order Book Content */}
      <div className={styles.orderBookContent}>
        {/* Buy Orders (Left Side) */}
        <div className={styles.buyOrders}>
          {displayBuyOrders.map((order, index) => (
            <OrderRow
              key={`buy-${order.price}-${index}`}
              order={order}
              side="buy"
              onClick={handleOrderPriceClick}
            />
          ))}
        </div>

        {/* Sell Orders (Right Side) */}
        <div className={styles.sellOrders}>
          {displaySellOrders.map((order, index) => (
            <OrderRow
              key={`sell-${order.price}-${index}`}
              order={order}
              side="sell"
              onClick={handleOrderPriceClick}
            />
          ))}
        </div>
      </div>

      {/* Column Headers */}
      <div className={styles.orderBookFooter}>
        <div className={styles.footerLabels}>
          <span>Fiyat</span>
          <span>Adet</span>
          <span>Toplam</span>
        </div>
        <div className={styles.footerLabels}>
          <span>Fiyat</span>
          <span>Adet</span>
          <span>Toplam</span>
        </div>
      </div>
    </div>
  );
});

OrderBookTable.displayName = 'OrderBookTable';