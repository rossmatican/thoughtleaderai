# Deployment Guide for Thought Leader AI

## Prerequisites
- Node.js 18+ installed
- Git installed
- Vercel account (for frontend deployment)
- Server hosting solution (e.g., Railway, Render, Heroku)

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd thought-leader-ai
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install app dependencies
   cd app
   npm install
   cd ..

   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # In the app directory
   cd app
   cp .env.example .env
   # Edit .env and set VITE_API_URL for your local server
   ```

4. **Run the development servers**
   ```bash
   # From root directory
   npm run dev:full
   ```

## Production Deployment

### Frontend (Vercel)

1. **Build the app**
   ```bash
   cd app
   npm run build
   ```

2. **Deploy to Vercel**
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel
   - Set the following configuration:
     - Build Command: `npm run build`
     - Output Directory: `app/dist`
     - Install Command: `npm install`
   - Add environment variable:
     - `VITE_API_URL`: Your production API URL

### Backend Server

1. **Prepare the server**
   - Ensure `server/package.json` has proper start script
   - Server listens on `process.env.PORT || 3001`

2. **Deploy to your hosting provider**
   
   **For Railway:**
   ```bash
   # From server directory
   railway login
   railway link
   railway up
   ```

   **For Render:**
   - Create a new Web Service
   - Connect your GitHub repo
   - Set root directory to `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

   **For Heroku:**
   ```bash
   # From server directory
   heroku create your-app-name
   git push heroku main
   ```

3. **Configure CORS**
   - Update `server/index.js` to allow your frontend domain
   - Or use environment variable for allowed origins

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] API endpoints are accessible
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] SSL certificates are active
- [ ] Error handling works properly
- [ ] All features function as expected

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check for case-sensitive file imports on Linux servers
- Verify Node.js version compatibility

### API Connection Issues
- Check VITE_API_URL is set correctly
- Verify CORS configuration
- Ensure API server is running
- Check for HTTPS/HTTP mismatch

### Missing Dependencies
- Run `npm install` in both app and server directories
- Check `package.json` for all required dependencies
- Clear node_modules and reinstall if needed

## Environment Variables

### Frontend (app/.env)
```
VITE_API_URL=https://your-api-domain.com
```

### Backend (server)
```
PORT=3001
ALLOWED_ORIGINS=https://your-frontend-domain.com
```