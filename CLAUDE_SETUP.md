# Claude API Setup Guide for Thought Leader AI

This guide will help you set up the Claude Sonnet 4 integration for your Thought Leader AI application.

## Prerequisites

- Node.js 16+ installed
- An Anthropic API key (get one at https://console.anthropic.com/)

## Setup Instructions

### 1. Configure Environment Variables

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and add your Claude API key:
   ```env
   CLAUDE_API_KEY=your_actual_api_key_here
   ```

### 2. Install Dependencies

The Claude SDK has already been added to the project. If you need to reinstall:

```bash
cd server
npm install
```

### 3. Start the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd app
   npm run dev
   ```

Or run both together from the root directory:
```bash
npm run dev:full
```

## Features Overview

### 1. Draft Mode - Paper Assistance
- Click on "Draft" mode in the UI
- Chat with Claude about your paper
- Get help with structure, arguments, and ideas
- All conversations are saved with your session

### 2. Live Mode - Real-time Feedback
- Switch to "Live" mode for real-time analysis
- Claude watches as you type and provides:
  - Writing quality feedback
  - AI pattern detection
  - Originality scoring
  - Suggestions for improvement
- Feedback appears after 50+ characters, with a 5-second delay

### 3. Writing Samples Storage
- All writing samples are automatically saved
- Located in `server/data/writing-samples/`
- Includes metadata, feedback, and cognitive scores
- Export sessions as JSON or text files

### 4. API Endpoints

The MCP server provides these endpoints:

- `POST /api/chat` - Main chat with Claude
- `POST /api/realtime-feedback` - Get real-time writing feedback
- `POST /api/socratic-guidance` - Get Socratic questions
- `GET /api/writing-samples/:sessionId` - Retrieve samples
- `GET /api/writing-trends/:sessionId` - Analyze trends
- `GET /api/export/:sessionId?format=json|text` - Export data

## Configuration Options

Edit `.env` to customize:

```env
# Claude Model (default: claude-3-5-sonnet-20241022)
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Real-time feedback interval in ms (default: 5000)
FEEDBACK_INTERVAL_MS=5000

# Minimum text length for feedback (default: 50)
MIN_TEXT_LENGTH_FOR_FEEDBACK=50
```

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and has sufficient credits
- Check the server console for "Claude API Key: Configured" message
- Verify the key starts with "sk-ant-"

### No Feedback in Live Mode
- Ensure you have at least 50 characters typed
- Check browser console for errors
- Verify the server is running and accessible

### Connection Errors
- Check that both frontend (port 5173) and backend (port 3001) are running
- Ensure CORS is properly configured (already set up)
- Check firewall settings if running remotely

## Security Notes

- Never commit your `.env` file to version control
- The `.gitignore` already excludes `.env` files
- Keep your API key secure and rotate it regularly
- Consider implementing rate limiting for production use

## Next Steps

1. Test the integration by starting a session
2. Try both Draft and Live modes
3. Review saved writing samples in the data directory
4. Customize the prompts in `server/services/claude.js` for your needs

For more information about the Anthropic API, visit: https://docs.anthropic.com/