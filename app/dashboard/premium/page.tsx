"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";

export default function PremiumPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-6 pb-12">
      <div className="text-center space-y-4 mb-10">
        <div className="h-16 w-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <Crown className="h-8 w-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">Desbloqueie seu Potencial Máximo</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Nutrilia Premium te dá acesso irrestrito às melhores ferramentas, IAs avançadas e contato direto com os melhores profissionais do Brasil.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Plano Grátis</CardTitle>
            <CardDescription>Para você começar a se organizar</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$ 0</span>
              <span className="text-slate-500">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="flex gap-2 items-start text-sm">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Geração de dieta com IA Básica (1x por semana)</span>
            </div>
            <div className="flex gap-2 items-start text-sm">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Dashboard de progresso geral</span>
            </div>
            <div className="flex gap-2 items-start text-sm text-slate-400">
              <Check className="h-5 w-5 opacity-50 shrink-0" />
              <span>Sincronização manual de peso</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Seu Plano Atual</Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-amber-300 shadow-xl shadow-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Recomendado
          </div>
          <CardHeader>
            <CardTitle className="text-xl text-amber-600">Nutrilia Premium</CardTitle>
            <CardDescription>Para resultados rápidos e definitivos</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$ 39,90</span>
              <span className="text-slate-500">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="flex gap-2 items-start text-sm font-medium">
              <Check className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Acesso Ilimitado à IA Nutricionista (Gemini Pro)</span>
            </div>
            <div className="flex gap-2 items-start text-sm font-medium">
              <Check className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Sincronização Automática com Apple Health, Garmin etc.</span>
            </div>
            <div className="flex gap-2 items-start text-sm font-medium">
              <Check className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Plantão de Dúvidas 24/7 com Nutricionistas</span>
            </div>
            <div className="flex gap-2 items-start text-sm font-medium">
              <Check className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Upload e análise automática de exames de sangue</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white border-0">Assinar Agora</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
