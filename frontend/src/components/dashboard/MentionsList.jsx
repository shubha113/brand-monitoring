import React from 'react';
import { useDispatch } from 'react-redux';
import { ThumbsUp, Share2, MessageCircle, ExternalLink, Trash2 } from 'lucide-react';
import { deleteMention } from '../../redux/slices/mentionSlice';
import '../../styles/MentionsList.css';

const MentionsList = ({ mentions, pagination, onPageChange }) => {
  const dispatch = useDispatch();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceInitial = (source) => {
    return source.charAt(0).toUpperCase();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this mention?')) {
      dispatch(deleteMention(id));
    }
  };

  if (!mentions || mentions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>No mentions found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mentions-list">
        {mentions.map((mention) => (
          <div key={mention._id} className="mention-card">
            <div className="mention-header">
              <div className="mention-source">
                <div className={`source-icon ${mention.source}`}>
                  {getSourceInitial(mention.source)}
                </div>
                <div className="source-info">
                  <h4>{mention.author}</h4>
                  <p>{formatDate(mention.publishedAt)}</p>
                </div>
              </div>
              <div>
                <span className={`badge badge-${mention.sentiment}`}>
                  {mention.sentiment}
                </span>
              </div>
            </div>

            <div className="mention-content">
              {mention.content}
            </div>

            {mention.keywords && mention.keywords.length > 0 && (
              <div className="keywords-row">
                {mention.keywords.map((keyword, idx) => (
                  <span key={idx} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            <div className="mention-footer">
              <div className="mention-meta">
                <div className="meta-item">
                  <ThumbsUp />
                  <span>{mention.engagement?.likes || 0}</span>
                </div>
                <div className="meta-item">
                  <Share2 />
                  <span>{mention.engagement?.shares || 0}</span>
                </div>
                <div className="meta-item">
                  <MessageCircle />
                  <span>{mention.engagement?.comments || 0}</span>
                </div>
                <span className="topic-tag">{mention.topic}</span>
              </div>

              <div className="mention-actions">
                <button 
                  className="action-btn"
                  onClick={() => window.open(mention.url, '_blank')}
                >
                  <ExternalLink size={14} />
                  View
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDelete(mention._id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MentionsList;