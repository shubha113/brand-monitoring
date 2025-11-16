import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageSquare,
  TrendingUp,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";
import StatsCard from "../components/Dashboard/StatsCard";
import SentimentChart from "../components/Dashboard/SentimentChart";
import SpikeAlert from "../components/Dashboard/SpikeAlert";
import KeywordsCloud from "../components/Dashboard/KeywordsCloud";
import RecentActivity from "../components/Dashboard/RecentActivity";
import {
  getDashboardStats,
  getSentimentTrend,
  getSpikeAlerts,
  getKeywords,
  getRecentActivity,
} from "../redux/slices/dashboardSlice";
import "../styles/Dashboard.css";
import LoadingStats from "../components/dashboard/LoadingStats";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    stats,
    sentimentTrend,
    spikeAlerts,
    keywords,
    recentActivity,
    loading,
    timeRange,
  } = useSelector((state) => state.dashboard);
  const { brandName } = useSelector((state) => state.mentions);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (brandName) {
      loadDashboardData();
    }
  }, [timeRange]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    let countdownInterval;

    if (autoRefresh && brandName) {
      // Refresh data every 30 seconds
      interval = setInterval(() => {
        loadDashboardData();
        setCountdown(30);
      }, 30000);

      // Countdown timer
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) return 30;
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [autoRefresh, brandName, timeRange]);

  const loadDashboardData = () => {
    dispatch(getDashboardStats(timeRange));
    dispatch(getSentimentTrend(timeRange));
    dispatch(getSpikeAlerts());
    dispatch(getKeywords({ timeRange, limit: 20 }));
    dispatch(getRecentActivity(10));
  };

  if (!brandName) {
    return (
      <div className="dashboard">
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <MessageSquare
            size={64}
            style={{
              color: "var(--text-muted)",
              margin: "0 auto 24px",
              opacity: 0.5,
            }}
          />
          <h2
            style={{
              fontSize: "24px",
              marginBottom: "12px",
              color: "var(--text-primary)",
            }}
          >
            No Brand Selected
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
            Please enter a brand name in the sidebar to start monitoring
          </p>
        </div>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="dashboard">
        <LoadingStats />
      </div>
    );
  }

  const sentimentBreakdown = stats?.sentimentBreakdown || {};
  const totalMentions = stats?.totalMentions || 0;

  return (
    <div className="dashboard">
      {/* Auto-refresh toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "24px",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 20px",
            background: autoRefresh ? "var(--success-bg)" : "var(--bg-card)",
            borderRadius: "12px",
            border: `2px solid ${
              autoRefresh ? "var(--success)" : "var(--border)"
            }`,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          <Zap
            size={18}
            style={{
              color: autoRefresh ? "var(--success)" : "var(--text-muted)",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: autoRefresh ? "var(--success)" : "var(--text-muted)",
            }}
          >
            {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
          </span>
          {autoRefresh && (
            <span
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                background: "var(--success)",
                color: "white",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              {countdown}s
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <StatsCard
          icon={MessageSquare}
          label="Total Mentions"
          value={totalMentions}
          subtitle={`In the last ${timeRange} days`}
          iconType="primary"
        />
        <StatsCard
          icon={TrendingUp}
          label="Positive"
          value={sentimentBreakdown.positive || 0}
          subtitle={`${
            totalMentions > 0
              ? Math.round((sentimentBreakdown.positive / totalMentions) * 100)
              : 0
          }% of total`}
          iconType="success"
        />
        <StatsCard
          icon={Activity}
          label="Negative"
          value={sentimentBreakdown.negative || 0}
          subtitle={`${
            totalMentions > 0
              ? Math.round((sentimentBreakdown.negative / totalMentions) * 100)
              : 0
          }% of total`}
          iconType="danger"
        />
        <StatsCard
          icon={BarChart3}
          label="Neutral"
          value={sentimentBreakdown.neutral || 0}
          subtitle={`${
            totalMentions > 0
              ? Math.round((sentimentBreakdown.neutral / totalMentions) * 100)
              : 0
          }% of total`}
          iconType="info"
        />
      </div>

      {/* Spike Alert */}
      {spikeAlerts && (
        <div className="dashboard-section">
          <SpikeAlert spikeData={spikeAlerts} />
        </div>
      )}

      {/* Sentiment Trend Chart */}
      <div className="dashboard-section">
        <div className="dashboard-chart-section">
          <div className="chart-header">
            <h3>Sentiment Trend</h3>
            <p>Track how sentiment changes over time</p>
          </div>
          {sentimentTrend && sentimentTrend.length > 0 ? (
            <SentimentChart data={sentimentTrend} />
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "var(--text-muted)",
              }}
            >
              No trend data available
            </div>
          )}
        </div>
      </div>

      {/* Keywords and Recent Activity */}
      <div className="dashboard-two-col">
        <KeywordsCloud keywords={keywords} />
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;
