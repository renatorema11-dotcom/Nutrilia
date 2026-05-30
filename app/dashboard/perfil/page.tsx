"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, User as UserIcon, Target, Calendar as CalendarIcon, Info, XCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PerfilPage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [goalSummary, setGoalSummary] = useState("");
  
  // States for editable fields
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.preferences?.age || "");
  const [weight, setWeight] = useState(user?.preferences?.weight || "");
  const [height, setHeight] = useState(user?.preferences?.height || "");
  const [goal, setGoal] = useState(user?.preferences?.goal || "");
  const [gender, setGender] = useState(user?.preferences?.gender || "");

  if (!user) return null;

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const existingGoal = selectedDate && user.goalTargetDates ? user.goalTargetDates[dateKey] : "";

  const handleSaveChanges = () => {
    updateProfile({
      name,
      preferences: {
        ...user.preferences,
        age,
        weight,
        height,
        goal,
        gender
      }
    });
  };

  const handleSaveGoalDate = () => {
    if (!selectedDate || !goalSummary) return;
    
    const newTargetDates = { 
      ...(user.goalTargetDates || {}),
      [dateKey]: goalSummary
    };
    
    updateProfile({ goalTargetDates: newTargetDates });
    setGoalSummary("");
  };

  const handleRemoveGoalDate = (key: string) => {
    if (!user.goalTargetDates) return;
    const newTargetDates = { ...user.goalTargetDates };
    delete newTargetDates[key];
    updateProfile({ goalTargetDates: newTargetDates });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfile({ profilePicture: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Meu Perfil</h1>
        <p className="text-slate-500">Gerencie suas informações pessoais e preferências.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex sm:flex-row flex-col sm:items-center gap-6 pb-4 mb-4 border-b border-slate-100">
            <div className="relative isolate flex-shrink-0 mx-auto sm:mx-0">
              <div 
                className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-slate-400 group-hover:text-slate-500 transition-colors" />
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center sm:text-left">
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="mt-1">Clique na imagem para alterar sua foto de perfil</CardDescription>
            </div>
          </div>

          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Atualize seus dados para a IA ser mais precisa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input id="idade" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso Atual (kg)</Label>
              <Input id="peso" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input id="altura" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objetivo">Meta/Objetivo</Label>
              <Input id="objetivo" value={goal} onChange={(e) => setGoal(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero Biológico</Label>
              <Input id="genero" value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-lg text-slate-800">Datas Alvo para Metas</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-2 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={ptBR}
                    className="rounded-xl"
                  />
                </div>
                {selectedDate && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CalendarIcon className="h-4 w-4" />
                      {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                    </div>
                    
                    {existingGoal ? (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-emerald-100">
                          {existingGoal}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 p-0"
                          onClick={() => handleRemoveGoalDate(dateKey)}
                        >
                          Remover Meta
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Input 
                          placeholder="Ex: Chegar aos 75kg ou beber 3L de água" 
                          value={goalSummary}
                          onChange={(e) => setGoalSummary(e.target.value)}
                          className="bg-white border-emerald-200"
                        />
                        <Button 
                          size="sm" 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={handleSaveGoalDate}
                          disabled={!goalSummary}
                        >
                          Definir Meta para esta Data
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Info className="h-4 w-4 text-slate-400" />
                  Próximas Metas
                </h4>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(user.goalTargetDates || {}).length > 0 ? (
                    Object.entries(user.goalTargetDates || {})
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, goal]) => {
                        const targetDate = new Date(date + 'T12:00:00'); // avoid timezone shifts
                        const isPast = targetDate < new Date(new Date().setHours(0,0,0,0));
                        
                        return (
                          <div 
                            key={date} 
                            className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                              isPast ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-100 shadow-sm hover:border-emerald-200'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {format(targetDate, "dd/MM/yyyy")}
                              </p>
                              <p className="text-slate-700 font-medium">{goal}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-400 hover:text-red-500"
                              onClick={() => handleRemoveGoalDate(date)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                      <Target className="h-12 w-12 text-slate-100 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Nenhuma meta agendada ainda.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="justify-end border-t border-slate-100 p-4">
          <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências Alimentares</CardTitle>
          <CardDescription>O que você gosta de comer e o que evita</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restricoes">Restrições e Alergias</Label>
            <textarea 
              id="restricoes" 
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
              defaultValue="Nenhuma restrição alimentar."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rotina">Nível de Atividade</Label>
            <textarea 
              id="rotina" 
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
              defaultValue={user.preferences?.activityLevel || "Moderado"}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t border-slate-100 p-4">
          <Button>Salvar Preferências</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
