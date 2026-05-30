"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Scale, Ruler, Activity, Target } from "lucide-react";

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    goal: "",
    activityLevel: "",
  });

  if (!user) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding(preferences);
    }
  };

  const updatePref = (key: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Progress Bar */}
        <div 
          className="absolute top-0 left-0 w-full h-1.5 bg-slate-100"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label="Progresso do Onboarding"
        >
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="text-center mb-8 pt-4">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-2">
            Olá, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-500">
            Precisamos de algumas informações para personalizar seu plano alimentar.
          </p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-emerald-500" />
              Perfil Básico
            </h2>
            
            <div className="space-y-4">
              <div>
                <span id="gender-label" className="block text-sm font-medium text-slate-700 mb-2">Como você se identifica?</span>
                <div className="grid grid-cols-2 gap-3" role="group" aria-labelledby="gender-label">
                  {['Masculino', 'Feminino'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updatePref('gender', g)}
                      aria-pressed={preferences.gender === g}
                      className={`h-12 rounded-xl border font-medium transition-colors ${
                        preferences.gender === g 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-slate-200 text-slate-600 hover:border-emerald-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="age-input" className="block text-sm font-medium text-slate-700 mb-2">Idade (anos)</label>
                <input 
                  id="age-input"
                  type="number" 
                  value={preferences.age}
                  onChange={(e) => updatePref('age', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: 28"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Body & Activity */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Corpo e Rotina
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight-input" className="block text-sm font-medium text-slate-700 mb-2">Peso atual (kg)</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
                    <input 
                      id="weight-input"
                      type="number" 
                      value={preferences.weight}
                      onChange={(e) => updatePref('weight', e.target.value)}
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: 75"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="height-input" className="block text-sm font-medium text-slate-700 mb-2">Altura (cm)</label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
                    <input 
                      id="height-input"
                      type="number" 
                      value={preferences.height}
                      onChange={(e) => updatePref('height', e.target.value)}
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: 175"
                    />
                  </div>
                </div>
              </div>

              <div>
                <span id="activity-label" className="block text-sm font-medium text-slate-700 mb-2">Nível de Atividade</span>
                <div className="grid gap-2" role="group" aria-labelledby="activity-label">
                  {[
                    { val: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                    { val: 'Leve', desc: '1 a 3 vezes por semana' },
                    { val: 'Moderado', desc: '3 a 5 vezes por semana' },
                    { val: 'Intenso', desc: '6 a 7 vezes por semana' }
                  ].map((level) => (
                    <button
                      key={level.val}
                      type="button"
                      onClick={() => updatePref('activityLevel', level.val)}
                      aria-pressed={preferences.activityLevel === level.val}
                      className={`text-left p-3 rounded-xl border transition-colors ${
                        preferences.activityLevel === level.val 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      <div className={`font-semibold ${preferences.activityLevel === level.val ? 'text-blue-700' : 'text-slate-700'}`}>{level.val}</div>
                      <div className="text-xs text-slate-500">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goal & Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 id="goal-heading" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Qual o seu objetivo principal?
            </h2>
            
            <div className="grid gap-3" role="group" aria-labelledby="goal-heading">
              {[
                'Emagrecimento', 
                'Ganho de Massa Muscular', 
                'Manutenção do Peso', 
                'Reeducação Alimentar'
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => updatePref('goal', goal)}
                  aria-pressed={preferences.goal === goal}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    preferences.goal === goal 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-slate-200 hover:border-orange-200'
                  }`}
                >
                  <span className={`font-medium ${preferences.goal === goal ? 'text-orange-700' : 'text-slate-700'}`}>
                    {goal}
                  </span>
                  {preferences.goal === goal && (
                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center" aria-hidden="true">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="h-12 px-6"
            >
              Voltar
            </Button>
          )}
          <Button 
            onClick={handleNext}
            className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium group"
          >
            {step === 3 ? 'Finalizar' : 'Continuar'}
            {step < 3 && <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
