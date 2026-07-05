/**
 * AI Assistant using Qwen2.5-7B-Instruct via HF OpenAI-compatible Router
 * Uses https://router.huggingface.co/v1 which auto-selects the best inference provider
 */

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = 'Qwen/Qwen2.5-7B-Instruct';
// Use the generic HF router (auto picks the supported provider for the model)
const ENDPOINT = 'https://router.huggingface.co/v1/chat/completions';

export async function askAssistant(prompt: string): Promise<string> {
  if (!HF_TOKEN) throw new Error('Missing HF_TOKEN environment variable');

  const payload = {
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a professional agricultural and fisheries AI assistant for GrowHub, a hyperlocal platform in Bangladesh. Provide concise, expert, and actionable advice about farming, crop diseases, fish farming, local market prices, and weather impacts. Keep responses clear and practical for farmers and fishermen.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 600,
    temperature: 0.7,
  };

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`Assistant API Error (${response.status}):`, errText);
    throw new Error(`AI Assistant failed: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No response content from model');
  return text.trim();
}
