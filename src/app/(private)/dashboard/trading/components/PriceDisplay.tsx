"use client";

import React from 'react';
import { StockPrice } from '../../../../../types/marketData.types';
import { 
  formatPriceToTurkishLira, 
  formatPriceChange, 
  formatPercentageChange,
  getEmptyPriceDisplay,
  getMarketClosedDisplay,
  isValidDisplayPrice
} from '../../../../../utils/priceFormatters';
import styles from '../Trading.module.css';


interface PriceDisplayProps {
  stockData: StockPrice | null;
  symbol: string;
  showChange?: boolean;
  showVolume?: boolean;
  isLive?: boolean;
}


export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  stockData,
  symbol,
  showChange = true,
  showVolume = true,
  isLive = true
}) => {
 
  const getDisplayPrice = (): string => {
    if (!stockData) return getEmptyPriceDisplay();
    if (!isValidDisplayPrice(stockData.price)) return getMarketClosedDisplay();
    return formatPriceToTurkishLira(stockData.price);
  };

  const getPriceChangeStyle = (): string => {
    if (!stockData || !showChange) return '';
    const isPositive = stockData.change >= 0;
    return isPositive ? styles.positive : styles.negative;
  };

  
  const getChangeDisplay = (): { changeText: string; percentText: string } | null => {
    if (!stockData || !showChange) return null;
    
    const changeData = formatPriceChange(stockData.change);
    const percentText = formatPercentageChange(stockData.changePercent);
    
    return {
      changeText: changeData.text,
      percentText
    };
  };

  
  if (!symbol) {
    return (
      <div className={styles.priceInfo}>
        <div className={styles.currentPrice}>Invalid Symbol</div>
      </div>
    );
  }

  const displayPrice = getDisplayPrice();
  const changeDisplay = getChangeDisplay();
  const priceChangeStyle = getPriceChangeStyle();

  return (
    <div className={styles.priceInfo}>
      
      <div className={styles.stockTitle}>
        <span className={styles.stockSymbol}>{symbol}</span>
        {isLive && stockData && (
          <span className={styles.liveTag}>Live</span>
        )}
      </div>

      
      <div className={styles.currentPrice}>
        {displayPrice}
      </div>

      {/* Price Change Information */}
      {changeDisplay && (
        <div className={`${styles.priceChange} ${priceChangeStyle}`}>
          {changeDisplay.changeText} ({changeDisplay.percentText})
        </div>
      )}

     
      {stockData && (
        <div className={styles.marketStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Açılış</span>
            <span className={styles.statValue}>
              {formatPriceToTurkishLira(stockData.open)}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Yüksek</span>
            <span className={styles.statValue}>
              {formatPriceToTurkishLira(stockData.high)}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Düşük</span>
            <span className={styles.statValue}>
              {formatPriceToTurkishLira(stockData.low)}
            </span>
          </div>
          {showVolume && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Hacim</span>
              <span className={styles.statValue}>
                {(stockData.volume / 1000000).toFixed(1)}M
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};