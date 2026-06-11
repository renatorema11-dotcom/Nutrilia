"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, BellOff, Clock, Save, AlertCircle, Droplet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_MEALS = [
  { id: "breakfast", label: "Café da Manhã", time: "08:00" },
  { id: "snack1", label: "Lanche da Manhã", time: "10:30" },
  { id: "lunch", label: "Almoço", time: "13:00" },
  { id: "snack2", label: "Lanche da Tarde", time: "16:00" },
  { id: "dinner", label: "Jantar", time: "19:30" }
];

export default function LembretesPage() {
  const { user, updateProfile } = useAuth();
  const [reminders, setReminders] = useState<any[]>([]);
  const [hydrationEnabled, setHydrationEnabled] = useState(false);
  const [hydrationInterval, setHydrationInterval] = useState("2");
  const [hydrationGoal, setHydrationGoal] = useState("2500");
  const [isSaving, setIsSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (user) {
      if (user.mealReminders && user.mealReminders.length > 0) {
        setReminders(user.mealReminders);
      } else {
        setReminders(DEFAULT_MEALS.map(m => ({ ...m, enabled: true })));
      }
      if (user.hydrationSettings) {
        setHydrationEnabled(user.hydrationSettings.enabled);
        setHydrationInterval(user.hydrationSettings.interval.toString());
        setHydrationGoal(user.hydrationSettings.goal.toString());
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
    }
  };

  const handleToggle = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const handleTimeChange = (id: string, time: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, time } : r
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    updateProfile({ 
      mealReminders: reminders,
      hydrationSettings: {
        enabled: hydrationEnabled,
        interval: parseInt(hydrationInterval) || 2,
        goal: parseInt(hydrationGoal) || 2000
      }
    });
    
    setTimeout(() => {
      setIsSaving(false);
      if (Notification.permission === "granted") {
        new Notification("Nutrilia", {
          body: "Configurações de lembretes salvas com sucesso!",
          icon: "/icon.png"
        });
      }
    }, 800);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lembretes de Refeições</h1>
          <p className="text-sm text-slate-500">Configure horários personalizados para ser notificado e não pular nenhuma refeição.</p>
        </div>
        
        {permissionStatus !== "granted" && (
          <Button 
            variant="outline" 
            className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 gap-2"
            onClick={requestPermission}
          >
            <AlertCircle className="h-4 w-4" />
            Ativar Notificações no Navegador
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className={`transition-all ${reminder.enabled ? 'border-emerald-200' : 'opacity-60 bg-slate-50'}`}>
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggle(reminder.id)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    reminder.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  aria-label={`Alternar lembrete para ${reminder.label}`}
                >
                  <motion.div 
                    animate={{ x: reminder.enabled ? 24 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${reminder.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                    {reminder.enabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{reminder.label}</h3>
                    <p className="text-xs text-slate-500">Será notificado no horário configurado.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                  <Input
                    type="time"
                    value={reminder.time}
                    onChange={(e) => handleTimeChange(reminder.id, e.target.value)}
                    className="pl-9 w-32 border-slate-200 focus:ring-emerald-500"
                    disabled={!reminder.enabled}
                    aria-label={`Horário para ${reminder.label}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Lembrete de Hidratação</h2>
        <p className="text-sm text-slate-500 mb-6">Mantenha-se hidratado configurando a sua meta diária e o intervalo de aviso.</p>
        
        <Card className={`transition-all ${hydrationEnabled ? 'border-sky-200 bg-sky-50/50' : 'opacity-80 bg-slate-50'}`}>
           <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setHydrationEnabled(!hydrationEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                    hydrationEnabled ? 'bg-sky-500' : 'bg-slate-300'
                  }`}
                  aria-label="Alternar lembrete de hidratação"
                >
                  <motion.div 
                    animate={{ x: hydrationEnabled ? 24 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${hydrationEnabled ? 'bg-sky-100 text-sky-600' : 'bg-slate-200 text-slate-500'}`}>
                    <Droplet className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Beber Água</h3>
                    <p className="text-xs text-slate-500">Notificações periódicas para se hidratar.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Meta (ml)</label>
                  <Input
                    type="number"
                    value={hydrationGoal}
                    onChange={(e) => setHydrationGoal(e.target.value)}
                    className="w-24 border-slate-200 focus:ring-sky-500"
                    disabled={!hydrationEnabled}
                    min="500"
                    step="100"
                    aria-label="Meta de hidratação em ml"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Intervalo (horas)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="number"
                        value={hydrationInterval}
                        onChange={(e) => setHydrationInterval(e.target.value)}
                        className="pl-9 w-32 border-slate-200 focus:ring-sky-500"
                        disabled={!hydrationEnabled}
                        min="1"
                        max="24"
                        aria-label="Intervalo de notificação em horas"
                    />
                  </div>
                </div>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4 bg-white/80 backdrop-blur-sm sticky bottom-0 pb-4">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px] shadow-lg shadow-emerald-200 transition-all font-bold"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </span>
          )}
        </Button>
      </div>

      <Card className="bg-slate-900 text-white border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Bell className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Como funcionam as notificações?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                As notificações serão enviadas diretamente para o seu dispositivo no horário agendado. 
                Certifique-se de manter o Nutrilia aberto ou salvá-lo em sua tela inicial para não perder nenhum lembrete.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Privacidade Total</span>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Sem Spam</span>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full uppercase tracking-wider font-bold">100% Personalizável</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
