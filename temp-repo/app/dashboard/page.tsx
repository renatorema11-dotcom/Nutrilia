"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Activity, Flame, Utensils, Droplet, NotebookPen } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const MEALS = [
  { id: "breakfast", label: "Café da Manhã", time: "08:00", description: "Ovos mexidos com mamão e aveia." },
  { id: "snack1", label: "Lanche da Manhã", time: "10:30", description: "Fruta (Maçã ou Pera)" },
  { id: "lunch", label: "Almoço", time: "13:00", description: "Arroz integral, feijão, frango grelhado e salada." },
  { id: "snack2", label: "Lanche da Tarde", time: "16:00", description: "Iogurte natural com castanhas." },
  { id: "dinner", label: "Jantar", time: "19:30", description: "Sopa de legumes com carne magra." }
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [chartView, setChartView] = useState<"weight" | "water" | "calories">("weight");
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const firstName = user?.name ? user.name.split(' ')[0] : 'João';

  const userWeight = user?.preferences?.weight ? Number(user.preferences.weight) : 77.9;
  const currentWeightData = [
    { name: 'Sem 1', peso: Math.round((userWeight + 2.6) * 10) / 10 },
    { name: 'Sem 2', peso: Math.round((userWeight + 1.9) * 10) / 10 },
    { name: 'Sem 3', peso: Math.round((userWeight + 1.1) * 10) / 10 },
    { name: 'Sem 4', peso: Math.round((userWeight + 0.5) * 10) / 10 },
    { name: 'Atual', peso: userWeight },
  ];

  const waterIntakeData = [
    { name: 'Seg', agua: 1.5 },
    { name: 'Ter', agua: 2.1 },
    { name: 'Qua', agua: 1.8 },
    { name: 'Qui', agua: 2.5 },
    { name: 'Sex', agua: 2.2 },
    { name: 'Sáb', agua: 1.9 },
    { name: 'Dom', agua: 2.1 },
  ];

  const caloriesData = [
    { name: 'Seg', calorias: 1850 },
    { name: 'Ter', calorias: 1900 },
    { name: 'Qua', calorias: 1750 },
    { name: 'Qui', calorias: 2100 },
    { name: 'Sex', calorias: 1950 },
    { name: 'Sáb', calorias: 2300 },
    { name: 'Dom', calorias: 2000 },
  ];

  const isWatchConnected = user?.isAppleWatchConnected;

  const recordedMeals = user?.recordedMeals || [];
  const nextMeal = MEALS.find(meal => !recordedMeals.includes(meal.id));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          {t('dash.title').includes('João') 
            ? t('dash.title').replace('João', firstName) 
            : `${t('dash.title')} ${firstName}`}
        </h1>
        <p className="text-slate-500">{t('dash.subtitle')}</p>
        
        {!isWatchConnected && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
            <strong className="block mb-1">Como funciona a Visão Geral?</strong>
            Os dados de calorias, água e passos são sincronizados automaticamente a partir do seu <strong>Apple Watch / Apple Health</strong>. 
            Como seu dispositivo ainda não está conectado, eles aparecem zerados. 
            Vá na aba <strong>Dispositivos</strong> para conectar seu relógio e começar a sincronizar as informações do seu dia a dia automaticamente!
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl shadow-sm border-0 border-l-4 border-l-orange-500 bg-white">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">{t('dash.kcal')}</p>
            <h3 className="text-2xl font-bold font-display text-slate-900">{isWatchConnected ? "1.850" : "0"}</h3>
            <p className="text-xs text-orange-600 mt-1">Meta: 2.200</p>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-2xl shadow-sm border-0 border-l-4 border-l-blue-500 bg-white">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">{t('dash.water')}</p>
            <h3 className="text-2xl font-bold font-display text-slate-900">{isWatchConnected ? "2.1L" : "0L"}</h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: isWatchConnected ? '70%' : '0%' }}></div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl shadow-sm border-0 border-l-4 border-l-emerald-500 bg-white">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">{t('dash.steps')}</p>
            <h3 className="text-2xl font-bold font-display text-slate-900">{isWatchConnected ? "6.540" : "0"}</h3>
            <p className={`text-xs mt-1 ${isWatchConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isWatchConnected ? "+12%" : "Sem dados"}
            </p>
          </div>
        </div>

        <div 
          onClick={() => router.push('/dashboard/refeicoes')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              router.push('/dashboard/refeicoes');
            }
          }}
          aria-label="Ver registro de refeições"
          className="glass-card p-4 rounded-2xl shadow-sm border-0 border-l-4 border-l-purple-500 bg-white cursor-pointer hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">{t('dash.meals')}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-display text-slate-900">
                {user?.recordedMeals ? user.recordedMeals.length : 0} / 5
              </h3>
              <div className="bg-purple-100 text-purple-700 p-1.5 rounded-lg flex items-center justify-center" aria-hidden="true">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 uppercase">
              {user?.recordedMeals?.length === 5 ? "Tudo concluído" : "Bora registrar!"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle id="progresso-peso-title">
                  {chartView === "weight" && t('dash.prog.title')}
                  {chartView === "water" && "Consumo de Água (L)"}
                  {chartView === "calories" && "Calorias Queimadas (kcal)"}
                </CardTitle>
                <CardDescription>
                  {chartView === "weight" && t('dash.prog.desc')}
                  {chartView === "water" && "Seu histórico semanal de hidratação"}
                  {chartView === "calories" && "Seu histórico semanal de gasto calórico"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={chartView === "weight" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setChartView("weight")}
                  className={chartView === "weight" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  <Activity className="h-4 w-4 mr-2" /> Peso
                </Button>
                <Button 
                  variant={chartView === "water" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setChartView("water")}
                  className={chartView === "water" ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  <Droplet className="h-4 w-4 mr-2" /> Água
                </Button>
                <Button 
                  variant={chartView === "calories" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setChartView("calories")}
                  className={chartView === "calories" ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  <Flame className="h-4 w-4 mr-2" /> Calorias
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full" role="img" aria-labelledby="progresso-peso-title">
                {chartView === "weight" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentWeightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="peso" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {chartView === "water" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterIntakeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <ReferenceLine y={user?.hydrationSettings?.goal ? user.hydrationSettings.goal / 1000 : 2} stroke="#0ea5e9" strokeDasharray="3 3" label={{ position: 'top', value: 'Meta Diária', fill: '#0ea5e9', fontSize: 12 }} />
                      <Bar dataKey="agua" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Ingestão (L)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {chartView === "calories" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={caloriesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis domain={[0, 3000]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <Bar dataKey="calorias" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('dash.next.title') || "Próxima Refeição"}</CardTitle>
              </CardHeader>
              <CardContent>
                {nextMeal ? (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100" role="status">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-slate-900">{nextMeal.label}</span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">{nextMeal.time}</span>
                    </div>
                    <p className="text-sm text-slate-600">{nextMeal.description}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center" role="status">
                    <span className="font-medium text-emerald-900">Todas as refeições concluídas!</span>
                    <p className="text-sm text-emerald-700 mt-1">Parabéns pelo foco hoje.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('dash.nutri.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 overflow-hidden shrink-0 relative">
                    <img src="https://picsum.photos/seed/doc1/100" alt="Dra. Mariana S." className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Dra. Mariana S.</h4>
                    <p className="text-xs text-slate-500">{t('dash.nutri.next')}: 15/Mai</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('dash.cal.title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm bg-white"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <NotebookPen className="h-4 w-4" aria-hidden="true" />
                {t('dash.notes.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
               <textarea 
                  className="w-full text-sm border-0 bg-slate-50 rounded-lg p-3 focus:ring-1 focus:ring-emerald-500 resize-none h-24 text-slate-700" 
                  placeholder={t('dash.notes.placeholder')}
                  aria-label={t('dash.notes.title')}
                />
            </CardContent>
            <CardFooter className="pt-0">
               <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500">{t('dash.notes.save')}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
