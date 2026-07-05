import { hfFetch } from './hf-client';

const MODEL_URL = process.env.HF_TRANSLATION || 'https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M';

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  // NLLB language codes: Bengali is 'ben_Beng', English is 'eng_Latn'
  const src = sourceLang === 'bn' ? 'ben_Beng' : 'eng_Latn';
  const tgt = targetLang === 'en' ? 'eng_Latn' : 'ben_Beng';

  const payload = {
    inputs: text,
    parameters: {
      src_lang: src,
      tgt_lang: tgt
    }
  };

  const result = await hfFetch(MODEL_URL, payload);
  
  if (Array.isArray(result) && result[0]?.translation_text) {
    return result[0].translation_text;
  }
  
  throw new Error('Failed to translate text');
}
