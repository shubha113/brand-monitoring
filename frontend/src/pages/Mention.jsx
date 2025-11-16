import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter } from "lucide-react";
import { getMentions } from "../redux/slices/mentionSlice";
import MentionsList from "../components/dashboard/MentionsList";
import "../styles/Dashboard.css";
import ExportButton from "../components/dashboard/ExportButton";

const Mentions = () => {
  const dispatch = useDispatch();
  const { mentions, pagination, loading } = useSelector(
    (state) => state.mentions
  );
  const [filters, setFilters] = useState({
    source: "",
    sentiment: "",
    topic: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    dispatch(getMentions(filters));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <Filter />
            Filters
          </div>
          <ExportButton mentions={mentions} />
        </div>

        <div className="card" style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Source</label>
              <select
                className="select"
                value={filters.source}
                onChange={(e) => handleFilterChange("source", e.target.value)}
              >
                <option value="">All Sources</option>
                <option value="twitter">Twitter</option>
                <option value="reddit">Reddit</option>
                <option value="news">News</option>
                <option value="blog">Blog</option>
                <option value="forum">Forum</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Sentiment</label>
              <select
                className="select"
                value={filters.sentiment}
                onChange={(e) =>
                  handleFilterChange("sentiment", e.target.value)
                }
              >
                <option value="">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Topic</label>
              <select
                className="select"
                value={filters.topic}
                onChange={(e) => handleFilterChange("topic", e.target.value)}
              >
                <option value="">All Topics</option>
                <option value="product">Product</option>
                <option value="customer_service">Customer Service</option>
                <option value="pricing">Pricing</option>
                <option value="quality">Quality</option>
                <option value="delivery">Delivery</option>
                <option value="general">General</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Per Page</label>
              <select
                className="select"
                value={filters.limit}
                onChange={(e) => handleFilterChange("limit", e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && !mentions.length ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <MentionsList
          mentions={mentions}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Mentions;
