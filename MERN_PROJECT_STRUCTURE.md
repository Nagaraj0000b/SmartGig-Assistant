# GigOne - MERN Stack Project Structure

Complete folder structure and file organization for your course project.

---

## 🏗️ Technology Stack

- **Frontend**: React.js (PWA)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **ML Service**: Python + Whisper (FREE)
- **Hosting**: Render.com (FREE)

---

## 📁 Complete Project Structure

```
gigone-mern/
│
├── client/                          # React Frontend (Port 3000)
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json           # PWA config
│   │   └── icons/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceRecorder.jsx   # Main voice input
│   │   │   ├── Dashboard.jsx       # Today's log view
│   │   │   ├── Analytics.jsx       # 7-day analytics
│   │   │   ├── History.jsx         # Past logs
│   │   │   ├── Login.jsx           # User auth
│   │   │   └── Navbar.jsx          # Navigation
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Axios API calls
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # User state
│   │   │
│   │   ├── App.jsx                 # Main app
│   │   ├── index.js                # Entry point
│   │   └── index.css               # Styles
│   │
│   └── package.json
│
├── server/                          # Node.js Backend (Port 5000)
│   ├── routes/
│   │   ├── auth.js                 # POST /api/auth/register, /login
│   │   ├── logs.js                 # POST /api/logs/transcribe, /save
│   │   └── analytics.js            # GET /api/analytics/summary
│   │
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── DailyLog.js             # Log schema
│   │
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   └── errorHandler.js         # Error handling
│   │
│   ├── utils/
│   │   ├── sentiment.js            # Sentiment analysis
│   │   └── recommendations.js      # ML predictions
│   │
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   │
│   ├── server.js                   # Express app
│   └── package.json
│
├── whisper-service/                 # Python Service (Port 5001)
│   ├── app.py                      # Flask/FastAPI server
│   ├── whisper_model.py            # Whisper logic
│   ├── requirements.txt
│   └── .env
│
├── .env                            # Environment variables
├── .gitignore
├── README.md
└── package.json                    # Root package (optional)
```

---

## 📦 Package Files

### client/package.json

```json
{
  "name": "gigone-client",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "chart.js": "^4.x",
    "react-chartjs-2": "^5.x"
  }
}
```

### server/package.json

```json
{
  "name": "gigone-server",
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.x",
    "jsonwebtoken": "^9.x",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5",
    "axios": "^1.x",
    "cors": "^2.8.5",
    "dotenv": "^16.x"
  }
}
```

### whisper-service/requirements.txt

```
flask==3.0.0
flask-cors==4.0.0
openai-whisper==20250625
soundfile
```

---

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  vehicle: String,
  city: String,
  createdAt: Date
}
```

### DailyLogs Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: Date,
  transcript: String,
  englishText: String,
  sentiment: {
    score: Number,
    mood: String,
    keywords: [String]
  },
  earnings: Number,
  metadata: {
    weather: String,
    traffic: String,
    temperature: Number
  },
  recommendations: [String],
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Logs

- `POST /api/logs/transcribe` - Upload audio & get transcript
- `POST /api/logs/save` - Save daily log
- `GET /api/logs/history` - Get user's logs
- `GET /api/logs/:id` - Get specific log

### Analytics

- `GET /api/analytics/summary` - 7-day summary
- `GET /api/analytics/trends` - Earnings trends
- `GET /api/analytics/insights` - ML insights

---

## 🌊 Data Flow

```
1. User Records Voice (React)
   ↓
2. Audio sent to Node.js (/api/logs/transcribe)
   ↓
3. Node.js forwards to Python service (localhost:5001/translate)
   ↓
4. Whisper returns English text
   ↓
5. Node.js analyzes sentiment
   ↓
6. Returns to React
   ↓
7. User confirms & saves (/api/logs/save)
   ↓
8. Stored in MongoDB
```

---

## 💾 Environment Variables

### server/.env

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigone
JWT_SECRET=your_jwt_secret_here
WHISPER_SERVICE_URL=http://localhost:5001
```

### whisper-service/.env

```
PORT=5001
MODEL_SIZE=base
```

---

## 🚀 Deployment Structure

### Free Hosting (Recommended for Course)

```
Frontend (Vercel):
- Client build deployed
- Static files
- FREE

Backend (Render.com):
- Node.js API
- MongoDB Atlas (FREE tier)
- FREE 750 hrs/month

Whisper Service (Render.com):
- Python Flask
- Whisper base model (74 MB)
- FREE 750 hrs/month
```

---

## 📊 File Sizes

| Component      | Size     | Notes                          |
| -------------- | -------- | ------------------------------ |
| React build    | ~2 MB    | Compiled JS/CSS                |
| Node.js server | ~50 MB   | With node_modules              |
| Whisper model  | 74 MB    | Base model (one-time download) |
| MongoDB        | Variable | User data                      |
| **Total**      | ~130 MB  | Fits FREE tier!                |

---

## 🎯 Development vs Production

### Development

```
- Run locally
- client: npm start (port 3000)
- server: npm start (port 5000)
- whisper: python app.py (port 5001)
- MongoDB: local or Atlas
```

### Production

```
- Frontend: Vercel/Netlify
- Backend: Render.com
- Whisper: Render.com (separate service)
- Database: MongoDB Atlas (FREE 512MB)
```

---

## ✅ Setup Steps

1. **Create project folders** (as shown above)
2. **Initialize packages**
   ```bash
   cd client && npm init -y
   cd server && npm init -y
   ```
3. **Install dependencies** (see package.json)
4. **Set up MongoDB** (local or Atlas)
5. **Test Whisper** (python test_whisper_free.py)
6. **Start development servers**

---

**Total Cost: ₹0** for course project!  
**Scales to:** 1000+ users easily

---

Last Updated: 2026-02-11  
For: GigOne Course Project
