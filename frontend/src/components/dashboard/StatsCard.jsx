import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import '../../styles/StatsCard.css';

const StatsCard = ({ icon: Icon, label, value, subtitle, trend, trendValue, iconType = 'primary' }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className={`stats-icon ${iconType}`}>
          <Icon />
        </div>
        {trend && (
          <div className={`stats-trend ${trend}`}>
            {trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="stats-body">
        <div className="stats-label">{label}</div>
        <div className="stats-value">{value}</div>
        {subtitle && <div className="stats-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatsCard;