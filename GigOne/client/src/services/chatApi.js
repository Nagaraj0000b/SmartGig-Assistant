import axios from "axios";

// Using Vite's env variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Edge TTS server URL (openai-edge-tts running locally)
const TTS_URL = import.meta.env.VITE_TTS_URL || "http://localhost:5050";
const TTS_API_KEY = import.meta.env.VITE_TTS_API_KEY || "my_free_project_key";

// Helper to get token from storage or URL
const getToken = () => {
  // Check URL first (after Google login)
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');
  if (tokenFromUrl) return tokenFromUrl;
  
  // Otherwise check localStorage
  return localStorage.getItem('token');
};

const getHeaders = () => {
  const token = getToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const chatApi = {
  // Get weather/traffic context
  getContext: async (lat, lon) => {
    const res = await axios.get(`${API_URL}/chat/context?lat=${lat}&lon=${lon}`, {
      headers: getHeaders()
    });
    return res.data;
  },

  // Start a new check-in session
  startSession: async () => {
    const res = await axios.post(`${API_URL}/chat/start`, {}, {
      headers: getHeaders()
    });
    return res.data;
  },

  // Send an audio blob to the reply endpoint
  sendAudioReply: async (audioBlob, conversationId, lat = null, lon = null) => {
    const formData = new FormData();
    // Groq/Whisper works well with mp3, wav, m4a, webm. 
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("conversationId", conversationId);
    
    // Add location data if available
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const res = await axios.post(`${API_URL}/chat/reply`, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  
  // (Optional) Send text reply if you want to fall back to text
  sendTextReply: async (text, conversationId) => {
    const res = await axios.post(`${API_URL}/chat/reply-text`, { text, conversationId }, {
      headers: getHeaders()
    });
    return res.data;
  },

  // 🔊 Text-to-Speech via openai-edge-tts (Microsoft Neural voices)
  synthesizeSpeech: async (text) => {
    const response = await fetch(`${TTS_URL}/v1/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TTS_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
        voice: "en-IN-NeerjaNeural",
        response_format: "mp3",
        speed: 1.25,
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.status}`);
    }

    return await response.blob();
  },
};
