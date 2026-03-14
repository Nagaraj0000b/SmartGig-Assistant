const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Use existing API to start a chat and get a real conversationId
async function debugReply() {
  try {
    // 1. Start session to get a valid conversation ID
    console.log("Starting session...");
    const startRes = await axios.post('http://localhost:5000/api/chat/start', {}, {
      headers: {
        Authorization: 'Bearer test-token' // Auth is mocked out using auth middleware if no DB? Wait, let's just use any token, wait if auth middleware requires a valid JWT this will fail.
      }
    });

    // If auth fails, we just print that.
    console.log("Session started:", startRes.data);

  } catch (err) {
    console.error("Test script error:", err.response?.data || err.message);
  }
}

debugReply();
