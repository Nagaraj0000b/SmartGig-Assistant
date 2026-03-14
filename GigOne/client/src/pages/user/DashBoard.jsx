import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { chatApi } from "../../services/chatApi";

export default function DashBoard() {
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  // Chat state
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ready when you are! Tap the mic button to start your daily check-in.",
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weatherData, setWeatherData] = useState(null);
  const chatEndRef = useRef(null);

  // Text-to-Speech function
  const playVoice = (text) => {
    if (!("speechSynthesis" in window)) return;

    // Stop any currently playing audio
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a Hindi or Indian English voice
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(
      (v) => v.lang.includes("hi-IN") || v.lang.includes("en-IN"),
    );

    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    // Adjust pitch and rate for a more natural feel
    utterance.pitch = 1.0;
    utterance.rate = 0.95; // Slightly slower for better Hinglish pronunciation

    window.speechSynthesis.speak(utterance);
  };

  // Initialize chat session (called manually)
  const initChat = async () => {
    try {
      setIsProcessing(true);
      const data = await chatApi.startSession();
      setConversationId(data.conversationId);
      setMessages([{ role: "assistant", text: data.reply }]);
      playVoice(data.reply);
    } catch (err) {
      console.error("Failed to start chat session", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    // 1. Check if we just arrived from Google Auth
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = urlParams.get("user");

    if (token && user) {
      // Save Google Auth token + user to local storage and clean the URL
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);

      // Remove query string from URL so it doesn't stay there on reload
      window.history.replaceState({}, document.title, "/user/dashboard");
    }

    // 2. Start the live clock
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };

    // 4. Get User Location for Weather Context
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });

          // Fetch live weather context to display in the UI
          try {
            const contextData = await chatApi.getContext(lat, lon);
            if (
              contextData &&
              contextData.weather &&
              contextData.weather.current
            ) {
              setWeatherData(contextData.weather.current);
            }
          } catch (err) {
            console.error("Failed to fetch weather context:", err);
          }
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error.message);
        },
      );
    }

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const recordingStartTimeRef = useRef(0);

  const handleMicDown = () => {
    if (!conversationId) {
      initChat();
      return;
    }

    if (!isProcessing) {
      recordingStartTimeRef.current = Date.now();
      startRecording();
    }
  };

  const handleMicUp = async () => {
    if (!isRecording) return;

    // Require at least 400ms hold to count as a real recording
    const duration = Date.now() - recordingStartTimeRef.current;
    if (duration < 400) {
      console.log("Tap too short, ignoring...");
      await stopRecording(); // stop but don't send
      return;
    }

    try {
      setIsProcessing(true);
      const audioBlob = await stopRecording();

      // UX loading state
      setMessages((prev) => [
        ...prev,
        { role: "user", text: "🎙️ (Sending audio...)" },
      ]);

      const data = await chatApi.sendAudioReply(
        audioBlob,
        conversationId,
        location.lat,
        location.lon,
      );

      setMessages((prev) => {
        const newMsgs = prev.slice(0, -1); // remove loading bubble
        return [
          ...newMsgs,
          { role: "user", text: data.transcription },
          { role: "assistant", text: data.reply },
        ];
      });
      playVoice(data.reply);
    } catch (err) {
      console.error("Error sending voice reply:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="dashboard-page">
      {/* sidebar */}
      <aside className="dashboard-sidebar">
        {/* logo */}
        <div className="dashboard-logo">🔷 Dashboard</div>

        {/* Main section  */}
        <span className="sidebar-section-label">Main</span>
        <button
          className="sidebar-link active"
          onClick={() => navigate("/user/dashboard")}
        >
          🏠 Dashboard
        </button>
        <button
          className="sidebar-link"
          onClick={() => navigate("/user/earnings")}
        >
          💰 Earnings
        </button>
        <button
          className="sidebar-link"
          onClick={() => navigate("/user/work-logs")}
        >
          📋 Work Logs
        </button>
        <button
          className="sidebar-link"
          onClick={() => navigate("/user/suggestions")}
        >
          💡 Suggestions
        </button>

        {/* INSIGHTS section */}
        <span className="sidebar-section-label">Insights</span>
        <button
          className="sidebar-link"
          onClick={() => navigate("/user/weekly-report")}
        >
          📊 Weekly Report
        </button>
        <button
          className="sidebar-link"
          onClick={() => navigate("/user/platforms")}
        >
          🔗 Platforms
        </button>
        <button
          className="sidebar-link"
          onClick={() => navigate("/user/shift-planner")}
        >
          🕐 Shift Planner
        </button>

        {/* ALERTS section */}
        <span className="sidebar-section-label">Alerts</span>
        <button
          className="sidebar-link"
          onClick={() => navigate("/user/nudges")}
        >
          🔔 Nudges
        </button>
        <button
          className="sidebar-link"
          onClick={() => navigate("/user/settings")}
        >
          ⚙️ Settings
        </button>
      </aside>
      {/* main content */}
      <div className="dashboard-main">
        {/* topbar */}
        <header className="dashboard-topbar">
          {/* Status badges on the left side */}
          <span className="topbar-badge active">🟢 AI Active</span>
          {weatherData ? (
            <>
              <span className="topbar-badge">
                {weatherData.condition === "Rain" ? "🌧" : "🌤"}{" "}
                {Math.round(weatherData.temp)}°C · Surge Detected
              </span>
              <span className="topbar-badge">📍 {weatherData.city}</span>
            </>
          ) : (
            <>
              <span className="topbar-badge">
                🌧 Rain 5 PM · Surge Detected
              </span>
              <span className="topbar-badge">📍 Bangalore</span>
            </>
          )}
          {/* Live clock on the far right */}
          <span className="topbar-clock">{time}</span>
        </header>

        {/* center row */}
        <div className="dashboard-center">
          <section className="ai-avatar">
            {/* Status chip top-right */}
            <span className="ai-status-chip">
              {isProcessing
                ? "⏳ Thinking..."
                : isRecording
                  ? "🔴 Recording..."
                  : "🎙 Listening · AI is Ready"}
            </span>
            {/* Avatar circle — AI companion image */}
            <div className="ai-avatar-circle">
              <img
                src="/gigi-avatar.png"
                alt="AI Companion"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
            {/* Name + tagline */}
            <h2 className="ai-name">AI Companion</h2>
            <p className="ai-tagline">
              Your AI Gig Companion · Always Listening
            </p>
            {/* Speech bubble */}
            <div className="ai-chat-box">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="ai-bubble"
                  style={{
                    backgroundColor:
                      msg.role === "user"
                        ? "rgba(0, 212, 170, 0.1)"
                        : "rgba(108, 99, 255, 0.1)",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(0, 212, 170, 0.2)"
                        : "1px solid rgba(108, 99, 255, 0.2)",
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  <p
                    className="ai-bubble-label"
                    style={{
                      color:
                        msg.role === "user"
                          ? "var(--color-accent)"
                          : "var(--color-primary)",
                      textAlign: msg.role === "user" ? "right" : "left",
                    }}
                  >
                    {msg.role === "user" ? "You" : "AI"}
                  </p>
                  <p style={{ margin: 0 }}>{msg.text}</p>
                </div>
              ))}
              {/* Invisible ref element to force scroll to bottom */}
              <div ref={chatEndRef} />
            </div>
            {/* Mic button */}
            <button
              className={`ai-mic-btn ${isRecording ? "recording" : ""}`}
              onMouseDown={handleMicDown}
              onMouseUp={handleMicUp}
              onMouseLeave={handleMicUp} // stop if they drag off the button
              onTouchStart={(e) => {
                e.preventDefault(); // prevent triggering mousedown
                handleMicDown();
              }}
              onTouchEnd={(e) => {
                e.preventDefault(); // prevent triggering mouseup
                handleMicUp();
              }}
              disabled={isProcessing}
              style={{ backgroundColor: isRecording ? "#ff4b4b" : "" }}
            >
              🎤
            </button>
            <span className="ai-mic-label">
              {isProcessing
                ? "Processing..."
                : isRecording
                  ? "Recording... Release to send"
                  : "Hold to speak"}
            </span>
          </section>

          <section className="overview-panel">
            {/* Header */}
            <div>
              <h2 className="overview-title">
                Today's
                <br />
                Overview
              </h2>
              <p className="overview-date">TUE · FEB 18 · 2026</p>
            </div>

            {/* Earnings card */}
            <div className="earnings-card">
              <p className="earnings-card-label">Today's Earnings</p>
              <p>
                This Week &nbsp;
                <span className="earnings-amount">₹5,800 total</span>
              </p>

              {/* CSS bar chart */}
              <div className="bar-chart">
                <div className="bar" style={{ height: "40%" }}></div>
                <div className="bar" style={{ height: "60%" }}></div>
                <div className="bar active" style={{ height: "80%" }}></div>
                <div className="bar" style={{ height: "50%" }}></div>
                <div className="bar active" style={{ height: "90%" }}></div>
                <div className="bar" style={{ height: "70%" }}></div>
                <div className="bar" style={{ height: "55%" }}></div>
              </div>
              <div className="bar-labels">
                <span className="bar-label">M</span>
                <span className="bar-label">T</span>
                <span className="bar-label">W</span>
                <span className="bar-label">T</span>
                <span className="bar-label">F</span>
                <span className="bar-label">S</span>
                <span className="bar-label">S</span>
              </div>
            </div>

            {/* Recent Work Logs */}
            <div>
              <div className="work-logs-header">
                <span>Recent Work Logs</span>
                <a className="work-logs-view-all">View all →</a>
              </div>

              <div className="work-log-item">
                <span className="work-log-platform">Uber</span>
                <span className="work-log-meta">Today · 5 hrs · ₹1,200</span>
              </div>
              <div className="work-log-item">
                <span className="work-log-platform">Swiggy</span>
                <span className="work-log-meta">Mon · 4 hrs · ₹800</span>
              </div>
              <div className="work-log-item">
                <span className="work-log-platform">Rapido</span>
                <span className="work-log-meta">Sun · 3 hrs · ₹600</span>
              </div>
            </div>

            {/* What To Do Tomorrow */}
            <div className="tomorrow-header">
              <span>What To Do Tomorrow</span>
              <span className="ai-suggestion-badge">✨ AI Suggestion</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
