import React, { useState, useRef } from 'react';
import { logsAPI } from '../services/api';

const VoiceRecorder = ({ onLogSaved }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
      setResult(null);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      // Transcribe via Whisper
      const transcribeResponse = await logsAPI.transcribe(audioBlob);
      const { englishText, sentiment, earnings } = transcribeResponse.data;

      setResult({ englishText, sentiment, earnings });

      // Save log automatically
      await logsAPI.save({
        transcript: englishText,
        englishText,
        sentiment,
        earnings
      });

      if (onLogSaved) {
        onLogSaved();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">🎤 Voice Input</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        {!isRecording && !isProcessing && (
          <button
            onClick={startRecording}
            className="btn-primary w-full sm:w-auto"
          >
            🎙️ Start Recording
          </button>
        )}

        {isRecording && (
          <div className="text-center">
            <div className="inline-block p-8 bg-red-500/20 rounded-full animate-pulse mb-4">
              <div className="w-16 h-16 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-xl mb-4">Recording... Speak now!</p>
            <button
              onClick={stopRecording}
              className="btn-secondary"
            >
              ⏹️ Stop Recording
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl">Processing with Whisper...</p>
          </div>
        )}

        {result && (
          <div className="w-full space-y-4 animate-fadeIn">
            <div className="bg-white/5 rounded-xl p-4 border border-primary/30">
              <h3 className="text-sm font-semibold text-white/70 mb-2">📝 Transcript</h3>
              <p className="text-lg">{result.englishText}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                <h3 className="text-sm font-semibold text-white/70 mb-2">Sentiment</h3>
                <p className={`text-2xl font-bold ${getMoodColor(result.sentiment.mood)}`}>
                  {getMoodEmoji(result.sentiment.mood)} {result.sentiment.mood}
                </p>
                <p className="text-sm text-white/50 mt-1">
                  Score: {(result.sentiment.score * 100).toFixed(0)}%
                </p>
              </div>

              {result.earnings > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <h3 className="text-sm font-semibold text-white/70 mb-2">Earnings</h3>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{result.earnings}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setResult(null)}
              className="btn-secondary w-full"
            >
              ✨ Record Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
