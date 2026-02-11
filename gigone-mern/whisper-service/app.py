from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load Whisper model at startup
MODEL_SIZE = os.getenv('MODEL_SIZE', 'small')
logger.info(f"Loading Whisper '{MODEL_SIZE}' model...")
model = whisper.load_model(MODEL_SIZE)
logger.info("✅ Model loaded successfully!")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model': MODEL_SIZE,
        'message': 'Whisper service is running'
    })

@app.route('/translate', methods=['POST'])
def translate():
    """
    Translate audio to English
    Input: audio file (any language)
    Output: English text
    """
    try:
        # Check if file is present
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            audio_file.save(temp_audio.name)
            temp_path = temp_audio.name
        
        logger.info(f"Processing audio file: {audio_file.filename}")
        
        # Translate to English
        result = model.transcribe(temp_path, task="translate")
        
        # Clean up temp file
        os.unlink(temp_path)
        
        logger.info(f"✅ Translation complete: {result['text'][:50]}...")
        
        return jsonify({
            'success': True,
            'text': result['text'],
            'language': result.get('language', 'unknown')
        })
        
    except Exception as e:
        logger.error(f"❌ Translation error: {str(e)}")
        
        # Clean up temp file if it exists
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.unlink(temp_path)
        
        return jsonify({'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """
    Transcribe audio in original language
    Input: audio file
    Output: text in original language
    """
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            audio_file.save(temp_audio.name)
            temp_path = temp_audio.name
        
        logger.info(f"Transcribing audio file: {audio_file.filename}")
        
        # Transcribe (keeps original language)
        result = model.transcribe(temp_path)
        
        # Clean up temp file
        os.unlink(temp_path)
        
        logger.info(f"✅ Transcription complete")
        
        return jsonify({
            'success': True,
            'text': result['text'],
            'language': result.get('language', 'unknown')
        })
        
    except Exception as e:
        logger.error(f"❌ Transcription error: {str(e)}")
        
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.unlink(temp_path)
        
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
