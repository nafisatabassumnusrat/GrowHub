'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Image as ImageIcon, Sparkles, Loader2, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateProductPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // AI Image Moderation Check First!
      setIsProcessingAI(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const modRes = await fetch('/api/ai/moderation', { method: 'POST', body: formData });
        const modData = await modRes.json();
        
        if (!modData.isSafe) {
          toast.error('Image rejected: Contains inappropriate content');
          setIsProcessingAI(false);
          return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));

        // Auto-generate caption
        const capRes = await fetch('/api/ai/caption', { method: 'POST', body: formData });
        const capData = await capRes.json();
        
        if (capData.suggestedName && !title) {
          setTitle(capData.suggestedName);
          toast.success('AI extracted product title from image');
        }
      } catch (err) {
        toast.error('Failed to analyze image with AI');
      } finally {
        setIsProcessingAI(false);
      }
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast('Recording started...');
    } catch (err) {
      toast.error('Microphone access denied');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceToText = async (audioBlob: Blob) => {
    setIsProcessingAI(true);
    toast('Transcribing voice...');
    try {
      const formData = new FormData();
      formData.append('file', audioBlob); // HF whisper takes raw audio
      const res = await fetch('/api/ai/speech', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (data.text) {
        setDescription(prev => (prev ? prev + ' ' + data.text : data.text));
        toast.success('Voice transcribed successfully');
      }
    } catch (err) {
      toast.error('Voice transcription failed');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const generateAIListing = async () => {
    if (!title && !description) {
      toast.error('Provide a basic title or description for the AI to enhance.');
      return;
    }
    
    setIsProcessingAI(true);
    try {
      const prompt = `Write a professional e-commerce product listing for GrowHub (an agriculture marketplace). Current Title: ${title}. Current Info: ${description}. Return output focusing on Title, Product Highlights, Category, and SEO Keywords.`;
      
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiSuggestions(data.text);
      toast.success('AI generated a professional listing');
    } catch (err) {
      toast.error('AI Generation failed');
    } finally {
      setIsProcessingAI(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Create AI Listing</h1>
        <p className="text-muted-foreground">List your agricultural product with the power of AI voice, image captioning, and generation.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-extruded border-none">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Fill in manually or use AI to assist you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden group">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageUpload}
                  disabled={isProcessingAI}
                />
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="h-48 object-contain rounded-md" />
                ) : (
                  <div className="text-center space-y-2 py-8">
                    <ImageIcon className="mx-auto h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                    <div className="text-sm font-medium text-slate-600">Upload product image</div>
                    <p className="text-xs text-muted-foreground">AI will auto-generate a title!</p>
                  </div>
                )}
                {isProcessingAI && !preview && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="E.g., Fresh Organic Tomatoes" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description</Label>
                <Button 
                  type="button" 
                  variant={isRecording ? "destructive" : "secondary"} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  disabled={isProcessingAI}
                >
                  {isRecording ? <StopCircle className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1" />}
                  {isRecording ? 'Stop Recording' : 'Voice Typing'}
                </Button>
              </div>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="Describe your product..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full shadow-extruded" 
              onClick={generateAIListing}
              disabled={isProcessingAI || (!title && !description)}
            >
              <Sparkles className="w-4 h-4 mr-2" /> Enhance with AI
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-extruded border-none h-full bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> AI Generated Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiSuggestions ? (
                <div className="prose prose-sm max-w-none text-slate-700">
                  <pre className="whitespace-pre-wrap font-sans text-sm">{aiSuggestions}</pre>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                  <p>Click "Enhance with AI" to generate a professional product description, SEO keywords, and category suggestions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
