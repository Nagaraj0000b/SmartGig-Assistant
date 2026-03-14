# GigOne — Project Context

## What is GigOne?

An AI-powered companion app for gig economy workers (Uber, Swiggy, Rapido drivers).  
The core idea: **workers don't type anything — Gigi (the AI) talks to them, extracts all data through voice conversation, and gives smart suggestions.**

---

## The Core Flow

```
1. User opens app
2. Gigi speaks first — asks questions ONE AT A TIME (conversational)
3. User replies by VOICE each time
4. After the conversation ends:
   → Sentiment analysis on all replies (tired? motivated? stressed?)
   → Parameters extracted (platform, hours, earnings, mood)
   → AI checks user's past records (earnings history, avg hours, fatigue patterns)
   → Weather forecast fetched for their city
   → Traffic conditions fetched for their city
5. At ~10 PM (before the worker sleeps), Gigi delivers the suggestion for TOMORROW:
   e.g. "Kal subah traffic heavy hoga 9 baje. Barish bhi 5 baje aayegi.
         Tu aaj thaka tha — kal 4 ghante kaam kar, Swiggy better rahega."
6. All data auto-saved to MongoDB — NO manual data entry by the user
```

---

## What Gigi Asks (Sample Conversation)

| Gigi                  | User                |
| --------------------- | ------------------- |
| "Aaj kaam kiya?"      | "Haan, Uber pe"     |
| "Kitne ghante?"       | "5 ghante"          |
| "Kitna kamaya?"       | "₹1200"             |
| "Kaisa feel hua aaj?" | "Thoda thaka hua"   |
| "Koi problem tha?"    | "Traffic bahut tha" |

After this → sentiment = tired/frustrated → suggestion adjusted accordingly.

---

## Tech Stack

| Layer              | Tech                                             |
| ------------------ | ------------------------------------------------ |
| Frontend           | React + Vite                                     |
| Styling            | Custom CSS (dark glassmorphism)                  |
| Backend            | Node.js + Express                                |
| Database           | MongoDB (Mongoose)                               |
| Voice STT          | **Groq Voice Service** (speech → text)           |
| Gigi Voice TTS     | Web Speech Synthesis (browser) / ElevenLabs      |
| AI Brain           | **Gemini API** — multi-turn conversation         |
| Sentiment Analysis | **Gemini API** (separate call, different prompt) |
| Weather            | OpenWeatherMap API                               |
| Traffic            | Google Maps / TomTom Traffic API                 |
| Scheduler          | Node cron job — triggers at 10 PM daily          |

---

## Current Build Status

- [x] Frontend — all pages, sidebar navigation, dashboard UI
- [x] Backend — auth, earnings, worklogs API (Express + MongoDB)
- [ ] Gigi AI — voice conversation flow
- [ ] Sentiment analysis
- [ ] Weather API integration
- [ ] Traffic API integration
- [ ] Nightly suggestion scheduler (cron job at 10 PM)
- [ ] Auto-save extracted data from conversation
- [ ] Admin dashboard

---

## Who is this for?

Gig workers who are not tech-savvy and won't fill forms.  
Everything happens through **natural voice conversation with Gigi.**
