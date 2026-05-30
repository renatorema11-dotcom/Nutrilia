"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Settings2, Power, CalendarClock, MessageSquare, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function RecepcionistaIAPage() {
  const [isActive, setIsActive] = useState(true);
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [autoReply, setAutoReply] = useState(true);
  const [processPayments, setProcessPayments] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-600" />
            Recepcionista IA
          </h1>
          <p className="text-slate-500">Configure sua assistente virtual para gerenciar agenda e pacientes.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-full border border-slate-200 shadow-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          <span className="text-sm font-medium text-slate-700">{isActive ? 'IA Ativa' : 'IA Pausada'}</span>
          <Switch checked={isActive} onCheckedChange={setIsActive} className="ml-2" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-slate-600" />
                Configurações de Automação
              </CardTitle>
              <CardDescription>Defina o que a IA está autorizada a fazer automaticamente.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                 
                 <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                       <div className="h-10 w-10 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                          <CalendarClock className="h-5 w-5" />
                       </div>
                       <div>
                          <Label className="text-base font-semibold text-slate-900 mb-1 block">Agendamento Automático</Label>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            A IA pode ler sua agenda, oferecer horários disponíveis e marcar consultas com pacientes via chat. 
                          </p>
                       </div>
                    </div>
                    <Switch checked={autoSchedule} onCheckedChange={setAutoSchedule} disabled={!isActive} />
                 </div>

                 <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                       <div className="h-10 w-10 shrink-0 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-5 w-5" />
                       </div>
                       <div>
                          <Label className="text-base font-semibold text-slate-900 mb-1 block">Atendimento Fora do Horário</Label>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            A IA responderá mensagens de pacientes quando você estiver offline, tirando dúvidas simples ou avisando que você responderá depois.
                          </p>
                       </div>
                    </div>
                    <Switch checked={autoReply} onCheckedChange={setAutoReply} disabled={!isActive} />
                 </div>

                 <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                       <div className="h-10 w-10 shrink-0 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                       </div>
                       <div>
                          <Label className="text-base font-semibold text-slate-900 mb-1 block">Cobrança e Pagamentos</Label>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            A IA enviará links de pagamento (Stripe) proativamente para cobranças de novas consultas ou renovações.
                          </p>
                       </div>
                    </div>
                    <Switch checked={processPayments} onCheckedChange={setProcessPayments} disabled={!isActive} />
                 </div>

               </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
           <Card className="bg-gradient-to-b from-purple-600 to-purple-800 text-white border-0 shadow-md">
             <CardHeader>
               <CardTitle className="text-white flex items-center gap-2">
                 <Bot className="h-5 w-5" />
                 Resumo de Atividades
               </CardTitle>
               <CardDescription className="text-purple-200">O que a IA fez nas últimas 24h</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                   <div className="text-3xl font-display font-bold mb-1">4</div>
                   <div className="text-sm text-purple-100 uppercase tracking-wider font-semibold">Consultas Agendadas</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                   <div className="text-3xl font-display font-bold mb-1">12</div>
                   <div className="text-sm text-purple-100 uppercase tracking-wider font-semibold">Mensagens Respondidas</div>
                </div>
             </CardContent>
           </Card>

           <Card>
              <CardHeader className="pb-3 border-b">
                 <CardTitle className="text-base">Últimas Ações</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-slate-100 text-sm">
                   <div className="p-4 hover:bg-slate-50 transition-colors">
                     <p className="text-slate-900 font-medium line-clamp-1">Agendou retorno para Ana Clara</p>
                     <p className="text-slate-500 text-xs mt-1">Hoje, 10:42</p>
                   </div>
                   <div className="p-4 hover:bg-slate-50 transition-colors">
                     <p className="text-slate-900 font-medium line-clamp-1">Respondeu dúvida sobre Whey</p>
                     <p className="text-slate-500 text-xs mt-1">Ontem, 20:15</p>
                   </div>
                   <div className="p-4 hover:bg-slate-50 transition-colors">
                     <p className="text-slate-900 font-medium line-clamp-1">Enviou lembrete de consulta</p>
                     <p className="text-slate-500 text-xs mt-1">Ontem, 16:00</p>
                   </div>
                 </div>
                 <Button variant="ghost" className="w-full rounded-none rounded-b-xl text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    Ver log completo <ChevronRight className="h-4 w-4 ml-1" />
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
