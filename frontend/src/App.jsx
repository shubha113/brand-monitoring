import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import Dashboard from './pages/Dashboard';
import Mentions from './pages/Mention';
import { 
  getDashboardStats, 
  getSentimentTrend,
  getSpikeAlerts, 
  getKeywords, 
  getRecentActivity 
} from './redux/slices/dashboardSlice';
import { getMentions, fetchMentions, clearSuccess } from './redux/slices/mentionSlice';
import './styles/global.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const dispatch = useDispatch();
  const { timeRange } = useSelector(state => state.dashboard);
  const { success, message, error, brandName } = useSelector(state => state.mentions);

  useEffect(() => {
    // Initial data load if brand name exists
    if (brandName) {
      handleRefresh();
    }
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
    }
  }, [success, dispatch]);

  const handleRefresh = async () => {
    if (activePage === 'dashboard') {
      dispatch(getDashboardStats(timeRange));
      dispatch(getSentimentTrend(timeRange));
      dispatch(getSpikeAlerts());
      dispatch(getKeywords({ timeRange, limit: 20 }));
      dispatch(getRecentActivity(10));
    } else {
      dispatch(getMentions({ page: 1, limit: 10 }));
    }
    
    if (brandName) {
      dispatch(fetchMentions(brandName));
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard';
      case 'mentions':
        return 'All Mentions';
      default:
        return 'Brand Monitor';
    }
  };

  const getPageSubtitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Real-time brand monitoring insights';
      case 'mentions':
        return 'Browse and filter all brand mentions';
      default:
        return '';
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      
      <div className="main-content">
        <Header 
          title={getPageTitle()} 
          subtitle={getPageSubtitle()}
          onRefresh={handleRefresh}
        />

        {/* Success/Error Messages */}
        {success && message && (
          <div style={{ padding: '20px 32px 0' }}>
            <div className="alert alert-success">
              ✓ {message}
            </div>
          </div>
        )}
        
        {error && (
          <div style={{ padding: '20px 32px 0' }}>
            <div className="alert alert-error">
              ✗ {error}
            </div>
          </div>
        )}

        {/* Main Content */}
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'mentions' && <Mentions />}
      </div>
    </div>
  );
}

export default App;