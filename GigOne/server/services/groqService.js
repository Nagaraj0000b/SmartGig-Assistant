const Groq = require("groq-sdk");
const fs   = require("fs");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const transcribeAudio = async (filePath) => {
  const transcription = await groq.audio.translations.create({
    file: fs.createReadStream(filePath),
    model: "whisper-large-v3",
    response_format: "text",   // returns a plain string, not an object
    temperature: 0.2,
  });

  const rawText = transcription; // response_format:"text" gives a string directly


  return rawText;
};

module.exports = { transcribeAudio };