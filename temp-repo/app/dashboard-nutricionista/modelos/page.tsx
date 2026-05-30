"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, Plus, Apple, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ModelosDeDietaPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-500" />
            Modelos de Dieta
          </h1>
          <p className="text-slate-500">Seus templates de dieta para agilizar o atendimento.</p>
        </div>
        <Button className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Novo Modelo
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-emerald-500 transition-colors cursor-pointer group">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1 text-emerald-600">
              <Apple className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Perda de Peso</span>
            </div>
            <CardTitle className="text-lg group-hover:text-emerald-700 transition-colors">Low Carb - Fase Inicial</CardTitle>
            <CardDescription className="line-clamp-2">Modelo base para pacientes que buscam perda rápida de gordura com restrição de carboidratos.</CardDescription>
          </CardHeader>
          <CardFooter className="pt-3 bg-slate-50 rounded-b-xl flex justify-between items-center text-xs text-slate-500">
             <span>Atualizado há 2 dias</span>
             <span className="font-semibold px-2 py-1 bg-white rounded-md border border-slate-200">1800 kcal</span>
          </CardFooter>
        </Card>

        <Card className="hover:border-blue-500 transition-colors cursor-pointer group">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1 text-blue-600">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Hipertrofia</span>
            </div>
            <CardTitle className="text-lg group-hover:text-blue-700 transition-colors">Bulking Limpo</CardTitle>
            <CardDescription className="line-clamp-2">Modelo normoproteico e hipercalórico para fomento de massa muscular magra.</CardDescription>
          </CardHeader>
          <CardFooter className="pt-3 bg-slate-50 rounded-b-xl flex justify-between items-center text-xs text-slate-500">
             <span>Atualizado há 1 semana</span>
             <span className="font-semibold px-2 py-1 bg-white rounded-md border border-slate-200">3200 kcal</span>
          </CardFooter>
        </Card>
        
        <Card className="hover:border-purple-500 transition-colors cursor-pointer group">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1 text-purple-600">
              <Target className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Reeducação</span>
            </div>
            <CardTitle className="text-lg group-hover:text-purple-700 transition-colors">Dieta Mediterrânea</CardTitle>
            <CardDescription className="line-clamp-2">Modelo rico em gorduras boas, fibras e antioxidantes. Ideal para saúde cardiovascular.</CardDescription>
          </CardHeader>
          <CardFooter className="pt-3 bg-slate-50 rounded-b-xl flex justify-between items-center text-xs text-slate-500">
             <span>Atualizado há 1 mês</span>
             <span className="font-semibold px-2 py-1 bg-white rounded-md border border-slate-200">2000 kcal</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
