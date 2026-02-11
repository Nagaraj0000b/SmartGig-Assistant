"""
Live Whisper Transcription - Small Model
Record until you stop, get instant transcription
No file storage needed
"""

import whisper
import sounddevice as sd
import soundfile as sf
import numpy as np
import os
import threading

print("=" * 60)
print("LIVE WHISPER TRANSCRIPTION (Small Model)")
print("=" * 60)

# Load small model
print("\n🤖 Loading Whisper 'small' model...")
model = whisper.load_model("small")
print("✅ Model loaded!\n")

# Recording settings
sample_rate = 16000
recording = []
is_recording = False

def record_audio():
    """Background recording thread"""
    global recording, is_recording
    
    with sd.InputStream(samplerate=sample_rate, channels=1, dtype='float32') as stream:
        while is_recording:
            data, overflowed = stream.read(1024)
            recording.extend(data)

# Start recording
print("🎤 Recording started...")
print("   👉 Speak in any language (Hindi/Telugu/Tamil/English)")
print("   ⏸️  Press ENTER to stop recording\n")

is_recording = True
recording = []

# Start recording thread
record_thread = threading.Thread(target=record_audio)
record_thread.start()

# Wait for user to press Enter
input()

# Stop recording
is_recording = False
record_thread.join()

print("\n✅ Recording stopped!")

# Save temporarily for Whisper processing
temp_file = "temp_recording.wav"
audio_data = np.array(recording, dtype='float32')
sf.write(temp_file, audio_data, sample_rate)

print("🔄 Processing with Whisper...\n")

# Transcribe
print("=" * 60)
print("TRANSCRIPTION RESULTS:")
print("=" * 60)

# Auto-detect language and transcribe
result = model.transcribe(temp_file)
detected_lang = result.get('language', 'unknown')

print(f"\n🔍 Detected Language: {detected_lang.upper()}")
print(f"\n📝 Original Text:\n   '{result['text']}'")

# Translate to English
result_en = model.transcribe(temp_file, task="translate")
print(f"\n🌐 English Translation:\n   '{result_en['text']}'")

print("\n" + "=" * 60)

# Clean up temporary file
os.remove(temp_file)
print("\n✅ Done! (temp file deleted)")
print("\n💡 Run again: python test_whisper_live.py")
