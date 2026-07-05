import { hfFetch } from './hf-client';

const MODEL_URL = process.env.HF_CAPTION || 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large';

export async function generateCaption(imageBuffer: Buffer): Promise<{ caption: string; suggestedName: string }> {
  const result = await hfFetch(MODEL_URL, imageBuffer, true);
  
  let captionText = 'A product image';
  if (Array.isArray(result) && result[0]?.generated_text) {
    captionText = result[0].generated_text;
  }

  // Capitalize first letter
  captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1);
  
  // Basic heuristic for a suggested product name
  const words = captionText.split(' ');
  const suggestedName = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');

  return {
    caption: captionText,
    suggestedName
  };
}
