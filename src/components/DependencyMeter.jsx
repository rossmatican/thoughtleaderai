import { useEffect, useState } from 'react'

const DependencyMeter = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(score)
  const [trend, setTrend] = useState('stable')

  useEffect(() => {
    // Animate score changes
    const timer = setTimeout(() => {
      if (score > animatedScore) setTrend('improving')
      else if (score < animatedScore) setTrend('declining')
      else setTrend('stable')
      
      setAnimatedScore(score)
    }, 100)

    return () => clearTimeout(timer)
  }, [score, animatedScore])

  const getScoreColor = () => {
    if (animatedScore >= 70) return '#22c55e' // Green
    if (animatedScore >= 40) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  const getScoreLabel = () => {
    if (animatedScore >= 70) return 'Independent'
    if (animatedScore >= 40) return 'Mixed'
    return 'AI-Dependent'
  }

  const getScoreDescription = () => {
    if (animatedScore >= 70) return 'Original thinking detected'
    if (animatedScore >= 40) return 'Some AI patterns emerging'
    return 'High dependency detected'
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return '📈'
      case 'declining': return '📉'
      default: return '📊'
    }
  }

  return (
    <div className="dependency-meter">
      <div className="meter-header">
        <h3>Cognitive Independence</h3>
        <span className="trend-indicator">{getTrendIcon()}</span>
      </div>
      
      <div className="meter-display">
        <div className="score-circle">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - animatedScore / 100)}`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="score-text">
            <div className="score-number">{Math.round(animatedScore)}</div>
            <div className="score-label">{getScoreLabel()}</div>
          </div>
        </div>
      </div>
      
      <div className="meter-description">
        <p>{getScoreDescription()}</p>
      </div>
      
      <div className="score-ranges">
        <div className="range-indicator">
          <div className="range-bar">
            <div className="range-section green" style={{ width: '30%' }}>
              <span>70-100</span>
              <label>Independent</label>
            </div>
            <div className="range-section yellow" style={{ width: '30%' }}>
              <span>40-69</span>
              <label>Mixed</label>
            </div>
            <div className="range-section red" style={{ width: '40%' }}>
              <span>0-39</span>
              <label>Dependent</label>
            </div>
          </div>
          <div className="current-position" style={{ left: `${animatedScore}%` }}>
            ▲
          </div>
        </div>
      </div>
    </div>
  )
}

export default DependencyMeter