import { hfFetch } from './hf-client';

const MODEL_URL = process.env.HF_MODERATION || 'https://api-inference.huggingface.co/models/Falconsai/nsfw_image_detection';

export interface ModerationResult {
  isSafe: boolean;
  score: number;
}

export async function moderateImage(imageBuffer: Buffer): Promise<ModerationResult> {
  const result = await hfFetch(MODEL_URL, imageBuffer, true);
  
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('Invalid response from AI model');
  }

  // Find the 'nsfw' label score
  const nsfwLabel = result.find((l: any) => l.label.toLowerCase() === 'nsfw');
  const score = nsfwLabel ? nsfwLabel.score : 0;

  // Threshold of 0.6 for NSFW classification
  const isSafe = score < 0.6;

  return {
    isSafe,
    score
  };
}
