"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgendaPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-emerald-500" />
            Agenda
          </h1>
          <p className="text-slate-500">Gerencie seus horários e consultas.</p>
        </div>
        <Button className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Nova Consulta
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle>Maio 2026</CardTitle>
            <CardDescription>Semana de 17 a 23 de Maio</CardDescription>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="icon">
               <ChevronLeft className="h-4 w-4" />
             </Button>
             <Button variant="outline" size="icon">
               <ChevronRight className="h-4 w-4" />
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-slate-500">
             <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20" />
             <p>Visualização do calendário em construção.</p>
             <p className="text-sm mt-2">Você tem 4 consultas marcadas para hoje.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
