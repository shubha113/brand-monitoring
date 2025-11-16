import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';

const RecentActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
        <p style={{ color: 'var(--text-muted)' }}>No recent activity</p>
      </div>
    );
  }

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diff = Math.floor((now - activityDate) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'var(--success)';
      case 'negative': return 'var(--danger)';
      default: return 'var(--info)';
    }
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
        <Clock size={20} style={{ color: 'var(--primary)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
          Recent Activity
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activities.map((activity, index) => (
          <div
            key={activity._id || index}
            style={{
              padding: '16px',
              background: 'var(--bg-primary)',
              borderRadius: '10px',
              borderLeft: `3px solid ${getSentimentColor(activity.sentiment)}`,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.background = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.background = 'var(--bg-primary)';
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <span style={{ 
                fontSize: '12px', 
                color: 'var(--text-muted)',
                textTransform: 'capitalize'
              }}>
                {activity.source} • {activity.author}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {formatTime(activity.publishedAt)}
              </span>
            </div>
            
            <p style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {activity.content}
            </p>

            <div style={{ marginTop: '8px' }}>
              <span 
                className={`badge badge-${activity.sentiment}`}
                style={{ fontSize: '10px' }}
              >
                {activity.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;