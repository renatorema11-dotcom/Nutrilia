"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Camera, Sparkles, X, Info, Trash2 } from "lucide-react";
import Markdown from "react-markdown";

type Message = {
  role: "user" | "model";
  content: string;
  images?: string[];
  timestamp: Date;
};

const SUGGESTIONS = [
  "Dicas para emagrecimento",
  "Receita rápida e saudável",
  "Quantidade ideal de água",
  "Como evitar doces?",
  "O que comer pré-treino?"
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Olá! Sou a Nutrilia AI, sua assistente pessoal de saúde. Como posso te ajudar com sua alimentação ou rotina hoje?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [photos, setPhotos] = useState<{
    top?: string;
    left?: string;
    right?: string;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, position: 'top' | 'left' | 'right') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => ({ ...prev, [position]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (position: 'top' | 'left' | 'right') => {
    setPhotos(prev => {
      const next = { ...prev };
      delete next[position];
      return next;
    });
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = typeof messageText === 'string' ? messageText : input;
    const hasPhotos = photos.top && photos.left && photos.right;
    
    if ((!textToSend.trim() && !hasPhotos) || isLoading) return;

    const userMessage = textToSend.trim() || "Analise este prato para mim, por favor.";
    const currentPhotos = hasPhotos ? [photos.top!, photos.left!, photos.right!] : [];
    
    if (typeof messageText !== 'string') setInput("");
    
    setMessages(prev => [...prev, { 
      role: "user", 
      content: userMessage,
      images: currentPhotos.length > 0 ? currentPhotos : undefined,
      timestamp: new Date()
    }]);
    
    setIsLoading(true);
    setIsAnalysisMode(false);
    setPhotos({});

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.concat({
            role: "user",
            content: userMessage,
            timestamp: new Date()
          }),
          photos: currentPhotos,
          userProfile: user,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na requisição ao servidor.");
      }

      const data = await response.json();
      const text = data.text || "Desculpe, não consegui gerar uma resposta no momento.";
      setMessages(prev => [...prev, { role: "model", content: text, timestamp: new Date() }]);
    } catch (error) {
      console.error("Erro ao gerar resposta:", error);
      setMessages(prev => [...prev, { role: "model", content: "Ops! Tive um pequeno problema técnico. Pode tentar perguntar novamente?", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Chat IA</h1>
            <p className="text-sm text-slate-500">Tire suas dúvidas sobre nutrição a qualquer momento.</p>
          </div>
        </div>
        <Button 
          variant={isAnalysisMode ? "secondary" : "outline"}
          className={`gap-2 rounded-xl transition-all ${isAnalysisMode ? 'bg-indigo-100 text-indigo-700' : 'hover:border-indigo-200 hover:text-indigo-600'}`}
          onClick={() => setIsAnalysisMode(!isAnalysisMode)}
        >
          <Camera className="h-4 w-4" />
          {isAnalysisMode ? "Fechar Analisador" : "Analisar Prato"}
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-indigo-100 shadow-sm relative">
        <CardContent className="flex-1 p-4 overflow-y-auto space-y-6 custom-scrollbar">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-indigo-600 text-white"}`}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div 
                className={`p-4 rounded-2xl shadow-sm transition-all ${
                  msg.role === "user" 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                }`}
              >
                {msg.images && (
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                    {msg.images.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 shrink-0">
                        <img src={img} alt="Refeição" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                <div className={`text-sm leading-relaxed ${msg.role === "model" ? "prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:text-slate-900 prose-table:border prose-table:rounded-lg overflow-hidden" : ""}`}>
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <Markdown>{msg.content}</Markdown>
                  )}
                </div>
                <div className={`text-[10px] mt-2 opacity-60 font-medium ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-none flex items-center gap-2 shadow-sm">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
                <span className="text-xs text-indigo-400 font-medium">Nutrilia {isAnalysisMode ? "analisando seu prato..." : "pensando..."}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Analysis Mode Overlay */}
        {isAnalysisMode && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-indigo-100 p-6 animate-in slide-in-from-bottom-full transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800">Cálculo de Calorias por Foto</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAnalysisMode(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-xs text-slate-500 mb-6 flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-400" />
              Carregue as 3 fotos solicitadas para que a IA calcule o volume e as calorias.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'top', label: 'Cima' },
                { id: 'left', label: 'Esquerda' },
                { id: 'right', label: 'Direita' }
              ].map((pos) => (
                <div key={pos.id} className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase text-center block">{pos.label}</span>
                  <label className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all aspect-square ${
                    photos[pos.id as keyof typeof photos] ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}>
                    {photos[pos.id as keyof typeof photos] ? (
                      <>
                        <img src={photos[pos.id as keyof typeof photos]} alt={`Vista de ${pos.label}`} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                        <button 
                          onClick={(e) => { e.preventDefault(); removePhoto(pos.id as any); }}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-2">
                        <Camera className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                        <span className="text-[10px] font-bold text-slate-500">Adicionar</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, pos.id as any)} />
                  </label>
                </div>
              ))}
            </div>

            <Button 
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-indigo-100"
              disabled={!photos.top || !photos.left || !photos.right || isLoading}
              onClick={() => handleSend("Fiz estas fotos do meu prato. Você pode identificar o que estou comendo e calcular as calorias e macronutrientes?")}
            >
              Começar Análise 🚀
            </Button>
          </div>
        )}
        
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          {!isLoading && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onFormSubmit} className="flex gap-2 max-w-3xl mx-auto relative group">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isAnalysisMode ? "As fotos foram carregadas..." : "Digite sua dúvida aqui..."}
              className="flex-1 h-12 rounded-2xl border-slate-200 bg-white pr-12 focus-visible:ring-indigo-500 shadow-sm"
              disabled={isLoading || isAnalysisMode}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-1 top-1 h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-2">Sua assistente Nutrilia IA está aqui para te inspirar e guiar!</p>
        </div>
      </Card>
    </div>
  );
}
