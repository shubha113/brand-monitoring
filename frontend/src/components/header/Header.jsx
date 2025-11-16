import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RefreshCw, Menu } from 'lucide-react';
import '../../styles/Header.css';

const Header = ({ onRefresh, title, subtitle }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { brandName } = useSelector(state => state.mentions);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-toggle">
            <Menu size={24} />
          </button>
          <div className="header-title">
            <h1>{title}</h1>
            {subtitle && <div className="header-subtitle">{subtitle}</div>}
            {brandName && (
              <div className="header-subtitle">
                Monitoring: <strong>{brandName}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          <button 
            className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>

          <div className="live-indicator">
            <div className="live-dot"></div>
            <span className="live-text">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;