import React from 'react';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const SpikeAlert = ({ spikeData }) => {
  if (!spikeData) return null;

  const { isSpike, currentCount, averageCount, percentageIncrease } = spikeData;

  return (
    <div className="card" style={{ 
      background: isSpike ? 'rgba(239, 68, 68, 0.1)' : 'var(--success-bg)',
      borderColor: isSpike ? 'var(--danger)' : 'var(--success)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isSpike ? 'var(--danger)' : 'var(--success)',
          color: 'white',
          flexShrink: 0
        }}>
          {isSpike ? <AlertTriangle size={24} /> : <Activity size={24} />}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: isSpike ? 'var(--danger)' : 'var(--success)',
            marginBottom: '8px' 
          }}>
            {isSpike ? '⚠️ Conversation Spike Detected!' : '✓ Normal Activity'}
          </h3>
          
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)', 
            marginBottom: '16px',
            lineHeight: '1.6'
          }}>
            {isSpike 
              ? `There's a significant increase in brand mentions compared to the average.`
              : `Brand mention activity is within normal range.`
            }
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px' 
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Current (24h)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {currentCount}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Average
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {averageCount}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Change
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: percentageIncrease > 0 ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingUp size={20} />
                {percentageIncrease > 0 ? '+' : ''}{percentageIncrease}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpikeAlert;