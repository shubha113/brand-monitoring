import React from 'react';
import { Hash } from 'lucide-react';

const KeywordsCloud = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <Hash size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
        <p style={{ color: 'var(--text-muted)' }}>No keywords data available</p>
      </div>
    );
  }

  const maxCount = Math.max(...keywords.map(k => k.count));

  const getFontSize = (count) => {
    const ratio = count / maxCount;
    return 12 + (ratio * 20); // Font size between 12px and 32px
  };

  const getColor = (index) => {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', 
      '#10b981', '#3b82f6', '#ef4444', '#06b6d4'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="card">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border)'
      }}>
        <Hash size={20} style={{ color: 'var(--primary)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
          Top Keywords
        </h3>
      </div>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '16px', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {keywords.map((keyword, index) => (
          <div
            key={keyword.keyword}
            style={{
              fontSize: `${getFontSize(keyword.count)}px`,
              fontWeight: '700',
              color: getColor(index),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '8px 12px',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.background = `${getColor(index)}15`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'transparent';
            }}
            title={`${keyword.count} mentions`}
          >
            {keyword.keyword}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordsCloud;