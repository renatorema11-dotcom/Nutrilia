"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Bot, Calendar, Clock, CreditCard, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AgendamentoIAPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Chat/Pick, 2: Payment, 3: Confirmation
  const [chat, setChat] = useState([
    {
      role: "bot",
      content: "Olá! Sou a Assistente Virtual da Dra. Nutricionista. Quer agendar seu retorno ou tirar alguma dúvida agora que ela não está disponível?"
    }
  ]);

  const handlePatientMessage = () => {
     setChat(prev => [
       ...prev, 
       { role: "user", content: "Quero agendar meu retorno pra próxima semana." },
       { role: "bot", content: "Perfeito! A Dra. tem os seguintes horários livres na próxima semana:\n\n- Terça (26/05) às 14:00\n- Quinta (28/05) às 10:30\n\nQual fica melhor para você?" }
     ]);
  };

  const handlePickTime = () => {
    setChat(prev => [
      ...prev,
      { role: "user", content: "Quinta às 10:30." },
      { role: "bot", content: "Ótimo. Reservei a Quinta-feira, 28/05 às 10:30 para você. \n\nO valor da consulta de retorno é de R$ 150,00. Como a dra. habilitou a cobrança automática, clique no botão para efetuar o pagamento e confirmar." }
    ]);
    setTimeout(() => setStep(2), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="mb-4">
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6 text-purple-600" />
          Agendamento & Recepcionista IA
        </h1>
        <p className="text-slate-500">Converse com a assistente virtual para agendar e gerenciar suas consultas.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-[500px] flex flex-col">
           <CardHeader className="border-b pb-3 shrink-0 bg-purple-50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                    <Bot className="h-5 w-5" />
                 </div>
                 <div>
                    <CardTitle className="text-base text-purple-900">Assistente IA da Clínica</CardTitle>
                    <CardDescription className="text-purple-600 text-xs">Sempre online</CardDescription>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'} whitespace-pre-wrap text-sm`}>
                     {msg.content}
                  </div>
                </div>
              ))}
              {chat.length === 1 && (
                  <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={handlePatientMessage}>
                          &quot;Quero agendar meu retorno&quot;
                      </Button>
                  </div>
              )}
              {chat.length === 3 && (
                  <div className="flex justify-end gap-2 flex-wrap">
                      <Button variant="outline" size="sm" onClick={handlePickTime}>
                          &quot;Quinta às 10:30&quot;
                      </Button>
                  </div>
              )}
           </CardContent>
           <CardFooter className="border-t p-3 bg-slate-50 shrink-0">
              <div className="flex w-full gap-2">
                 <Input placeholder="Digite uma mensagem..." className="flex-1 bg-white" disabled={step !== 1} />
                 <Button disabled={step !== 1}>Enviar</Button>
              </div>
           </CardFooter>
        </Card>

        {step === 2 && (
            <Card className="border-emerald-200 shadow-md animate-in fade-in slide-in-from-right-4">
               <CardHeader className="bg-emerald-50 pb-4 border-b border-emerald-100">
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                     <CreditCard className="h-5 w-5" />
                     Pagamento da Consulta
                  </CardTitle>
                  <CardDescription className="text-emerald-700 font-medium">Finalize para confirmar o agendamento.</CardDescription>
               </CardHeader>
               <CardContent className="pt-6 space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500 text-sm">Resumo</span>
                        <span className="font-bold text-slate-900">Consulta de Retorno</span>
                     </div>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500 text-sm">Data e Hora</span>
                        <span className="text-slate-900 text-sm font-medium">Qui, 28/05 às 10:30</span>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t mt-2">
                        <span className="font-semibold text-slate-700">Total</span>
                        <span className="font-bold text-emerald-600 text-lg">R$ 150,00</span>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <p className="text-sm font-medium text-slate-700">Pagar com Cartão</p>
                     <Input placeholder="Número do Cartão" />
                     <div className="flex gap-2">
                         <Input placeholder="MM/AA" className="flex-1" />
                         <Input placeholder="CVC" className="flex-1" />
                     </div>
                  </div>
               </CardContent>
               <CardFooter>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setStep(3)}>
                      Processar Pagamento
                  </Button>
               </CardFooter>
            </Card>
        )}

        {step === 3 && (
            <Card className="border-emerald-200 bg-emerald-50 shadow-md flex flex-col items-center justify-center text-center p-8 animate-in zoom-in-95">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Consulta Confirmada!</h2>
                <p className="text-emerald-700 mb-6">Seu agendamento foi realizado com sucesso. A dra. já foi notificada pela IA auxiliadora.</p>
                <div className="bg-white p-4 rounded-xl w-full border border-emerald-100 mb-4 text-left">
                    <p className="text-sm text-slate-500 uppercase font-semibold mb-1">Detalhes</p>
                    <p className="font-medium text-slate-900 flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-500"/> Quinta-feira, 28/05 às 10:30</p>
                    <p className="font-medium text-slate-900 flex items-center gap-2 mt-1"><User className="h-4 w-4 text-emerald-500"/> Dra. Nutricionista</p>
                </div>
            </Card>
        )}

      </div>
    </div>
  );
}
