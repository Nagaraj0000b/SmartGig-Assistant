/**
 * @fileoverview Google Cloud Text-to-Speech service.
 * Replaces the standalone `openai-edge-tts` python server.
 */

const textToSpeech = require("@google-cloud/text-to-speech");
const path = require("path");
const fs = require("fs");
const AppError = require("../utils/appError");

let ttsClient;

const getTtsClient = () => {
  if (!ttsClient) {
    const keyFilename = path.join(__dirname, "..", "credential.json");
    if (!fs.existsSync(keyFilename)) {
      throw new AppError("Google Cloud credential.json not found in server root.", 500, {
        code: "CONFIG_ERROR",
      });
    }
    ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename });
  }
  return ttsClient;
};

/**
 * Maps our internal language names to Google Cloud Standard voice names.
 * Standard models are more cost-effective.
 */
const getVoiceConfig = (languageName) => {
  const languageMap = {
    English: { languageCode: "en-IN", name: "en-IN-Standard-A" },
    Hindi: { languageCode: "hi-IN", name: "hi-IN-Standard-A" },
    Tamil: { languageCode: "ta-IN", name: "ta-IN-Standard-A" },
    Telugu: { languageCode: "te-IN", name: "te-IN-Standard-A" },
    Kannada: { languageCode: "kn-IN", name: "kn-IN-Standard-A" },
    Malayalam: { languageCode: "ml-IN", name: "ml-IN-Standard-A" },
    Marathi: { languageCode: "mr-IN", name: "mr-IN-Standard-A" },
    Bengali: { languageCode: "bn-IN", name: "bn-IN-Standard-A" },
    Gujarati: { languageCode: "gu-IN", name: "gu-IN-Standard-A" },
  };

  return languageMap[languageName] || { languageCode: "en-IN", name: "en-IN-Standard-A" };
};

/**
 * Synthesizes text into speech audio.
 * @param {string} text - The text to synthesize.
 * @param {string} [language="English"] - The language name (e.g., "Hindi", "Tamil").
 * @returns {Promise<Buffer>} The synthesized MP3 audio as a Buffer.
 */
const synthesizeSpeech = async (text, language = "English") => {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new AppError("Text is required for synthesis", 400, { code: "VALIDATION_ERROR" });
  }

  const voiceConfig = getVoiceConfig(language);

  const request = {
    input: { text },
    voice: voiceConfig,
    audioConfig: { 
      audioEncoding: "MP3",
      speakingRate: 1.15 // Increased talking speed to 1.15x
    },
  };

  try {
    const client = getTtsClient();
    const [response] = await client.synthesizeSpeech(request);
    
    return response.audioContent;
  } catch (error) {
    console.error("[GCP TTS Error]:", error);
    
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Text-to-speech service is unavailable", 502, {
      code: "TTS_ERROR",
      expose: false,
      cause: error,
    });
  }
};

module.exports = { synthesizeSpeech };
