"use client";

import React from 'react';
import { WebSocketStatus } from '../../../../../types/websocket.types';

/**
 * Props for ConnectionStatus component
 */
interface ConnectionStatusProps {
  marketDataStatus: WebSocketStatus;
  orderBookStatus: WebSocketStatus;
  tradeStreamStatus: WebSocketStatus;
  showDetails?: boolean;
}

/**
 * Single connection indicator
 */
const ConnectionIndicator: React.FC<{
  label: string;
  status: WebSocketStatus;
  isCompact?: boolean;
}> = ({ label, status, isCompact = false }) => {
  /**
   * Pure function: Get status color
   */
  const getStatusColor = (): string => {
    switch (status) {
      case WebSocketStatus.CONNECTED:
        return '#4CAF50'; // Green
      case WebSocketStatus.CONNECTING:
      case WebSocketStatus.RECONNECTING:
        return '#FF9800'; // Orange
      case WebSocketStatus.ERROR:
        return '#F44336'; // Red
      case WebSocketStatus.DISCONNECTED:
      default:
        return '#9E9E9E'; // Gray
    }
  };

  /**
   * Pure function: Get status text
   */
  const getStatusText = (): string => {
    switch (status) {
      case WebSocketStatus.CONNECTED:
        return 'Bağlı';
      case WebSocketStatus.CONNECTING:
        return 'Bağlanıyor';
      case WebSocketStatus.RECONNECTING:
        return 'Yeniden bağlanıyor';
      case WebSocketStatus.ERROR:
        return 'Hata';
      case WebSocketStatus.DISCONNECTED:
      default:
        return 'Bağlantı yok';
    }
  };

  const statusColor = getStatusColor();
  const statusText = getStatusText();

  if (isCompact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: statusColor
          }}
        />
        <span style={{ fontSize: '12px', color: '#666' }}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: statusColor,
          boxShadow: status === WebSocketStatus.CONNECTED ? '0 0 8px rgba(76, 175, 80, 0.3)' : 'none'
        }}
      />
      <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
        {label}
      </span>
      <span style={{ fontSize: '12px', color: '#666' }}>
        {statusText}
      </span>
    </div>
  );
};

/**
 * ConnectionStatus Component
 * Single Responsibility: Display WebSocket connection status for all services
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  marketDataStatus,
  orderBookStatus,
  tradeStreamStatus,
  showDetails = false
}) => {
  /**
   * Pure function: Calculate overall connection health
   */
  const getOverallHealth = (): 'healthy' | 'partial' | 'unhealthy' => {
    const connectedCount = [marketDataStatus, orderBookStatus, tradeStreamStatus]
      .filter(status => status === WebSocketStatus.CONNECTED).length;

    if (connectedCount === 3) return 'healthy';
    if (connectedCount > 0) return 'partial';
    return 'unhealthy';
  };

  /**
   * Pure function: Get overall status color
   */
  const getOverallStatusColor = (): string => {
    const health = getOverallHealth();
    switch (health) {
      case 'healthy':
        return '#4CAF50';
      case 'partial':
        return '#FF9800';
      case 'unhealthy':
      default:
        return '#F44336';
    }
  };

  /**
   * Pure function: Get overall status text
   */
  const getOverallStatusText = (): string => {
    const health = getOverallHealth();
    switch (health) {
      case 'healthy':
        return 'Tüm bağlantılar aktif';
      case 'partial':
        return 'Kısmi bağlantı';
      case 'unhealthy':
      default:
        return 'Bağlantı problemi';
    }
  };

  const overallColor = getOverallStatusColor();
  const overallText = getOverallStatusText();

  // Compact view for header
  if (!showDetails) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: overallColor
          }}
        />
        <span style={{ fontSize: '12px', color: '#333', fontWeight: '500' }}>
          {overallText}
        </span>
      </div>
    );
  }

  // Detailed view for settings/debug panel
  return (
    <div style={{
      padding: '12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <h4 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '14px', 
        fontWeight: '600',
        color: '#333'
      }}>
        Bağlantı Durumu
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <ConnectionIndicator
          label="Market Data"
          status={marketDataStatus}
        />
        <ConnectionIndicator
          label="Order Book"
          status={orderBookStatus}
        />
        <ConnectionIndicator
          label="Trade Stream"
          status={tradeStreamStatus}
        />
      </div>

      <div style={{
        marginTop: '12px',
        paddingTop: '8px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: overallColor
          }}
        />
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
          {overallText}
        </span>
      </div>
    </div>
  );
};