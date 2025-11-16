import React from 'react';

const LoadingStats = () => {
  return (
    <div className="dashboard-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="card" style={{ 
          height: '140px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)',
            animation: 'shimmer 1.5s infinite'
          }} />
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--bg-tertiary)',
            marginBottom: '16px'
          }} />
          <div style={{
            width: '60%',
            height: '12px',
            borderRadius: '6px',
            background: 'var(--bg-tertiary)',
            marginBottom: '12px'
          }} />
          <div style={{
            width: '80%',
            height: '24px',
            borderRadius: '6px',
            background: 'var(--bg-tertiary)'
          }} />
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          to {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingStats;