'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, CheckCircle2, AlertTriangle, Loader2, RefreshCw, Clock, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface AiToolClientProps {
  tool: string;
}

const toolConfig: Record<string, { title: string; desc: string; api: string }> = {
  'plant-disease': {
    title: 'Plant Disease Detection',
    desc: 'Upload a picture of a plant leaf to detect diseases and get treatment recommendations.',
    api: '/api/ai/plant-disease',
  },
  'weed-detection': {
    title: 'Weed Detection',
    desc: 'Upload an image of your farm to detect weeds and get herbicide recommendations.',
    api: '/api/ai/weed-detection',
  },
  'fish-disease': {
    title: 'Fish Disease Detection',
    desc: 'Upload an image of a fish to detect common diseases and severity.',
    api: '/api/ai/fish-disease',
  },
  'fish-species': {
    title: 'Fish Species Recognition',
    desc: 'Upload an image of a fish to identify its species, scientific name, and market value.',
    api: '/api/ai/fish-species',
  },
};

export default function AiToolClient({ tool }: AiToolClientProps) {
  const config = toolConfig[tool] || { title: 'AI Tool', desc: 'Upload an image.', api: '' };
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<{ id: string, image: string, result: any, date: Date }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selected: File) => {
    if (!selected.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null); 
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(config.api, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to analyze image');
      }
      
      const data = await res.json();
      setResult(data);
      setHistory(prev => [{
        id: Math.random().toString(36).substring(7),
        image: preview!,
        result: data,
        date: new Date()
      }, ...prev]);
      
      toast.success('AI Analysis complete');
      
    } catch (error: any) {
      console.error(error);
      toast.error(`Analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight font-display">{config.title}</h1>
        <p className="text-muted-foreground">{config.desc}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-none shadow-extruded overflow-hidden bg-background">
            <CardHeader className="bg-slate-50/50 border-b border-border/40">
              <CardTitle className="text-lg flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" />
                Upload Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {!preview ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Drag & drop an image</h3>
                    <p className="text-sm text-muted-foreground">or click to browse from your device</p>
                    <p className="text-xs text-muted-foreground mt-4">JPG, PNG up to 10MB</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-2xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                    {!loading && !result && (
                      <button 
                        onClick={reset}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {loading && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Loader2 className="h-10 w-10 animate-spin mb-4" />
                        <p className="font-bold tracking-wider animate-pulse">AI PROCESSING...</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              {result ? (
                <Button className="w-full h-12 text-md font-bold rounded-xl" onClick={reset} variant="outline">
                  <RefreshCw className="mr-2 h-5 w-5" /> Analyze Another Image
                </Button>
              ) : (
                <Button 
                  className="w-full h-12 text-md font-bold rounded-xl shadow-extruded"
                  disabled={!file || loading}
                  onClick={analyzeImage}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {loading ? 'Analyzing...' : 'Run AI Analysis'}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-none shadow-extruded bg-background overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 text-green-600 rounded-full">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(result).map(([key, value]) => {
                      if (key === 'confidence') return null; // Handled separately
                      return (
                        <div key={key} className="space-y-1">
                          <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-semibold text-foreground text-sm leading-relaxed">
                            {String(value)}
                          </p>
                        </div>
                      );
                    })}
                    
                    {result.confidence && (
                      <div className="pt-4 border-t border-border/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-muted-foreground">AI Confidence</span>
                          <span className="text-sm font-black text-primary">{result.confidence}%</span>
                        </div>
                        <Progress value={result.confidence} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400"
              >
                <AlertTriangle className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="font-bold text-lg text-slate-500">No Results Yet</h3>
                <p className="text-sm mt-2">Upload an image and run the analysis to see the AI predictions here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {history.length > 0 && (
        <div className="pt-12">
          <h3 className="text-lg font-bold font-display flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5" /> Recent Scans
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {history.map(item => (
              <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-sm border bg-background aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="History" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                  <p className="text-white text-xs font-bold truncate">
                    {item.result.disease || item.result.species || item.result.weedSpecies || 'Detected'}
                  </p>
                  <p className="text-white/70 text-[10px]">{item.date.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
