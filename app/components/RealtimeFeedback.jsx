import React from 'react';

const RealtimeFeedback = ({ feedback, isLoading, error, cognitiveScore, aiPatterns, suggestions }) => {
  if (!feedback && !isLoading && !error) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981'; // green
    if (score >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="realtime-feedback-container">
      {/* Cognitive Score Badge */}
      {cognitiveScore !== null && (
        <div className="cognitive-score-badge" style={{ 
          backgroundColor: getScoreColor(cognitiveScore),
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '12px',
          display: 'inline-block'
        }}>
          Originality Score: {cognitiveScore}%
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="feedback-loading">
          <div className="loading-spinner"></div>
          <span>Claude is analyzing your writing...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="feedback-error" style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
          {error}
        </div>
      )}

      {/* Feedback Content */}
      {feedback && !isLoading && (
        <div className="feedback-content" style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '12px',
          borderLeft: `4px solid ${getScoreColor(cognitiveScore)}`
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
            Real-time Feedback
          </h4>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
            {feedback}
          </p>
        </div>
      )}

      {/* AI Patterns Detected */}
      {aiPatterns && aiPatterns.length > 0 && (
        <div className="ai-patterns" style={{
          backgroundColor: '#fef3c7',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#92400e' }}>
            AI Patterns Detected:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
            {aiPatterns.map((pattern, index) => (
              <li key={index}>{pattern}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="suggestions" style={{
          backgroundColor: '#dbeafe',
          padding: '12px',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>
            Suggestions to Improve:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RealtimeFeedback;