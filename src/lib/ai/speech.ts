import { hfFetch } from './hf-client';

const MODEL_URL = process.env.HF_SPEECH || 'https://api-inference.huggingface.co/models/openai/whisper-large-v3';

export async function convertSpeechToText(audioBuffer: Buffer): Promise<string> {
  // Hugging Face ASR endpoints take the raw audio buffer (e.g., FLAC, WAV, MP3)
  const result = await hfFetch(MODEL_URL, audioBuffer, true);
  
  if (result && result.text) {
    return result.text;
  }
  
  throw new Error('Failed to transcribe audio');
}
