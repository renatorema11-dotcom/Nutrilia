"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  MoreVertical, 
  User as UserIcon, 
  FileText, 
  Image as ImageIcon,
  Check,
  CheckCheck,
  Clock,
  Video,
  Phone,
  Mic,
  MicOff,
  VideoOff,
  XCircle,
  Maximize2
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, writeBatch } from "firebase/firestore";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  status: "sending" | "sent" | "delivered" | "read";
  file?: {
    name: string;
    type: string;
    size: string;
    url: string;
  };
}

const professionalsData: Record<string, any> = {
  "1": { name: "Dr. Especialista 1", specialty: "Nutrição Comportamental" },
  "2": { name: "Dr. Especialista 2", specialty: "Nutrição Esportiva" },
  "3": { name: "Dra. Especialista 3", specialty: "Nutrição Clínica" }
};

export default function ProfessionalChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const professional = professionalsData[id] || professionalsData["1"];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("video") === "true") {
      setIsVideoCallActive(true);
    }
  }, [searchParams]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video stream logic
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (isVideoCallActive && isCamOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoCallActive, isCamOn]);

  // Load message history from Firestore
  useEffect(() => {
    if (user?.email && id) {
      const chatId = `${user.email}_${id}`.replace(/[@.]/g, "_");
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        
        setMessages(msgs);

        // Mark incoming messages as read
        const batch = writeBatch(db);
        let hasUnread = false;
        
        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data() as Message;
          if (data.receiverId === user.email && data.status !== "read") {
            batch.update(docSnap.ref, { status: "read" });
            hasUnread = true;
          }
        });

        if (hasUnread) {
          batch.commit().catch(err => console.error("Error marking messages as read:", err));
        }

        // Initialize chat with a welcome message if empty
        if (msgs.length === 0) {
          const initialMessage = {
            senderId: id,
            receiverId: user.email,
            text: `Olá ${user.name.split(' ')[0]}! Como posso te ajudar hoje?`,
            timestamp: Date.now() - 3600000,
            status: "read",
          };
          // We don't write it to DB locally because user is not senderId (security rules will reject).
          // Just set it to local state to not break the UI.
          setMessages([{ ...initialMessage, id: "initial_1" } as Message]);
        }

      }, (error) => {
        console.error("Firestore Error:", JSON.stringify({
          error: error.message,
          operationType: "list",
          path: `chats/${chatId}/messages`,
          authInfo: { email: user.email }
        }));
      });
      return () => unsubscribe();
    }
  }, [user, id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() && !isUploading) return;

    if (user?.email && id) {
      const chatId = `${user.email}_${id}`.replace(/[@.]/g, "_");
      const messageText = inputText;
      
      // Clear input optimistically
      setInputText("");

      const newMessageData = {
        senderId: user.email,
        receiverId: id,
        text: messageText,
        timestamp: Date.now(),
        status: "sent" as const,
      };

      try {
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        await addDoc(messagesRef, newMessageData);

        // Optional: Simulate professional replying
        setTimeout(async () => {
          // Because of security rules, user cannot write on behalf of professional.
          // Usually, you'd trigger a Cloud Function here to reply, 
          // or just show an optimistic UI effect. Since this is an AI Studio demo,
          // we are just pretending the professional replied via Firestore from "admin". 
          // However, our rules strictly check incoming().senderId == request.auth.token.email.
          // To bypass without functions, we can temporarily allow it in rules or just leave it.
          // Let's just rely on real users or keep the demo minimal.
        }, 2000);
      } catch (error: any) {
        console.error("Send Message Error:", error);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const chatId = `${user.email}_${id}`.replace(/[@.]/g, "_");

      const newMessageData = {
        senderId: user.email,
        receiverId: id,
        text: `Enviou um arquivo: ${file.name}`,
        timestamp: Date.now(),
        status: "sent" as const,
        file: {
          name: file.name,
          type: file.type,
          size: (file.size / 1024).toFixed(1) + " KB",
          url: base64,
        }
      };

      try {
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        await addDoc(messagesRef, newMessageData);
      } catch (error) {
        console.error("Upload Error:", error);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="text-slate-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 relative">
                <Image 
                  src={`https://picsum.photos/seed/doc${id}/100`} 
                  alt={professional.name} 
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none">{professional.name}</h1>
              <p className="text-xs text-emerald-600 mt-1">{professional.specialty} • Online</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-emerald-600"
            onClick={() => setIsVideoCallActive(true)}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm">
        <CardContent 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" 
          ref={scrollRef}
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.email;
            return (
              <div 
                key={msg.id} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`p-3 rounded-2xl shadow-sm ${
                      isMe 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {msg.file ? (
                      <div className="flex items-center gap-3 p-1">
                        <div className={`p-2 rounded-lg ${isMe ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                          {msg.file.type.startsWith('image/') ? (
                             <ImageIcon className={`h-6 w-6 ${isMe ? 'text-white' : 'text-slate-500'}`} />
                          ) : (
                             <FileText className={`h-6 w-6 ${isMe ? 'text-white' : 'text-slate-500'}`} />
                          )}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-semibold truncate max-w-[150px] ${isMe ? 'text-white' : 'text-slate-900'}`}>
                            {msg.file.name}
                          </p>
                          <p className={`text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-500'}`}>
                            {msg.file.size}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>
                    {isMe && (
                      <span className="text-slate-400">
                        {msg.status === "sent" && <Check className="h-3 w-3" />}
                        {msg.status === "delivered" && <CheckCheck className="h-3 w-3" />}
                        {msg.status === "read" && <CheckCheck className="h-3 w-3 text-emerald-500" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex-1 flex flex-col gap-2">
              <div className="relative group">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  className="pl-4 pr-12 py-6 rounded-2xl border-slate-200 focus-visible:ring-emerald-500 bg-slate-50 focus:bg-white transition-all"
                  disabled={isUploading}
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple={false}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="h-12 w-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all active:scale-95"
              disabled={(!inputText.trim() && !isUploading) || isUploading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Sua conversa é protegida e privativa. Compartilhe exames e dúvidas com segurança.
          </p>
        </div>
      </Card>

      {/* Video Call Overlay */}
      <AnimatePresence>
        {isVideoCallActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              ...(isMinimized ? {
                width: 300,
                height: 200,
                bottom: 20,
                right: 20,
                top: 'auto',
                left: 'auto',
                position: 'fixed'
              } : {
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                position: 'fixed'
              })
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`z-50 bg-slate-900 overflow-hidden shadow-2xl transition-all duration-300 ${
              isMinimized ? 'rounded-2xl border-2 border-emerald-500' : 'rounded-none'
            }`}
          >
            {/* Background Video (Professional - Dummy) */}
            {!isMinimized && (
              <div className="absolute inset-0 z-0">
                <Image 
                  src={`https://picsum.photos/seed/doc${id}/1280/720`} 
                  alt="Professional" 
                  fill
                  className="object-cover opacity-60 blur-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
              </div>
            )}

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col p-6">
              {/* Header */}
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <Image 
                      src={`https://picsum.photos/seed/doc${id}/100`} 
                      alt="Professional" 
                      width={40}
                      height={40}
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {!isMinimized && (
                    <div>
                      <h3 className="font-bold">{professional.name}</h3>
                      <p className="text-xs text-emerald-400">Em consulta • 04:12</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-5 w-5" /> : <motion.div animate={{ rotate: 180 }}><ArrowLeft className="h-5 w-5" /></motion.div>}
                  </Button>
                </div>
              </div>

              {/* Main Video Stage */}
              {!isMinimized && (
                <div className="flex-1 flex flex-col items-center justify-center">
                   <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-slate-800 shadow-2xl border border-white/10">
                      <Image 
                        src={`https://picsum.photos/seed/doc${id}/800/450`} 
                        alt="Professional stream" 
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Self View (Pip) */}
                      <div className="absolute bottom-6 right-6 w-48 aspect-video rounded-xl overflow-hidden border-2 border-white/20 bg-slate-900 shadow-xl">
                        {isCamOn ? (
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover scale-x-[-1]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                             <UserIcon className="h-10 w-10 text-slate-600" />
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              )}

              {isMinimized && (
                <div className="flex-1 flex items-center justify-center relative">
                   <div className="absolute inset-0">
                      <Image 
                        src={`https://picsum.photos/seed/doc${id}/400/250`} 
                        alt="Professional" 
                        fill
                        className="object-cover opacity-40"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="z-10 text-white text-center">
                      <p className="text-xs font-bold">{professional.name}</p>
                      <p className="text-[10px] text-emerald-400">Em consulta</p>
                   </div>
                </div>
              )}

              {/* Controls */}
              <div className={`mt-auto flex items-center justify-center gap-4 ${isMinimized ? 'scale-75 origin-bottom' : ''}`}>
                <Button 
                  size="icon" 
                  variant={isMicOn ? "secondary" : "destructive"} 
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </Button>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="rounded-full w-16 h-16 shadow-lg shadow-red-900/50"
                  onClick={() => setIsVideoCallActive(false)}
                >
                  <XCircle className="h-8 w-8" />
                </Button>
                <Button 
                  size="icon" 
                  variant={isCamOn ? "secondary" : "destructive"} 
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsCamOn(!isCamOn)}
                >
                  {isCamOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
