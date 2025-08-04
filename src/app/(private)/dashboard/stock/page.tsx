"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Stock.module.css';
import { useMarketDataAPI } from '../../../../hooks/useMarketDataAPI';
import { useMarketDataStreamSTOMP } from '../../../../hooks/websocket/useMarketDataStreamSTOMP';

/**
 * Stock List Page Component
 * Displays all available stocks with real-time data
 */
export default function StockPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();
  
  // Market data hooks
  const { symbols: apiSymbols, isLoading: isLoadingSymbols, error: apiError } = useMarketDataAPI();
  const marketDataStream = useMarketDataStreamSTOMP();

  /**
   * Get available stocks from both API and WebSocket data
   */
  const availableStocks = useMemo(() => {
    // Try to get data from WebSocket first
    const webSocketPrices = marketDataStream.getAllStockPrices();
    
    if (webSocketPrices.length > 0) {
      return webSocketPrices.map(stock => ({
        symbol: stock.symbol,
        name: stock.companyName || stock.symbol,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        high: stock.high || 0,
        low: stock.low || 0
      })).sort((a, b) => a.symbol.localeCompare(b.symbol));
    }
    
    // Fallback to API data if WebSocket data is not available
    if (apiSymbols.length > 0) {
      return apiSymbols.map(stock => ({
        symbol: stock.symbol,
        name: stock.companyName || stock.symbol,
        price: stock.currentPrice,
        change: stock.change,
        changePercent: (stock.change / (stock.currentPrice - stock.change)) * 100,
        volume: 0,
        high: stock.dayHigh || 0,
        low: stock.dayLow || 0
      })).sort((a, b) => a.symbol.localeCompare(b.symbol));
    }
    
    return [];
  }, [marketDataStream.stockPrices, apiSymbols]);

  /**
   * Filter stocks based on search query
   */
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return availableStocks;
    
    const query = searchQuery.toLowerCase().trim();
    return availableStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    );
  }, [availableStocks, searchQuery]);

  /**
   * Format price to Turkish Lira
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  /**
   * Format percentage change
   */
  const formatPercentage = (percent: number): string => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  /**
   * Get change style class
   */
  const getChangeStyle = (change: number): string => {
    if (change > 0) return styles.positive;
    if (change < 0) return styles.negative;
    return styles.neutral;
  };

  /**
   * Handle Buy button click
   */
  const handleBuyClick = (symbol: string) => {
    // Navigate to trading page with symbol and buy action
    router.push(`/dashboard/trading?symbol=${symbol}&action=buy`);
  };

  /**
   * Handle Sell button click
   */
  const handleSellClick = (symbol: string) => {
    // Navigate to trading page with symbol and sell action
    router.push(`/dashboard/trading?symbol=${symbol}&action=sell`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>HİSSE SENETLERİ</h1>
      </div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Hisse Senedi"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
      </div>

      {/* Stock Table */}
      <div className={styles.tableContainer}>
        {isLoadingSymbols ? (
          <div className={styles.loading}>Hisseler yükleniyor...</div>
        ) : apiError ? (
          <div className={styles.error}>Hisse verileri yüklenirken hata oluştu</div>
        ) : (
          <table className={styles.stockTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Hisse Kodu</th>
                <th>Hisse Adı</th>
                <th>Fiyat</th>
                <th>Değişim %</th>
                <th>Piyasa Değeri</th>
                <th>Yüksek/Düşük</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <tr key={stock.symbol} className={styles.tableRow}>
                    <td className={styles.stockCode}>{stock.symbol}</td>
                    <td className={styles.stockName}>{stock.name}</td>
                    <td className={styles.stockPrice}>
                      {formatPrice(stock.price)}
                    </td>
                    <td className={`${styles.stockChange} ${getChangeStyle(stock.change)}`}>
                      {formatPercentage(stock.changePercent)}
                    </td>
                    <td className={styles.marketCap}>-</td>
                    <td className={styles.highLow}>
                      Y: {stock.high > 0 ? stock.high.toFixed(2) : '-'}<br/>
                      D: {stock.low > 0 ? stock.low.toFixed(2) : '-'}
                    </td>
                    <td className={styles.actions}>
                      <button 
                        className={styles.buyButton}
                        onClick={() => handleBuyClick(stock.symbol)}
                      >
                        Al
                      </button>
                      <button 
                        className={styles.sellButton}
                        onClick={() => handleSellClick(stock.symbol)}
                      >
                        Sat
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noResults}>
                    {searchQuery ? 'Arama kriterinize uygun hisse bulunamadı' : 'Hisse verisi bulunamadı'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}