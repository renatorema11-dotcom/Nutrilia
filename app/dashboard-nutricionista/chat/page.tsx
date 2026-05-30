"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Search, Phone, Video, Info, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MensagensPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col pt-2 pb-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-purple-500" />
          Mensagens
        </h1>
        <p className="text-slate-500">Converse com seus pacientes e monitore seu progresso diário.</p>
      </div>

      <div className="flex-1 grid md:grid-cols-3 gap-6 overflow-hidden">
        <Card className="md:col-span-1 flex flex-col overflow-hidden hidden sm:flex">
          <CardHeader className="p-4 border-b shrink-0">
             <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Buscar conversas..." className="pl-8 bg-slate-50" />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            <div className="divide-y divide-slate-100">
               {/* Example Chat */}
              <div className="p-4 cursor-pointer bg-purple-50 hover:bg-purple-50/80 transition-colors border-l-2 border-purple-500">
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-slate-900">Carlos Ferreira</h4>
                    <span className="text-xs text-slate-500">14:22</span>
                 </div>
                 <p className="text-sm text-slate-600 line-clamp-1 font-medium text-slate-800">
                    Dra., posso trocar o arroz por batata doce hoje?
                 </p>
              </div>

               {/* Example Chat */}
               <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-slate-900">Julia Santos</h4>
                    <span className="text-xs text-slate-500">Ontem</span>
                 </div>
                 <p className="text-sm text-slate-500 line-clamp-1">
                    Já comecei a nova dieta da fase 2!
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between shrink-0 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                CF
              </div>
              <div>
                <CardTitle className="text-base text-slate-900">Carlos Ferreira</CardTitle>
                <CardDescription className="text-xs text-emerald-600">Online agora</CardDescription>
              </div>
            </div>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
                 <Phone className="h-4 w-4" />
               </Button>
               <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
                 <Video className="h-4 w-4" />
               </Button>
               <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
                 <Info className="h-4 w-4" />
               </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
             <div className="text-center text-xs text-slate-400 my-4">Hoje</div>
             
             <div className="flex items-end gap-2">
                <div className="max-w-[75%] rounded-2xl p-3 bg-white border border-slate-100 shadow-sm rounded-bl-none">
                  <p className="text-sm text-slate-700">Boa tarde! Dra., posso trocar o arroz por batata doce hoje no almoço?</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">14:22</span>
                </div>
             </div>
             
             <div className="flex items-end gap-2 justify-end">
                <div className="max-w-[75%] rounded-2xl p-3 bg-purple-600 text-white shadow-sm rounded-br-none relative group">
                  <div className="absolute -top-3 -right-2 bg-purple-100 border border-purple-200 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Bot className="h-2 w-2" />
                    IA Recepcionista
                  </div>
                  <p className="text-sm">Olá Carlos! Como assistente virtual da Dra., vi no seu plano que sim, 100g de arroz integral podem ser substituídos por 100g de batata doce (ambos têm ~20g de carboidratos). Pode fazer a troca fiquedo tranquilo!</p>
                  <span className="text-[10px] text-purple-200 mt-1 block text-right">14:23 • Automático</span>
                </div>
             </div>
             
             {/* Text input visual area */}
          </CardContent>
          <div className="p-4 bg-white border-t mt-auto">
             <div className="flex gap-2">
               <Input placeholder="Digite sua resposta..." className="flex-1" />
               <Button className="bg-purple-600 hover:bg-purple-700">Enviar</Button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
