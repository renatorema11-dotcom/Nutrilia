"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Bot, Mic, X, Loader2, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "bot";
  content: string;
}

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NutriliaAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [jarvisMode, setJarvisMode] = useState(false);
  const wakeWordRecognitionRef = useRef<any>(null);
  const jarvisModeRef = useRef<boolean>(jarvisMode);

  const handleJarvisToggle = async (checked: boolean) => {
    if (checked) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
           stream.getTracks().forEach(track => track.stop());
        }
        setJarvisMode(true);
      } catch (err: any) {
        console.warn("Microphone permission/device error:", err);
        if (err.name === 'NotFoundError' || err.message?.includes('device not found')) {
            alert("Nenhum microfone foi detectado. Por favor, conecte um microfone ou verifique suas configurações de hardware para usar o Modo Jarvis.");
        } else {
            alert("Permissão de microfone negada. Verifique as configurações do seu navegador para usar o Modo Jarvis.");
        }
        setJarvisMode(false);
      }
    } else {
      setJarvisMode(false);
    }
  };

  useEffect(() => {
    jarvisModeRef.current = jarvisMode;
  }, [jarvisMode]);

  useEffect(() => {
    // Continuous wake-word recognition setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // Only run wake word if Jarvis mode is on AND we are not currently listening actively for a command
    if (SpeechRecognition && jarvisMode && !isListening) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        let newTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                newTranscript += event.results[i][0].transcript + " ";
            }
        }
        const transcript = newTranscript.trim().toLowerCase();
        
        if (!transcript) return;
        
        if (transcript.includes('nutrília') || transcript.includes('nutrilia') || transcript.includes('notori') || transcript.includes('nutre')) {
           // Wake word detected!
           setIsOpen(true);
           
           // Extract command if there is anything after wake word
           let command = transcript.replace(/.*(nutrília|nutrilia|notori|nutre)\s*/, '');
           if (command.trim().length > 3) {
                // If there's an immediate command, process it
                setInput(command);
                handleSendVoice(command);
           } else {
               // Otherwise, just wake up and greet with Jarvis flair
               const greetings = ["Ao seu dispor.", "Sim, chefe?", "Sempre apostos, doutor.", "Pois não?"];
               const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
               speak(randomGreeting);
               
               // Start listening immediately
               if (!isListening) {
                   setTimeout(() => toggleListen(), 600); // short delay to let voice start
               }
           }
        }
      };

      recognition.onend = () => {
         // Auto-restart if Jarvis mode is still on
         if (jarvisModeRef.current && !isListening) {
             try { wakeWordRecognitionRef.current?.start(); } catch(e) {}
         }
      };
      
      recognition.onerror = (event: any) => {
        console.warn("Wake word error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            jarvisModeRef.current = false;
            setJarvisMode(false); // Disable Jarvis mode if permission denied
        }
        // Let onend handle the restart
      };

      wakeWordRecognitionRef.current = recognition;
      try { recognition.start(); } catch(e) {}
    }

    return () => {
       if (wakeWordRecognitionRef.current) {
           wakeWordRecognitionRef.current.onend = null;
           wakeWordRecognitionRef.current.stop();
       }
    };
  }, [jarvisMode, isListening]); // we might pause wake word if widget is actively listening

  useEffect(() => {
    // Normal speech recognition for the widget
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendVoice(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdowns and special chars roughly for speech
      const cleanText = text.replace(/[*#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      
      const voices = window.speechSynthesis.getVoices();
      // Look for natural sounding Google/Premium voices in PT-BR
      const ptVoices = voices.filter(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
      const premiumVoice = ptVoices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Luciana') || 
        v.name.includes('Isabela') || 
        v.name.includes('Premium') ||
        v.name.includes('Natural')
      );
      
      if (premiumVoice) {
        utterance.voice = premiumVoice;
      } else if (ptVoices.length > 0) {
        utterance.voice = ptVoices[0];
      }
      
      const voiceTone = user?.preferences?.voiceTone || "Feminino Calmo";
      let rate = 1.05; // Slightly faster for AI feel
      let pitch = 1.0;

      if (voiceTone === "Feminino Empático") {
        rate = 1.0; pitch = 1.1;
      } else if (voiceTone === "Feminino Dinâmico") {
        rate = 1.15; pitch = 1.15;
      } else if (voiceTone === "Feminino Suave") {
        rate = 1.0; pitch = 1.05;
      } else if (voiceTone === "Masculino Calmo") {
        rate = 1.0; pitch = 0.8;
      } else if (voiceTone === "Masculino Motivador") {
        rate = 1.15; pitch = 0.9;
      } else if (voiceTone === "Robótico") {
        rate = 1.0; pitch = 0.5;
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
          setIsSpeaking(false);
          // If Jarvis mode is on, automatically keep listening for follow-ups
          if (jarvisModeRef.current && !isListening) {
             setTimeout(() => {
                 if (recognitionRef.current) {
                     setIsListening(true);
                     try { recognitionRef.current.start(); } catch(e) {}
                 }
             }, 300);
          }
      };
      utterance.onerror = () => setIsSpeaking(false);
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Preload voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Chrome needs this to load voices sometimes
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
         window.speechSynthesis.getVoices();
      };
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = `Olá, Dr. ${user?.name?.split(' ')[0] || "Nutricionista"}! Sou a Nutrilia, sua assistente pessoal.\nEstou acompanhando sua agenda. No que posso ajudar?`;
      setMessages([
        { role: "bot", content: initialGreeting }
      ]);
      speak(initialGreeting);
    }
  }, [isOpen, messages.length, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendVoice = async (text: string) => {
    if (!text.trim()) return;
    processMessage(text);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    processMessage(input);
  };

  const processMessage = async (userText: string) => {
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setInput("");
    setIsTyping(true);

    try {
      const mockAgenda = [
         { time: "14:00", patient: "Carlos Ferreira", status: "Confirmado e pago via PIX" },
         { time: "20:00", patient: "Maria Silva", status: "Confirmado presencialmente" },
      ];
      
      const now = new Date();
      const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' de ' + now.toLocaleDateString('pt-BR');

      const response = await fetch('/api/nutrilia-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userText }],
          currentTime,
          mockAgenda,
          voiceTone: user?.preferences?.voiceTone || "Feminino Calmo"
        })
      });

      const data = await response.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { role: "bot", content: data.text }]);
        speak(data.spoken || data.text);
      } else {
        throw new Error("No text response");
      }
    } catch (error) {
      const errorMsg = "Desculpe, tive um problema de conexão com meus servidores.";
      setMessages(prev => [...prev, { role: "bot", content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListen = async () => {
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    } else {
        setInput("");
        
        if (recognitionRef.current) {
            setIsListening(true);
            try {
               recognitionRef.current.start();
            } catch(e) {
               console.warn("Microphone in use or error:", e);
               setIsListening(false);
               alert("Erro ao iniciar microfone. Verifique se outro aplicativo está usando-o.");
            }
        } else {
            alert("Seu navegador não suporta reconhecimento de voz nativo.");
        }
    }
  };

  const handleGlobalMicClick = () => {
    if (!isOpen) {
        setIsOpen(true);
        // Wait for widget to open and then start listening
        setTimeout(() => {
            if (!isListening) toggleListen();
        }, 500);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex gap-2 items-center">
        {!isOpen && (
          <Button 
            onClick={handleGlobalMicClick}
            className="h-16 w-16 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center group relative"
          >
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
            <Mic className="h-7 w-7 group-hover:scale-110 transition-transform text-white" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[550px] shadow-2xl flex flex-col z-50 overflow-hidden border-slate-200 animate-in slide-in-from-bottom-5">
          <CardHeader className="bg-slate-900 text-white px-4 py-3 pb-4 flex flex-row items-center justify-between shrink-0 rounded-t-xl rounded-b-none items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                 <div className={`absolute inset-0 bg-purple-500 rounded-full blur-sm ${isSpeaking ? 'animate-ping opacity-40' : 'animate-pulse'}`}></div>
                 <div className="h-10 w-10 bg-slate-800 border-2 border-purple-500 rounded-full flex items-center justify-center relative z-10 overflow-hidden">
                    {isSpeaking ? (
                      <div className="flex items-end gap-0.5 h-3 justify-center w-full">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: ["4px", "12px", "4px"] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut",
                            }}
                            className="w-1 bg-purple-300 rounded-full"
                          />
                        ))}
                      </div>
                    ) : (
                      <Sparkles className="h-5 w-5 text-purple-300" />
                    )}
                 </div>
              </div>
              <div>
                <CardTitle className="text-base font-display">Nutrilia (IA)</CardTitle>
                <div className="text-xs text-slate-300 flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${isSpeaking ? 'bg-purple-500 animate-pulse' : 'bg-emerald-400 animate-pulse'}`}></span>
                  {isSpeaking ? 'Falando...' : 'Sua Assistente Pessoal'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 mr-2">
                 <Label htmlFor="jarvis-mode" className="text-[10px] uppercase text-purple-300 font-bold tracking-wider cursor-pointer">
                    Modo Jarvis
                 </Label>
                 <Switch 
                   id="jarvis-mode" 
                   checked={jarvisMode} 
                   onCheckedChange={handleJarvisToggle}
                   className="data-[state=checked]:bg-purple-500 scale-75 origin-right"
                 />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white hover:bg-slate-800 -mr-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            <div className="text-center text-xs text-slate-400 mb-2">Conexão Segura Estabelecida</div>
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mr-2 shrink-0 mt-1">
                     <Bot className="h-3 w-3 text-purple-400" />
                  </div>
                )}
                <div 
                  className={`max-w-[80%] p-3 text-sm rounded-2xl whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <div className="prose prose-sm prose-p:leading-relaxed prose-slate max-w-none">
                    <ReactMarkdown>
                     {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mr-2 shrink-0">
                     <Bot className="h-3 w-3 text-purple-400" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
             {isListening && (
                 <div className="text-center mb-2 animate-pulse text-purple-600 text-xs font-semibold flex items-center justify-center gap-2">
                     <Volume2 className="h-3 w-3" />
                     Ouvindo... (Fale agora)
                 </div>
             )}
             <div className="flex items-center gap-2">
                <Button 
                   variant={isListening ? "default" : "outline"} 
                   size="icon" 
                   className={`shrink-0 rounded-full transition-all ${isListening ? "bg-purple-600 hover:bg-purple-700 shadow-md scale-110" : ""}`}
                   onClick={toggleListen}
                >
                   <Mic className={`h-4 w-4 ${isListening ? "text-white" : ""}`} />
                </Button>
                <Input 
                  placeholder="Peça algo à Nutrilia..." 
                  className="flex-1 rounded-full bg-slate-50" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} size="sm" className="rounded-full bg-slate-900 px-4">
                  Enviar
                </Button>
             </div>
          </div>
        </Card>
      )}
    </>
  );
}
