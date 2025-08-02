import { useMemo } from 'react'

const SessionDashboard = ({ writingData }) => {
  const sessionMetrics = useMemo(() => {
    const sessionDuration = Date.now() - writingData.sessionStartTime
    const words = writingData.content.split(/\s+/).filter(word => word.length > 0)
    const sentences = writingData.content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    return {
      duration: Math.round(sessionDuration / 1000 / 60), // minutes
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
      interventionCount: writingData.interventions?.length || 0,
      finalScore: writingData.cognitiveScore,
      keystrokeCount: writingData.keystrokeDynamics?.recentActivity || 0
    }
  }, [writingData])

  const getScoreInterpretation = (score) => {
    if (score >= 80) return {
      label: "Excellent Independence",
      message: "Strong original thinking with minimal AI patterns detected.",
      color: "#22c55e"
    }
    if (score >= 60) return {
      label: "Good Independence", 
      message: "Mostly original content with some AI influence.",
      color: "#84cc16"
    }
    if (score >= 40) return {
      label: "Mixed Patterns",
      message: "Combination of original and AI-influenced content.",
      color: "#f59e0b"
    }
    return {
      label: "High AI Dependency",
      message: "Significant AI patterns detected. Consider more personal insights.",
      color: "#ef4444"
    }
  }

  const getImprovementTips = () => {
    const tips = []
    
    if (sessionMetrics.finalScore < 50) {
      tips.push("Try starting with personal experiences before researching")
      tips.push("Use specific examples rather than general statements")
      tips.push("Avoid hedge words like 'it's important to note'")
    } else if (sessionMetrics.finalScore < 70) {
      tips.push("Great progress! Add more personal perspective")
      tips.push("Consider varying your sentence structure")
    } else {
      tips.push("Excellent cognitive independence!")
      tips.push("You maintained your authentic voice well")
    }
    
    if (sessionMetrics.interventionCount > 3) {
      tips.push("Consider slowing down to reflect more between ideas")
    }
    
    return tips
  }

  const interpretation = getScoreInterpretation(sessionMetrics.finalScore)

  return (
    <div className="session-dashboard">
      <div className="dashboard-header">
        <h2>Session Report</h2>
        <div className="session-summary">
          <div className="final-score" style={{ color: interpretation.color }}>
            <span className="score-large">{sessionMetrics.finalScore}</span>
            <span className="score-label">{interpretation.label}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h3>📊 Writing Metrics</h3>
            </div>
            <div className="metric-stats">
              <div className="stat-row">
                <span>Session Duration</span>
                <span>{sessionMetrics.duration} minutes</span>
              </div>
              <div className="stat-row">
                <span>Words Written</span>
                <span>{sessionMetrics.wordCount}</span>
              </div>
              <div className="stat-row">
                <span>Sentences</span>
                <span>{sessionMetrics.sentenceCount}</span>
              </div>
              <div className="stat-row">
                <span>Avg Words/Sentence</span>
                <span>{sessionMetrics.avgWordsPerSentence}</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>🧠 Cognitive Analysis</h3>
            </div>
            <div className="cognitive-summary">
              <div className="interpretation">
                <p><strong>{interpretation.label}</strong></p>
                <p>{interpretation.message}</p>
              </div>
              <div className="intervention-summary">
                <div className="stat-row">
                  <span>Interventions Triggered</span>
                  <span>{sessionMetrics.interventionCount}</span>
                </div>
                {sessionMetrics.interventionCount > 0 && (
                  <div className="intervention-note">
                    System detected {sessionMetrics.interventionCount} instances of cognitive dependency
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>💡 Improvement Tips</h3>
            </div>
            <div className="tips-list">
              {getImprovementTips().map((tip, index) => (
                <div key={index} className="tip-item">
                  • {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>🎯 Next Steps</h3>
            </div>
            <div className="next-steps">
              <div className="step">
                <strong>Practice Exercise:</strong> Write 300 words about a personal experience without any research or AI assistance.
              </div>
              <div className="step">
                <strong>Cognitive Goal:</strong> Aim for a score above {Math.min(100, sessionMetrics.finalScore + 10)} in your next session.
              </div>
              <div className="step">
                <strong>Focus Area:</strong> {
                  sessionMetrics.finalScore < 50 
                    ? "Add more personal examples and reduce generic phrases"
                    : sessionMetrics.finalScore < 70
                    ? "Strengthen your unique perspective and voice"
                    : "Maintain this excellent level of cognitive independence"
                }
              </div>
            </div>
          </div>
        </div>

        {writingData.interventions && writingData.interventions.length > 0 && (
          <div className="intervention-details">
            <h3>🔍 Intervention History</h3>
            <div className="intervention-timeline">
              {writingData.interventions.map((intervention, index) => (
                <div key={intervention.id} className="intervention-item">
                  <div className="intervention-timestamp">
                    #{index + 1} - Score: {intervention.triggerScore}
                  </div>
                  <div className="intervention-prompt">
                    "{intervention.prompt}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="session-actions">
          <button 
            onClick={() => window.location.reload()} 
            className="action-button primary"
          >
            Start New Session
          </button>
          <button 
            onClick={() => {
              const data = {
                score: sessionMetrics.finalScore,
                metrics: sessionMetrics,
                timestamp: new Date().toISOString()
              }
              navigator.clipboard.writeText(JSON.stringify(data, null, 2))
              alert('Session data copied to clipboard!')
            }}
            className="action-button secondary"
          >
            Export Results
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionDashboard