import { useState, useEffect } from 'react'
import { generateSocraticPrompt } from '../utils/analysisEngine'

const CognitiveMonitor = ({ writingData, updateWritingData }) => {
  const [currentPrompt, setCurrentPrompt] = useState(null)
  const [promptHistory, setPromptHistory] = useState([])
  const [lastInterventionScore, setLastInterventionScore] = useState(100)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Trigger intervention when cognitive score drops significantly
    const scoreDropThreshold = 15
    const timeSinceLastIntervention = Date.now() - (promptHistory[promptHistory.length - 1]?.timestamp || 0)
    const minTimeBetweenPrompts = 30000 // 30 seconds

    if (
      writingData.cognitiveScore < 50 && // Score is concerning
      writingData.cognitiveScore < lastInterventionScore - scoreDropThreshold && // Significant drop
      timeSinceLastIntervention > minTimeBetweenPrompts && // Not too frequent
      writingData.content.length > 100 // Enough content to analyze
    ) {
      triggerIntervention()
    }
  }, [writingData.cognitiveScore, writingData.content, lastInterventionScore, promptHistory])

  const triggerIntervention = () => {
    const prompt = generateSocraticPrompt(writingData.content, writingData.cognitiveScore)
    const intervention = {
      id: Date.now(),
      timestamp: Date.now(),
      prompt,
      triggerScore: writingData.cognitiveScore,
      contentLength: writingData.content.length,
      dismissed: false
    }

    setCurrentPrompt(intervention)
    setShowPrompt(true)
    setLastInterventionScore(writingData.cognitiveScore)
    
    // Add to intervention history
    const newInterventions = [...(writingData.interventions || []), intervention]
    updateWritingData({ interventions: newInterventions })
    
    setPromptHistory(prev => [...prev, intervention])
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    setCurrentPrompt(null)
  }

  const getInterventionIntensity = (score) => {
    if (score < 30) return 'critical'
    if (score < 50) return 'warning'
    if (score < 70) return 'caution'
    return 'good'
  }

  const getKeystrokeDynamicsInsight = () => {
    const dynamics = writingData.keystrokeDynamics
    if (!dynamics || !dynamics.avgPauseTime) return null

    const insights = []
    
    if (dynamics.avgPauseTime < 100) {
      insights.push("⚡ Very fast typing - consider slowing down to think")
    } else if (dynamics.avgPauseTime > 500) {
      insights.push("🤔 Thoughtful pauses detected - good sign!")
    }

    if (dynamics.backspaceRatio > 0.15) {
      insights.push("✏️ High revision rate - shows careful editing")
    } else if (dynamics.backspaceRatio < 0.05) {
      insights.push("📝 Low revision rate - might indicate copy-paste")
    }

    if (dynamics.burstiness > 2) {
      insights.push("🌊 Irregular typing pattern - natural variation")
    }

    return insights.length > 0 ? insights[0] : null
  }

  return (
    <div className="cognitive-monitor">
      <div className="monitor-header">
        <h3>Cognitive Analysis</h3>
        <div className={`status-indicator ${getInterventionIntensity(writingData.cognitiveScore)}`}>
          {getInterventionIntensity(writingData.cognitiveScore).toUpperCase()}
        </div>
      </div>

      {/* Keystroke Insights */}
      <div className="keystroke-insights">
        <h4>Typing Patterns</h4>
        {getKeystrokeDynamicsInsight() ? (
          <div className="insight-item">
            {getKeystrokeDynamicsInsight()}
          </div>
        ) : (
          <div className="insight-placeholder">
            Continue typing for analysis...
          </div>
        )}
        
        {writingData.keystrokeDynamics?.avgPauseTime && (
          <div className="dynamics-stats">
            <div className="stat">
              <span className="stat-label">Avg Pause</span>
              <span className="stat-value">{writingData.keystrokeDynamics.avgPauseTime}ms</span>
            </div>
            <div className="stat">
              <span className="stat-label">Revisions</span>
              <span className="stat-value">{Math.round(writingData.keystrokeDynamics.backspaceRatio * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Pattern Alerts */}
      <div className="pattern-alerts">
        <h4>Pattern Detection</h4>
        {writingData.cognitiveScore < 70 && writingData.content.length > 50 ? (
          <div className="alert-list">
            {writingData.cognitiveScore < 30 && (
              <div className="alert critical">
                🚨 High AI dependency detected
              </div>
            )}
            {writingData.cognitiveScore < 50 && writingData.cognitiveScore >= 30 && (
              <div className="alert warning">
                ⚠️ AI patterns emerging
              </div>
            )}
            {writingData.cognitiveScore < 70 && writingData.cognitiveScore >= 50 && (
              <div className="alert caution">
                💡 Mixed cognitive patterns
              </div>
            )}
          </div>
        ) : writingData.content.length > 50 ? (
          <div className="alert good">
            ✅ Original thinking detected
          </div>
        ) : (
          <div className="alert-placeholder">
            Write more for pattern analysis...
          </div>
        )}
      </div>

      {/* Intervention History */}
      {promptHistory.length > 0 && (
        <div className="intervention-history">
          <h4>Interventions ({promptHistory.length})</h4>
          <div className="history-summary">
            Last intervention: {Math.round((Date.now() - promptHistory[promptHistory.length - 1].timestamp) / 1000)}s ago
          </div>
        </div>
      )}

      {/* Active Socratic Prompt */}
      {showPrompt && currentPrompt && (
        <div className="socratic-prompt-overlay">
          <div className="socratic-prompt">
            <div className="prompt-header">
              <h4>💭 Cognitive Intervention</h4>
              <button onClick={dismissPrompt} className="dismiss-btn">×</button>
            </div>
            <div className="prompt-content">
              <p>{currentPrompt.prompt}</p>
            </div>
            <div className="prompt-footer">
              <small>Triggered by cognitive score: {currentPrompt.triggerScore}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CognitiveMonitor