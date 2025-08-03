import { useState } from 'react'
import WritingInterface from './components/WritingInterface'
import CognitiveMonitor from './components/CognitiveMonitor'
import DependencyMeter from './components/DependencyMeter'
import SessionDashboard from './components/SessionDashboard'
import Chat from './components/Chat'
import SocraticModal from './components/SocraticModal'
import { API_ENDPOINTS } from './config'
import './App.css'
// Note: types.ts is now at workspace root for shared access

function App() {
  // App mode state
  const [mode, setMode] = useState('draft') // 'draft' or 'live'
  
  // Session management
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  
  // Existing writing data state
  const [writingData, setWritingData] = useState({
    content: '',
    keystrokeDynamics: [],
    cognitiveScore: 100,
    sessionStartTime: Date.now(),
    interventions: [],
    hasBaseline: false
  })

  // Live mode specific state
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [socraticQuestion, setSocraticQuestion] = useState(null)

  const [currentPhase, setCurrentPhase] = useState('baseline') // baseline, writing, review

  const updateWritingData = (updates) => {
    setWritingData(prev => ({ ...prev, ...updates }))
  }

  // Handle analysis in Live mode
  const handleAnalysis = async (text) => {
    if (mode !== 'live' || !text.trim()) return

    try {
      const response = await fetch(API_ENDPOINTS.analyze, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sessionId
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const analysis = await response.json()
      setCurrentAnalysis(analysis)
      
      // Update cognitive score
      updateWritingData({ cognitiveScore: analysis.score })
      
      // Show Socratic question if provided
      if (analysis.question) {
        setSocraticQuestion(analysis.question)
      }
    } catch (error) {
      console.error('Analysis error:', error)
    }
  }

  const handleSocraticResponse = (response) => {
    console.log('Socratic response:', response)
    // Here you could send the response back to the analysis API
    // or integrate it into the writing process
  }

  const toggleMode = () => {
    setMode(prev => prev === 'draft' ? 'live' : 'draft')
    setSocraticQuestion(null) // Clear any open Socratic questions when switching modes
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="title-section">
            <h1>Thought Leader AI</h1>
            <p>Cognitive Dependency Monitor</p>
          </div>
          
          <div className="mode-toggle">
            <button 
              className={`mode-button ${mode === 'draft' ? 'active' : ''}`}
              onClick={() => mode !== 'draft' && toggleMode()}
            >
              📝 Draft
            </button>
            <button 
              className={`mode-button ${mode === 'live' ? 'active' : ''}`}
              onClick={() => mode !== 'live' && toggleMode()}
            >
              🔍 Live
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {mode === 'draft' ? (
          // Draft Mode - Chat Interface
          <div className="draft-mode">
            <Chat sessionId={sessionId} />
          </div>
        ) : (
          // Live Mode - Original Interface with enhancements
          <>
            <div className="writing-section">
              <WritingInterface 
                writingData={writingData}
                updateWritingData={updateWritingData}
                currentPhase={mode === 'live' ? 'live' : currentPhase}
                setCurrentPhase={setCurrentPhase}
                onTextChange={handleAnalysis}
                sessionId={sessionId}
              />
            </div>
            
            <aside className="monitoring-section">
              <DependencyMeter score={writingData.cognitiveScore} />
              <CognitiveMonitor 
                writingData={writingData}
                updateWritingData={updateWritingData}
                analysis={currentAnalysis}
              />
            </aside>
          </>
        )}
      </main>
      
      {currentPhase === 'review' && mode === 'live' && (
        <SessionDashboard writingData={writingData} />
      )}
      
      {/* Socratic Modal for Live mode */}
      <SocraticModal
        question={socraticQuestion}
        onClose={() => setSocraticQuestion(null)}
        onRespond={handleSocraticResponse}
      />
    </div>
  )
}

export default App
