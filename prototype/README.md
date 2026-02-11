# 🎙️ GigOne Voice Prototype - Quick Start Guide

## What is This?

A **voice-enabled web application** for gig workers to:

- Record daily experiences using their voice (Hindi/English)
- Track earnings and mood automatically
- Get personalized recommendations
- View analytics and patterns

## 🚀 How to Run

### Option 1: Direct File Open

1. Navigate to: `c:\Users\nagar\OneDrive\Desktop\antigravity\Geek-worker-guide\prototype\`
2. Double-click `index.html`
3. Allow microphone access when prompted

### Option 2: Local Server (Recommended)

```powershell
# Navigate to prototype folder
cd "c:\Users\nagar\OneDrive\Desktop\antigravity\Geek-worker-guide\prototype"

# Start a simple HTTP server (Python)
python -m http.server 8000

# Or use Node.js
npx http-server -p 8000
```

Then open: `http://localhost:8000` in Chrome or Edge

## 📱 Usage Instructions

### Step 1: Choose Language

- Select **हिन्दी (Hindi)** or **English (India)** from dropdown

### Step 2: Record Your Day

1. Click the **microphone button** (purple gradient circle)
2. Speak naturally:
   - "Aaj maine 500 rupees kamaye, bahut garmi thi"
   - "Today earned 600, traffic was heavy but day was good"
3. Watch words appear in real-time
4. Click **"Submit Daily Log"**

### Step 3: View Recommendation

- See personalized advice based on your earnings, mood, and weather
- Click **"Record Another Log"** to continue

### Step 4: Check Analytics

- Click **"Analytics"** tab to see:
  - Average earnings (last 7 days)
  - Mood trends
  - Patterns and insights

### Step 5: Browse History

- Click **"History"** tab to review past logs

## ✨ Example Voice Inputs

**Good Day (Hindi)**:

> "Aaj बहुत अच्छा din tha, 750 rupees kamaye, weather bhi pleasant tha, खुश हूं"

**Challenging Day (English)**:

> "Today was tough, only earned 350 rupees, very hot and traffic was heavy, feeling exhausted"

**Mixed Day (Hinglish)**:

> "Morning अच्छी thi, 550 kamaye, but afternoon में bahut garmi ho gayi, थोड़ा थका हुआ"

## 🔧 Technical Requirements

- **Browser**: Chrome or Edge (Web Speech API support)
- **Microphone**: Any working microphone/headset
- **Internet**: Not required (runs offline after loading)
- **Storage**: Uses browser localStorage (no server needed)

## 📊 Features

| Feature                   | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| **Voice Input**           | Real-time speech-to-text using Web Speech API        |
| **Sentiment Analysis**    | Automatic mood detection from keywords               |
| **Earnings Tracking**     | Extracts amounts from voice (₹500, 500 rupees, etc.) |
| **Smart Recommendations** | Personalized advice based on patterns                |
| **Analytics Dashboard**   | 7-day trends, insights, burnout detection            |
| **Bilingual**             | Hindi, English, and Hinglish support                 |
| **Mobile-Optimized**      | Responsive design for smartphones                    |

## ⚠️ Troubleshooting

**"Voice recognition not supported"**

- Use Chrome or Edge browser
- Firefox/Safari don't support Web Speech API fully

**"Microphone access denied"**

- Click the lock icon in address bar
- Allow microphone permissions
- Refresh the page

**"No speech detected"**

- Speak closer to microphone
- Check microphone is working in system settings
- Try increasing microphone volume

**Words not appearing**

- Ensure language matches what you're speaking
- Speak clearly and at moderate pace
- Check browser console for errors (F12)

## 📂 Files Overview

```
prototype/
├── index.html    # Main app structure
├── styles.css    # Modern UI styling
└── app.js        # Voice recording, analytics, recommendations
```

## 🎯 What to Test

1. ✅ Voice recording in Hindi
2. ✅ Voice recording in English
3. ✅ Earnings extraction ("500 rupees", "₹600")
4. ✅ Sentiment detection (happy/sad keywords)
5. ✅ Recommendation generation
6. ✅ Analytics calculations
7. ✅ History persistence (refresh page, data should remain)

## 🌟 Key Highlights

- **No Backend Required** - Everything runs in browser
- **Real Voice Recognition** - Not a simulation
- **Instant Feedback** - Real-time transcription
- **Smart Analysis** - Context-aware recommendations
- **Beautiful UI** - Premium glassmorphism design
- **Privacy-First** - Data stays on your device

## 📞 Need Help?

See the full [walkthrough.md](file:///C:/Users/nagar/.gemini/antigravity/brain/fab761c1-0cbf-40ff-9739-eb3db2ad46b1/walkthrough.md) for detailed documentation.

---

**Ready to use!** Open `index.html` in Chrome and start recording your daily experiences! 🎤
