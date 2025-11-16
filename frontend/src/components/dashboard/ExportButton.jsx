import React from 'react';
import { Download } from 'lucide-react';

const ExportButton = ({ mentions, stats }) => {
  const exportToCSV = () => {
    if (!mentions || mentions.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare CSV data
    const headers = ['Date', 'Source', 'Author', 'Content', 'Sentiment', 'Topic', 'Keywords', 'Likes', 'Shares', 'Comments', 'URL'];
    
    const rows = mentions.map(mention => [
      new Date(mention.publishedAt).toLocaleString(),
      mention.source,
      mention.author,
      `"${mention.content.replace(/"/g, '""')}"`, // Escape quotes
      mention.sentiment,
      mention.topic,
      mention.keywords?.join('; ') || '',
      mention.engagement?.likes || 0,
      mention.engagement?.shares || 0,
      mention.engagement?.comments || 0,
      mention.url
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `brand-mentions-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      className="btn btn-secondary"
      onClick={exportToCSV}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <Download size={16} />
      Export CSV
    </button>
  );
};

export default ExportButton;