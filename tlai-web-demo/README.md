# Thought Leader AI – Dependency Monitor

A fast, reliable React prototype that analyzes writing in real-time to detect AI dependency patterns and encourage authentic human expression.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone and setup**
   ```bash
   git clone <your-repo>
   cd tlai-web-demo
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd app && npm install
   
   # Backend
   cd ../server && npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env and add your CLAUDE_API_KEY (optional - works without it)
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend  
   cd app && npm run dev
   ```

5. **Open browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🎯 Features

- **Real-time Analysis**: POST `/analyse` every 30s with text analysis
- **AI Pattern Detection**: Highlights common AI phrases in real-time
- **Dependency Meter**: Color-coded ring (GREEN <40%, YELLOW 40-70%, RED >70%)
- **Socratic Interventions**: Modal triggers when score >70% with 10min cooldown
- **Persistent State**: localStorage saves text and settings
- **Mock Mode**: Works without Claude API key using intelligent scoring

## 📊 API Contract

```typescript
interface AnalyseResponse {
  score: number;                // 0–1 dependency score
  breakdown: {
    ideation: number;          // 0-1 
    structure: number;         // 0-1
    expression: number;        // 0-1
  };
  question?: string;           // Socratic question if score > 0.7
}
```

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Zustand
- **Backend**: Node.js 18 + Express + TypeScript + Zod
- **Deployment**: Vercel
- **State**: localStorage persistence

## 📁 Project Structure

```
tlai-web-demo/
├── app/                     # React frontend
│   ├── src/
│   │   ├── editor/Editor.tsx
│   │   ├── meter/DependencyMeter.tsx  
│   │   ├── modal/SocraticModal.tsx
│   │   ├── hooks/useAnalysis.ts
│   │   └── state/useStore.ts
│   └── package.json
├── server/                  # Express backend
│   ├── src/
│   │   ├── index.ts
│   │   └── routes/analyse.ts
│   └── package.json
└── vercel.json             # Deployment config
```

## 🔧 Configuration

### Constants (in code)
```typescript
const ANALYSE_INTERVAL_MS = 30_000;        // 30 seconds
const INTERVENTION_COOLDOWN_MS = 10 * 60_000; // 10 minutes
```

### Environment Variables
```bash
CLAUDE_API_KEY=              # Optional - Claude API key
NODE_ENV=development         # Environment
PORT=3001                   # Server port
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run deploy
```

### Manual Build
```bash
# Frontend
cd app && npm run build

# Backend  
cd server && npm run build
```

## 🧪 Testing

The project includes a built-in scoring algorithm that detects:
- AI phrase patterns ("Moreover", "However", "It's important to note", etc.)
- Sentence structure complexity
- Expression patterns typical of AI-generated content

Test with different text samples to see the dependency meter and interventions in action.

## 📝 Usage Tips

1. **Start writing** in the editor - analysis begins automatically
2. **Watch the meter** change color as dependency score fluctuates  
3. **Notice highlighted phrases** - AI-typical expressions are marked
4. **Engage with interventions** - Socratic questions appear for high scores
5. **Toggle analysis** on/off using the meter controls

## 🔮 Future Enhancements

- Claude API integration for advanced analysis
- Export/import functionality  
- Writing improvement suggestions
- Analytics dashboard
- Team collaboration features

---

**DONE** – Web prototype ready for demonstration and deployment!