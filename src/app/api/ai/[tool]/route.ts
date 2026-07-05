import { NextRequest, NextResponse } from 'next/server';
import { analyzePlantDisease } from '@/lib/ai/plantDisease';
import { analyzeWeed } from '@/lib/ai/weedDetection';
import { analyzeFishDisease } from '@/lib/ai/fishDisease';
import { analyzeFishSpecies } from '@/lib/ai/fishSpecies';
import { askAssistant } from '@/lib/ai/assistant';
import { generateCaption } from '@/lib/ai/caption';
import { convertSpeechToText } from '@/lib/ai/speech';
import { translateText } from '@/lib/ai/translation';
import { moderateImage } from '@/lib/ai/moderation';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    const { tool } = await params;
    
    // For tools expecting an image/audio upload (multipart/form-data)
    if (['plant-disease', 'weed-detection', 'fish-disease', 'fish-species', 'caption', 'speech', 'moderation'].includes(tool)) {
      const formData = await request.formData();
      const file = formData.get('file') as File; // Frontend should send as 'file'
      
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      let result;
      switch (tool) {
        case 'plant-disease':
          result = await analyzePlantDisease(buffer);
          break;
        case 'weed-detection':
          result = await analyzeWeed(buffer);
          break;
        case 'fish-disease':
          result = await analyzeFishDisease(buffer);
          break;
        case 'fish-species':
          result = await analyzeFishSpecies(buffer);
          break;
        case 'caption':
          result = await generateCaption(buffer);
          break;
        case 'speech':
          result = { text: await convertSpeechToText(buffer) };
          break;
        case 'moderation':
          result = await moderateImage(buffer);
          break;
      }
      return NextResponse.json(result);
    }
    
    // For text-based tools (JSON payload)
    if (tool === 'assistant' || tool === 'translation') {
      const body = await request.json();
      
      if (tool === 'assistant') {
        if (!body.prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        const text = await askAssistant(body.prompt);
        return NextResponse.json({ text });
      }
      
      if (tool === 'translation') {
        if (!body.text || !body.sourceLang || !body.targetLang) {
          return NextResponse.json({ error: 'Missing translation parameters' }, { status: 400 });
        }
        const text = await translateText(body.text, body.sourceLang, body.targetLang);
        return NextResponse.json({ text });
      }
    }

    return NextResponse.json({ error: 'Unknown tool' }, { status: 404 });

  } catch (error: any) {
    console.error(`AI API Error [${await params.then(p => p.tool)}]:`, error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing AI request' },
      { status: 500 }
    );
  }
}
