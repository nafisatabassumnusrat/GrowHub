import { hfFetch } from './hf-client';

const MODEL_URL = process.env.HF_PLANT_MODEL || 'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';

export interface PlantDiseaseResult {
  disease: string;
  confidence: number;
  severity: string;
  symptoms: string;
  treatment: string;
  prevention: string;
}

export async function analyzePlantDisease(imageBuffer: Buffer): Promise<PlantDiseaseResult> {
  const result = await hfFetch(MODEL_URL, imageBuffer, true);
  
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('Invalid response from AI model');
  }

  // The model returns an array of { label: string, score: number }
  const topMatch = result[0];
  const diseaseLabel = topMatch.label;
  const confidence = Math.round(topMatch.score * 100 * 10) / 10;

  let severity = 'Medium';
  if (diseaseLabel.toLowerCase().includes('healthy')) severity = 'None';
  else if (confidence > 90) severity = 'High';

  // For prototype, we generate static treatment advice based on the label. 
  // In a fully developed app, this would query a plant database using the label.
  return {
    disease: diseaseLabel,
    confidence,
    severity,
    symptoms: 'Identified visually by AI from the uploaded image.',
    treatment: diseaseLabel.toLowerCase().includes('healthy') 
      ? 'No treatment needed. Maintain current care.' 
      : 'Consult local agricultural guidelines for this specific disease. Consider applying appropriate fungicides or removing affected leaves.',
    prevention: 'Ensure proper watering, sunlight, and soil nutrition. Monitor regularly.',
  };
}
