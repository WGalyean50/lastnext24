# External API Deployment Guide

This guide covers deploying the OpenAI Whisper transcription API server to various cloud platforms.

## 🚀 **Quick Deploy Options**

### **Railway (Recommended)**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. **Create Railway Account**: [railway.app](https://railway.app)
2. **Deploy from GitHub**:
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Set **Root Directory**: `external-api/`
3. **Environment Variables**:
   ```
   OPENAI_API_KEY=sk-your-openai-key-here
   ```
4. **Deploy**: Railway auto-detects Node.js and deploys
5. **Get URL**: Copy the deployed URL (e.g., `https://your-app.railway.app`)

### **Render**

1. **Create Render Account**: [render.com](https://render.com)
2. **New Web Service**:
   - Connect your GitHub repository
   - **Root Directory**: `external-api`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. **Environment Variables**:
   ```
   OPENAI_API_KEY=sk-your-openai-key-here
   ```
4. **Deploy**: Render will build and deploy automatically

### **Vercel**

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**:
   ```bash
   cd external-api/
   vercel --prod
   ```
3. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   # Enter your OpenAI API key when prompted
   ```
4. **Redeploy**: `vercel --prod`

### **Heroku**

1. **Install Heroku CLI**: [devcenter.heroku.com](https://devcenter.heroku.com/articles/heroku-cli)
2. **Create App**:
   ```bash
   cd external-api/
   heroku create your-transcription-api
   ```
3. **Set Environment Variables**:
   ```bash
   heroku config:set OPENAI_API_KEY=sk-your-openai-key-here
   ```
4. **Deploy**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-transcription-api
   git push heroku main
   ```

## 🔧 **Environment Variables**

Required environment variables for all deployments:

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) | `sk-abc123...` |
| `PORT` | Server port (optional, auto-set by most platforms) | `3001` |

## 🌐 **CORS Configuration**

The server includes CORS configuration for common development origins:

```javascript
app.use(cors({
  origin: [
    'https://interview-hero-mvp1.vercel.app',
    'http://localhost:5173',  // Vite default
    'http://localhost:5174',  // Vite alternate
    'http://localhost:3000',  // Create React App
    'https://your-domain.com' // Add your production domain
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

**To add your domain**:
1. Edit `server.js` 
2. Add your domain to the `origin` array
3. Redeploy

## 🧪 **Testing Your Deployment**

After deployment, test your API:

### **Health Check**
```bash
curl https://your-api-url.com/
```

Expected response:
```json
{
  "message": "Interview Hero Transcription Service",
  "status": "running",
  "configured": true,
  "apiKeyLength": 51,
  "nodeVersion": "v20.x.x",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### **Test Endpoint**
```bash
curl https://your-api-url.com/test
```

Expected response:
```json
{
  "message": "Test endpoint working",
  "cors": "Configured for Interview Hero",
  "openaiConfigured": true,
  "openaiKeyPrefix": "sk-proj...",
  "serverTime": "2024-01-01T12:00:00.000Z"
}
```

### **Full Transcription Test**

Create a test file `test-transcription.js`:

```javascript
const fs = require('fs');

async function testTranscription() {
  // Create a small test audio file (you'd use real audio data)
  const testAudioBase64 = 'YOUR_BASE64_AUDIO_DATA_HERE';
  
  const response = await fetch('https://your-api-url.com/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioData: testAudioBase64,
      mimeType: 'audio/webm'
    })
  });
  
  const result = await response.json();
  console.log('Transcription Result:', result);
}

testTranscription().catch(console.error);
```

## 🔍 **Monitoring & Logs**

### **Railway**
- View logs in Railway dashboard
- Real-time log streaming available

### **Render**  
- Logs available in Render dashboard
- Automatic log retention

### **Vercel**
- Function logs in Vercel dashboard
- Real-time monitoring

### **Heroku**
```bash
heroku logs --tail -a your-transcription-api
```

## 📊 **Performance & Scaling**

### **Expected Performance**
- **Startup Time**: < 30 seconds
- **Transcription Time**: 2-5 seconds for 30-60s audio
- **Memory Usage**: ~50-100MB base, +10MB per concurrent request
- **File Size Limit**: 25MB (OpenAI limit)

### **Scaling Considerations**
- **Railway**: Auto-scales based on traffic
- **Render**: Manual scaling, upgrade plan for auto-scaling
- **Vercel**: Serverless, auto-scales (but has cold starts)
- **Heroku**: Manual dyno scaling

### **Cost Estimates** (Monthly)
- **Railway**: $5-20 (depending on usage)
- **Render**: $7+ (depends on plan)  
- **Vercel**: $0-20 (depending on function calls)
- **Heroku**: $7+ (hobby dyno)

Plus OpenAI API costs (~$0.006 per minute of audio)

## ⚠️ **Common Issues**

### **"OpenAI API key not configured"**
- Solution: Verify `OPENAI_API_KEY` environment variable is set
- Check: API key starts with `sk-` and is 51+ characters

### **"CORS Error"**
- Solution: Add your domain to `origin` array in `server.js`
- Development: Use `http://localhost:3000` or your dev server port

### **"Audio file too large"**
- Solution: Implement client-side compression or chunking
- Limit: 25MB max per OpenAI Whisper requirements

### **"Memory exceeded"**  
- Solution: Upgrade plan on hosting platform
- Consider: Processing larger files in chunks

### **Cold Starts (Vercel/Serverless)**
- Solution: Switch to always-on hosting (Railway, Render)
- Or: Implement keep-alive pinging

## 🔒 **Security Best Practices**

- ✅ **Never expose OpenAI API key in frontend**
- ✅ **Use HTTPS in production** (required for microphone access)
- ✅ **Validate audio file sizes** (implemented)
- ✅ **Configure CORS properly** (restrict origins)
- ✅ **Monitor API usage** (OpenAI dashboard)
- ✅ **Set up error alerting** (hosting platform notifications)

## 📝 **Maintenance**

### **Regular Tasks**
- Monitor OpenAI API usage and costs
- Update dependencies monthly: `npm update`
- Check hosting platform for updates
- Review error logs weekly

### **Dependency Updates**
```bash
cd external-api/
npm update
git add package.json package-lock.json
git commit -m "Update dependencies"
# Redeploy
```

### **Node.js Version Updates**
- Most platforms auto-update Node.js
- Railway: Updates automatically
- Render: Check dashboard for available versions
- Vercel: Set in `package.json` engines field

---

## ✅ **Deployment Checklist**

- [ ] Choose hosting platform
- [ ] Set up repository/upload code
- [ ] Configure `OPENAI_API_KEY` environment variable
- [ ] Add your domain to CORS origins
- [ ] Deploy and test health check endpoint
- [ ] Test transcription endpoint
- [ ] Update frontend `VITE_EXTERNAL_TRANSCRIPTION_API` URL
- [ ] Test full recording → transcription flow
- [ ] Set up monitoring/alerting
- [ ] Document your deployment URL for team

**Your API URL**: `https://your-deployment-url.com`

Add this to your frontend environment variables:
```bash
VITE_EXTERNAL_TRANSCRIPTION_API=https://your-deployment-url.com
```