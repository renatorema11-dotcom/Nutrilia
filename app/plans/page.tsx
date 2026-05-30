"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Apple } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function PlansPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(user ? "/dashboard" : "/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <a href="#" onClick={handleBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors" aria-label="Voltar">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">{t('nav.back')}</span>
        </a>
        <div className="flex items-center gap-2" aria-hidden="true">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Apple className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-800">Nutrilia</span>
        </div>
        <div className="w-16" aria-hidden="true"></div> {/* Spacer for centering */}
      </header>

      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              {t('plans.title')}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              {t('plans.desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{t('plans.free.name')}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{t('plans.free.price')}</span>
                  <span className="text-slate-500 font-medium">{t('plans.free.period')}</span>
                </div>
                <p className="text-sm text-slate-500 mt-3">{t('plans.free.desc')}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  <span className="text-sm">{t('plans.free.feat1')}</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  <span className="text-sm">{t('plans.free.feat2')}</span>
                </li>
              </ul>

              <Link href="/login?tab=register">
                <Button variant="outline" className="w-full h-12 text-base font-semibold border-slate-200 text-slate-700 hover:bg-slate-50">{t('plans.free.btn')}</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 rounded-3xl p-8 border-0 shadow-2xl flex flex-col relative overflow-hidden ring-4 ring-emerald-500/30 transform md:-translate-y-4">
              <div className="absolute top-0 right-0 p-6">
                <div className="text-[10px] uppercase tracking-wider font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-3 py-1 rounded-full shadow-sm">
                  {t('plans.pro.badge')}
                </div>
              </div>
              <div className="mb-6 relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">{t('plans.pro.name')}</h3>
                <div className="flex items-baseline gap-1 justify-center md:justify-start">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{t('plans.pro.price')}</span>
                  <span className="text-slate-400 font-medium">{t('plans.pro.period')}</span>
                </div>
                <p className="text-sm text-slate-300 mt-4 leading-relaxed font-medium">Benefícios exclusivos turbinados por Inteligência Artificial e acompanhamento profissional para resultados mais rápidos.</p>
              </div>

              <ul className="space-y-5 mb-8 flex-1 relative z-10">
                <li className="flex items-start gap-4 text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                    <Check className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block mb-1">IA Inteligente e Evolutiva</span>
                    <span className="text-xs text-slate-400 block leading-relaxed">Dietas que se adaptam em tempo real à sua rotina, treinos e metabolismo.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                    <Check className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block mb-1">Suporte Profissional Direto</span>
                    <span className="text-xs text-slate-400 block leading-relaxed">Conecte-se com nutricionistas reais para ajustes finos e dúvidas pelo app.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                    <Check className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block mb-1">Integração Completa</span>
                    <span className="text-xs text-slate-400 block leading-relaxed">Conecte com smartwatch e Apple Saúde.</span>
                  </div>
                </li>
              </ul>

              <Link href="/login?tab=register&plan=pro" className="relative z-10 w-full mt-auto block">
                <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white border-0 shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02]">
                  Começar com Premium
                </Button>
              </Link>

              {/* Background decoration */}
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 bg-teal-500/10 rounded-full blur-[80px]"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
