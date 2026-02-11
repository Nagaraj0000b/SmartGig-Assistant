# Quick Start Guide - GigOne MERN App

## 🚀 Start All Services (3 Terminals)

### Terminal 1: Backend

```powershell
cd c:\Users\nagar\OneDrive\Desktop\antigravity\Geek-worker-guide\gigone-mern\server
npm run dev
```

### Terminal 2: Whisper Service

```powershell
cd c:\Users\nagar\OneDrive\Desktop\antigravity\Geek-worker-guide\gigone-mern\whisper-service
$env:Path += ";C:\Users\nagar\Downloads\ffmpeg-master-latest-win64-gpl-shared\ffmpeg-master-latest-win64-gpl-shared\bin"
python app.py
```

### Terminal 3: React Frontend

```powershell
cd c:\Users\nagar\OneDrive\Desktop\antigravity\Geek-worker-guide\gigone-mern\client
npm run dev
```

## ✅ Quick Tests

**1. Backend Health:**

```powershell
curl http://localhost:5000/health
```

**2. Whisper Health:**

```powershell
curl http://localhost:5001/health
```

**3. Open App:**

```
http://localhost:3000
```

## 📝 Test Steps

1. **Register Account**
   - Go to http://localhost:3000
   - Click "Register here"
   - Fill in details
   - Click "Create Account"

2. **Record Voice**
   - Click "🎙️ Start Recording"
   - Allow microphone access
   - Speak in Hindi/Telugu/Tamil/English
   - Click "⏹️ Stop Recording"

3. **View Results**
   - See English translation
   - Check sentiment (😊😐😔)
   - View earnings (if mentioned)

4. **Check Dashboard**
   - View 7-day summary
   - See insights
   - Check recent logs

## 🐛 Common Issues

**MongoDB not running:**

```powershell
# If you don't have local MongoDB, the app will fail
# Either install MongoDB OR use MongoDB Atlas (cloud)
```

**Whisper error:**

```powershell
# Make sure FFmpeg path is added in Terminal 2
# Model will auto-download on first run (461 MB)
```

**Port already in use:**

```powershell
# Change ports in .env files if needed
```

## 🎯 What to Demonstrate

1. ✅ Multilingual voice input (any Indian language)
2. ✅ Real-time English translation via Whisper
3. ✅ Sentiment analysis with mood detection
4. ✅ Earnings extraction from speech
5. ✅ Beautiful glassmorphism UI
6. ✅ 7-day analytics dashboard
7. ✅ AI-powered insights & recommendations
8. ✅ Burnout risk detection

---

**Total Setup Time:** ~5-10 minutes  
**Demo Time:** ~2-3 minutes  
**Wow Factor:** 🚀🚀🚀
