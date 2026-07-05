'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiAssistantPage() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI Agriculture Assistant. How can I help you today? You can ask me about crop diseases, best farming practices, or seasonal recommendations in Bengali or English.',
      timestamp: new Date()
    }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.text || 'Sorry, I could not process that request.',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to communicate with AI Assistant.');
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  const handleRegenerate = (id: string) => {
    // Find the last user message before this assistant message
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex <= 0) return;
    
    // Simple regeneration: just resend the last user message
    let lastUserMsg = null;
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMsg = messages[i].content;
        break;
      }
    }
    
    if (lastUserMsg) {
      handleSend(lastUserMsg);
    }
  };

  const suggestedQuestions = [
    "My tomato leaves have yellow spots.",
    "What fertilizer should I use for rice?",
    "How can I increase fish production?",
    "Best time to plant cauliflower?"
  ];

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col animate-in fade-in duration-500 pb-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-display text-foreground tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Bot className="h-8 w-8 text-primary" /> 
            </div>
            AI Agriculture Assistant
          </h2>
          <p className="text-muted-foreground font-medium mt-2">Get expert farming & fisheries advice powered by Qwen 2.5</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {suggestedQuestions.slice(0,2).map((q, i) => (
            <button 
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-full whitespace-nowrap transition-colors font-medium border border-slate-200 shadow-sm"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      <Card className="flex-1 flex flex-col bg-background shadow-extruded border border-border/50 rounded-3xl overflow-hidden relative">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-10 w-10 shrink-0 border border-border/50 shadow-sm">
                {msg.role === 'assistant' ? (
                  <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-5 w-5" /></AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-primary text-primary-foreground"><User className="h-5 w-5" /></AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'assistant' 
                    ? 'bg-slate-50 border border-slate-100 rounded-tl-sm shadow-sm' 
                    : 'bg-primary text-primary-foreground shadow-md rounded-tr-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm md:prose-base prose-slate max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
                
                {msg.role === 'assistant' && msg.id !== '1' && (
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
                    >
                      {copiedId === msg.id ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                    <button 
                      onClick={() => handleRegenerate(msg.id)}
                      className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0 border border-border/50 shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-5 w-5" /></AvatarFallback>
              </Avatar>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[52px]">
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 bg-slate-50/50 border-t border-border/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex w-full gap-2 relative"
          >
            <Input 
              placeholder="Ask a question about agriculture or fisheries..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-background shadow-sm border-slate-200 rounded-2xl px-6 h-14 pr-16 text-md"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-2 top-2 rounded-xl shadow-md h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform active:scale-95"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
