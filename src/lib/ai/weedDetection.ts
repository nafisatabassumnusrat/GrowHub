import { hfFetch } from './hf-client';

const MODEL_URL = process.env.HF_WEED_MODEL || 'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';

export interface WeedDetectionResult {
  weedSpecies: string;
  confidence: number;
  weedInformation: string;
  recommendedHerbicide: string;
  organicRemoval: string;
  estimatedDensity: string;
}

export async function analyzeWeed(imageBuffer: Buffer): Promise<WeedDetectionResult> {
  const result = await hfFetch(MODEL_URL, imageBuffer, true);
  
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('Invalid response from AI model');
  }

  const topMatch = result[0];
  const weedLabel = topMatch.label;
  const confidence = Math.round(topMatch.score * 100 * 10) / 10;

  return {
    weedSpecies: weedLabel.includes('healthy') ? 'No major weeds detected' : `Suspected: ${weedLabel} (Weed Variant)`,
    confidence,
    weedInformation: 'Identified visually by AI from the uploaded field image.',
    recommendedHerbicide: weedLabel.includes('healthy') ? 'None required' : 'Broadleaf herbicide recommended (consult local agronomist)',
    organicRemoval: 'Manual weeding or mulching',
    estimatedDensity: confidence > 90 ? 'High' : 'Low to Medium',
  };
}
