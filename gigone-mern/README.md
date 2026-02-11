# GigOne - MERN Stack Application

Voice-based sentiment analysis and daily logging for gig workers.

## 🚀 Features

- 🎤 Voice recording with Whisper translation (any language → English)
- 😊 Sentiment analysis with mood detection
- 💰 Earnings tracking
- 📊 7-day analytics and insights
- 🔥 Burnout detection
- 💡 Personalized recommendations
- 🎨 Beautiful glassmorphism UI with Tailwind CSS

## 📁 Project Structure

```
gigone-mern/
├── server/          Node.js + Express backend
├── client/          React frontend
└── whisper-service/ Python Whisper microservice
```

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

# Whisper Service
cd ../whisper-service
pip install -r requirements.txt
```

### 2. Configure Environment Variables

**Backend (.env):**

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```
MONGODB_URI=mongodb://localhost:27017/gigone
JWT_SECRET=your_random_secret_key_here
WHISPER_SERVICE_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:3000
```

**Whisper Service (.env):**

```bash
cd whisper-service
cp .env.example .env
```

### 3. Start MongoDB

Option A - Local MongoDB:

```bash
mongod
```

Option B - MongoDB Atlas (FREE cloud):

1. Create free account at mongodb.com/atlas
2. Get connection string
3. Update `MONGODB_URI` in `server/.env`

### 4. Run Services

Open **3 terminals**:

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

→ Runs on http://localhost:5000

**Terminal 2 - Whisper:**

```bash
cd whisper-service
python app.py
```

→ Runs on http://localhost:5001

**Terminal 3 - Frontend:**

```bash
cd client
npm run dev
```

→ Runs on http://localhost:3000

## 🧪 Testing

### 1. Test Backend API

```bash
curl http://localhost:5000/health
```

### 2. Test Whisper Service

```bash
curl http://localhost:5001/health
```

### 3. Test Full App

1. Open http://localhost:3000
2. Click "Register here"
3. Create an account
4. Click "Start Recording"
5. Speak in any language (Hindi/Telugu/Tamil/English)
6. Click "Stop Recording"
7. View English translation + sentiment!

## 📱 Usage

1. **Register/Login** - Create your account
2. **Record Voice** - Click mic button and speak
3. **View Analysis** - See sentiment, earnings, mood
4. **Check Dashboard** - View 7-day summary and stats
5. **Get Insights** - Receive personalized recommendations

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **AI/ML:** OpenAI Whisper (small model)
- **Auth:** JWT
- **Styling:** Glassmorphism + Dark Theme

## 🎨 Features Implemented

✅ User authentication (register/login)  
✅ JWT token management  
✅ Voice recording (MediaRecorder API)  
✅ Whisper translation (multilingual → English)  
✅ Sentiment analysis (keyword-based)  
✅ Earnings extraction  
✅ 7-day analytics dashboard  
✅ Insights & recommendations  
✅ Burnout detection  
✅ Beautiful Tailwind UI

## 📊 API Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Logs

- `POST /api/logs/transcribe` - Transcribe audio
- `POST /api/logs/save` - Save daily log
- `GET /api/logs/history` - Get log history

### Analytics

- `GET /api/analytics/summary` - 7-day summary
- `GET /api/analytics/trends` - Earnings trends
- `GET /api/analytics/insights` - AI insights

## 🐛 Troubleshooting

**MongoDB connection error:**

- Make sure MongoDB is running locally
- OR use MongoDB Atlas cloud (FREE)

**Whisper service error:**

- Check if Python service is running
- Verify ffmpeg is installed
- Model will auto-download on first run

**Frontend can't connect to backend:**

- Check all 3 services are running
- Verify ports: Frontend (3000), Backend (5000), Whisper (5001)

## 💰 Cost

**Development:** ₹0 (all free and local)  
**Production (optional):**

- Frontend: Vercel (FREE)
- Backend: Render.com (FREE with sleep)
- Whisper: Render.com (FREE)
- Database: MongoDB Atlas (FREE 512MB)
- Keep-Alive: UptimeRobot (FREE)

## 📝 License

MIT - Free to use for your course project!

---

**Built with ❤️ for gig workers**
