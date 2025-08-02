import { useState } from 'react'
import WritingInterface from './components/WritingInterface'
import CognitiveMonitor from './components/CognitiveMonitor'
import DependencyMeter from './components/DependencyMeter'
import SessionDashboard from './components/SessionDashboard'
import './App.css'

function App() {
  const [writingData, setWritingData] = useState({
    content: '',
    keystrokeDynamics: [],
    cognitiveScore: 100,
    sessionStartTime: Date.now(),
    interventions: [],
    hasBaseline: false
  })

  const [currentPhase, setCurrentPhase] = useState('baseline') // baseline, writing, review

  const updateWritingData = (updates) => {
    setWritingData(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Thought Leader AI</h1>
        <p>Cognitive Dependency Monitor</p>
      </header>
      
      <main className="app-main">
        <div className="writing-section">
          <WritingInterface 
            writingData={writingData}
            updateWritingData={updateWritingData}
            currentPhase={currentPhase}
            setCurrentPhase={setCurrentPhase}
          />
        </div>
        
        <aside className="monitoring-section">
          <DependencyMeter score={writingData.cognitiveScore} />
          <CognitiveMonitor 
            writingData={writingData}
            updateWritingData={updateWritingData}
          />
        </aside>
      </main>
      
      {currentPhase === 'review' && (
        <SessionDashboard writingData={writingData} />
      )}
    </div>
  )
}

export default App
