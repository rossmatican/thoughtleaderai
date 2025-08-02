import { useState } from 'react';

const SocraticModal = ({ question, onClose, onRespond }) => {
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    if (response.trim()) {
      onRespond(response);
      setResponse('');
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!question) return null;

  return (
    <div className="socratic-modal-overlay">
      <div className="socratic-modal">
        <div className="modal-header">
          <h3>🤔 Reflection Prompt</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="modal-content">
          <div className="question">
            <p>{question}</p>
          </div>
          
          <div className="response-area">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Take a moment to reflect... (Ctrl+Enter to submit)"
              rows={4}
              autoFocus
            />
          </div>
          
          <div className="modal-actions">
            <button onClick={onClose} className="skip-button">
              Skip for now
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={!response.trim()}
              className="respond-button"
            >
              Reflect & Continue
            </button>
          </div>
        </div>
        
        <div className="modal-hint">
          <small>💡 These prompts help identify cognitive dependencies and strengthen your thinking</small>
        </div>
      </div>
    </div>
  );
};

export default SocraticModal;