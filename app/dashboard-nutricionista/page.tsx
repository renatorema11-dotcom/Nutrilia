"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, FileText, CalendarDays, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function NutricionistaDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Nutricionista';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          Visão Geral - Clínica Nutrilia
        </h1>
        <p className="text-slate-500">Resumo do seu atendimento e seus pacientes.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl shadow-sm border-0 border-l-4 border-l-blue-500 bg-white">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Pacientes Ativos</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-display text-slate-900">24</h3>
              <div className="bg-blue-100 text-blue-700 p-1.5 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-1">+3 esta semana</p>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-2xl shadow-sm border-0 border-l-4 border-l-emerald-500 bg-white">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Consultas Hoje</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-display text-slate-900">4</h3>
              <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-1">Próxima às 14:00</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl shadow-sm border-0 border-l-4 border-l-orange-500 bg-white">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Dietas Atualizadas</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-display text-slate-900">18</h3>
              <div className="bg-orange-100 text-orange-700 p-1.5 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1">Nos últimos 7 dias</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl shadow-sm border-0 border-l-4 border-l-purple-500 bg-white">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Mensagens</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-display text-slate-900">5</h3>
              <div className="bg-purple-100 text-purple-700 p-1.5 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-1">2 não lidas</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
            <CardDescription>Sua agenda para hoje e amanhã.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    CF
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Carlos Ferreira</h4>
                    <p className="text-xs text-slate-500">Retorno - Foco Hipesrtrofia</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Hoje, 14:00</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                    AL
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Ana Luiza</h4>
                    <p className="text-xs text-slate-500">Primeira Consulta - Emagrecimento</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Hoje, 16:30</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                    MR
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Marcos Rocha</h4>
                    <p className="text-xs text-slate-500">Acompanhamento Mensal</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-slate-600 bg-slate-200 px-2 py-1 rounded-full">Amanhã, 09:00</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Abrir Agenda Completa</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atualizações Recentes de Pacientes</CardTitle>
            <CardDescription>Progresso registrado pelos seus pacientes nos últimos dias.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Julia Santos <span className="font-normal text-slate-600">registrou um novo peso: <strong className="text-slate-900">65.2 kg</strong> (-1.5kg).</span></p>
                  <p className="text-xs text-slate-400 mt-1">Há 2 horas</p>
                </div>
              </div>
              <div className="flex gap-4 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pedro Costa <span className="font-normal text-slate-600">enviou uma dúvida sobre suplementação.</span></p>
                  <p className="text-xs text-slate-400 mt-1">Ontem</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sistema <span className="font-normal text-slate-600">gerou a pré-dieta baseada em IA para a nova paciente <strong className="text-slate-900">Ana Luiza</strong>. Pronto para revisão.</span></p>
                  <p className="text-xs text-slate-400 mt-1">Ontem</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Ver Todos os Alertas</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
