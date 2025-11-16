import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, MessageSquare, TrendingUp, Search } from 'lucide-react';
import { setBrandName } from '../../redux/slices/mentionSlice';
import { setTimeRange } from '../../redux/slices/dashboardSlice';
import { fetchMentions } from '../../redux/slices/mentionSlice';
import '../../styles/Sidebar.css';

const Sidebar = ({ activePage, onNavigate }) => {
  const dispatch = useDispatch();
  const { brandName } = useSelector(state => state.mentions);
  const { timeRange } = useSelector(state => state.dashboard);
  const [inputBrand, setInputBrand] = useState(brandName);

  const handleBrandSubmit = (e) => {
    e.preventDefault();
    if (inputBrand.trim()) {
      dispatch(setBrandName(inputBrand));
      dispatch(fetchMentions(inputBrand));
    }
  };

  const handleTimeRangeChange = (range) => {
    dispatch(setTimeRange(range));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mentions', label: 'All Mentions', icon: MessageSquare },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">BM</div>
          <span className="logo-text">BrandMonitor</span>
        </div>

        <div className="brand-selector">
          <h3>Track Brand</h3>
          <form onSubmit={handleBrandSubmit} className="brand-input-group">
            <input
              type="text"
              className="input"
              placeholder="Enter brand name..."
              value={inputBrand}
              onChange={(e) => setInputBrand(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Main Menu</div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="time-range-selector">
          <label>Time Range</label>
          <div className="time-range-buttons">
            {[
              { value: 1, label: '24h' },
              { value: 7, label: '7d' },
              { value: 30, label: '30d' },
              { value: 90, label: '90d' }
            ].map(range => (
              <button
                key={range.value}
                className={`time-btn ${timeRange === range.value ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;