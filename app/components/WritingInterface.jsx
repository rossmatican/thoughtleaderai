import { useState, useRef, useEffect } from 'react'
import { analyzeKeystrokeDynamics, detectAIPatterns } from '../utils/analysisEngine'

const WritingInterface = ({ writingData, updateWritingData, currentPhase, setCurrentPhase, onTextChange, sessionId }) => {
  const [localContent, setLocalContent] = useState('')
  const [isInitializingVoice, setIsInitializingVoice] = useState(false)
  const textAreaRef = useRef(null)
  const lastKeystrokeTime = useRef(Date.now())
  const keystrokeBuffer = useRef([])

  useEffect(() => {
    // Update parent state when local content changes
    updateWritingData({ content: localContent })
  }, [localContent, updateWritingData])

  const handleKeyDown = (e) => {
    const now = Date.now()
    const timeDelta = now - lastKeystrokeTime.current
    
    const keystrokeData = {
      key: e.key,
      timestamp: now,
      timeDelta,
      isBackspace: e.key === 'Backspace',
      contentLength: localContent.length
    }
    
    keystrokeBuffer.current.push(keystrokeData)
    lastKeystrokeTime.current = now

    // Analyze every 10 keystrokes to avoid performance issues
    if (keystrokeBuffer.current.length % 10 === 0) {
      const dynamics = analyzeKeystrokeDynamics(keystrokeBuffer.current)
      updateWritingData({ keystrokeDynamics: dynamics })
    }
  }

  const handleTextChange = (e) => {
    const newContent = e.target.value
    setLocalContent(newContent)
    
    // Real-time AI pattern detection (local)
    if (newContent.length > 50) { // Only analyze after some content
      const aiScore = detectAIPatterns(newContent)
      const cognitiveScore = Math.max(10, 100 - aiScore)
      updateWritingData({ cognitiveScore })
    }
    
    // Call external analysis if provided (for Live mode)
    if (onTextChange && newContent.length > 100) {
      onTextChange(newContent)
    }
  }

  const initializeVoiceProfile = async (sampleText) => {
    try {
      setIsInitializingVoice(true)
      const response = await fetch('http://localhost:3001/api/voice/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          sampleText
        }),
      })

      const result = await response.json()
      if (result.success) {
        console.log('Voice profile initialized:', result.profile)
        return true
      } else {
        console.error('Voice profile initialization failed:', result.error)
        return false
      }
    } catch (error) {
      console.error('Voice profile initialization error:', error)
      return false
    } finally {
      setIsInitializingVoice(false)
    }
  }

  const completeBaseline = async () => {
    if (localContent.length >= 200) {
      // Initialize voice profile with baseline text
      const voiceInitialized = await initializeVoiceProfile(localContent)
      
      updateWritingData({ 
        hasBaseline: true,
        voiceProfileInitialized: voiceInitialized
      })
      setCurrentPhase('writing')
    }
  }

  const finishSession = () => {
    setCurrentPhase('review')
  }

  const getPlaceholderText = () => {
    switch (currentPhase) {
      case 'baseline':
        return "First, write 200 words about any topic WITHOUT AI assistance. This establishes your natural writing baseline and voice profile..."
      case 'writing':
        return "Now write about your main topic. The system will monitor for AI dependency patterns and voice drift..."
      default:
        return "Continue writing..."
    }
  }

  const getPhaseInstructions = () => {
    switch (currentPhase) {
      case 'baseline':
        return (
          <div className="phase-instructions baseline">
            <h3>📝 Baseline Phase</h3>
            <p>Write 200 words about <strong>any topic</strong> without AI assistance. This helps us understand your natural writing patterns and voice.</p>
            <div className="word-count">
              Words: {localContent.split(/\s+/).filter(word => word.length > 0).length} / 200
            </div>
            {localContent.length >= 200 && (
              <button 
                onClick={completeBaseline} 
                className="phase-button"
                disabled={isInitializingVoice}
              >
                {isInitializingVoice ? 'Initializing Voice Profile...' : 'Complete Baseline →'}
              </button>
            )}
          </div>
        )
      case 'writing':
        return (
          <div className="phase-instructions writing">
            <h3>✍️ Writing Phase</h3>
            <p>Now write about your main topic. The cognitive monitor is active and tracking voice drift.</p>
            <button onClick={finishSession} className="phase-button secondary">
              Finish Session
            </button>
          </div>
        )
      case 'review':
        return (
          <div className="phase-instructions review">
            <h3>📊 Session Complete</h3>
            <p>Review your cognitive independence metrics below.</p>
          </div>
        )
    }
  }

  return (
    <div className="writing-interface">
      {getPhaseInstructions()}
      
      <div className="editor-container">
        <textarea
          ref={textAreaRef}
          value={localContent}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholderText()}
          className={`main-editor ${currentPhase}`}
          disabled={currentPhase === 'review'}
        />
      </div>
      
      <div className="writing-stats">
        <span>Words: {localContent.split(/\s+/).filter(word => word.length > 0).length}</span>
        <span>Characters: {localContent.length}</span>
        <span>Phase: {currentPhase}</span>
        {writingData.voiceProfileInitialized && (
          <span className="voice-status">🎤 Voice Profile: Active</span>
        )}
      </div>
    </div>
  )
}

export default WritingInterface