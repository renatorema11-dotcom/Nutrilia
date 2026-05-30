"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Utensils, Check, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const MEALS = [
  { id: "breakfast", label: "Café da Manhã", time: "08:00", description: "Ovos mexidos com mamão e aveia." },
  { id: "snack1", label: "Lanche da Manhã", time: "10:30", description: "Fruta (Maçã ou Pera)" },
  { id: "lunch", label: "Almoço", time: "13:00", description: "Arroz integral, feijão, frango grelhado e salada." },
  { id: "snack2", label: "Lanche da Tarde", time: "16:00", description: "Iogurte natural com castanhas." },
  { id: "dinner", label: "Jantar", time: "19:30", description: "Sopa de legumes com carne magra." }
];

export default function MealsPage() {
  const { user, toggleMeal } = useAuth();
  const { t } = useLanguage();
  const [loadingSuggestion, setLoadingSuggestion] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});

  const recordedMeals = user?.recordedMeals || [];
  const progress = Math.round((recordedMeals.length / MEALS.length) * 100);

  const getSubstitution = async (mealId: string, description: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (suggestions[mealId]) return;
    
    setLoadingSuggestion(mealId);
    try {
      const res = await fetch('/api/food-substitution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealDescription: description })
      });
      const data = await res.json();
      if (data.suggestion) {
        setSuggestions(prev => ({ ...prev, [mealId]: data.suggestion }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSuggestion(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
          <Utensils className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Refeições Registradas</h1>
          <p className="text-sm text-slate-500">Acompanhe e registre suas refeições diárias aqui.</p>
        </div>
      </div>

      <Card className="border-emerald-200 bg-emerald-50 mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-emerald-800 text-lg">Progresso Diário</CardTitle>
          <CardDescription className="text-emerald-700">
            Você registrou {recordedMeals.length} de {MEALS.length} refeições hoje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="w-full bg-emerald-200/50 h-3 rounded-full overflow-hidden" 
            role="progressbar" 
            aria-valuenow={recordedMeals.length} 
            aria-valuemin={0} 
            aria-valuemax={MEALS.length}
            aria-label="Progresso de registro de refeições"
          >
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4" role="list">
        {MEALS.map((meal) => {
          const isRecorded = recordedMeals.includes(meal.id);
          
          return (
            <Card 
              key={meal.id} 
              role="button"
              tabIndex={0}
              aria-pressed={isRecorded}
              aria-label={`Registrar ${meal.label}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleMeal(meal.id);
                }
              }}
              className={`transition-all transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${isRecorded ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-200 cursor-pointer'}`}
              onClick={() => toggleMeal(meal.id)}
            >
              <CardContent className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isRecorded ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isRecorded && <Check className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isRecorded ? 'text-emerald-800' : 'text-slate-800'}`}>
                          {meal.label} <span className="text-slate-400 text-xs font-normal ml-2">{meal.time}</span>
                        </h3>
                        <p className={`text-sm mt-1 ${isRecorded ? 'text-emerald-600/80' : 'text-slate-500'}`}>
                          {meal.description}
                        </p>
                      </div>
                    </div>
                    {isRecorded && (
                      <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded hidden sm:inline-block shrink-0">
                        Registrada
                      </span>
                    )}
                </div>
                {suggestions[meal.id] && (
                  <div className="mt-2 p-3 bg-purple-50 text-purple-800 text-sm rounded-md border border-purple-100 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <p>{suggestions[meal.id]}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 pb-3 px-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs text-slate-600 border-slate-200 hover:bg-slate-50"
                    onClick={(e) => getSubstitution(meal.id, meal.description, e)}
                    disabled={loadingSuggestion === meal.id || !!suggestions[meal.id]}
                  >
                    {loadingSuggestion === meal.id ? (
                      <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1.5 text-purple-500" />
                    )}
                    {suggestions[meal.id] ? "Substituição Sugerida" : "Sugerir Substituição"}
                  </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
