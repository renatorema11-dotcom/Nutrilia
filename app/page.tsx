"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Apple, Heart, Stethoscope, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 transition-all">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Apple className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-800">Nutrilia</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <Link href="#funcionalidades" className="hover:text-emerald-600 transition-colors">{t('nav.features')}</Link>
          <Link href="/cadastro-nutricionista" className="hover:text-emerald-600 transition-colors">{t('nav.professional')}</Link>
          <Link href="/plans" className="hover:text-emerald-600 transition-colors">{t('nav.plans')}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
            <label htmlFor="language-select" className="sr-only">Selecione o idioma</label>
            <select 
              id="language-select"
              className="bg-transparent text-xs font-medium border-none outline-none cursor-pointer hover:text-emerald-600 transition-colors max-w-[120px] truncate" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <optgroup label="Idiomas">
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="de">Deutsch</option>
              </optgroup>
            </select>
          </div>

          <Link href="/login">
            <Button variant="ghost" className="text-slate-600 hover:text-emerald-700 hover:bg-emerald-50">{t('nav.login')}</Button>
          </Link>
          <Link href="/login?tab=register">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border-0">{t('nav.start')}</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-8 border border-emerald-100/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t('home.badge')}
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-800 mb-6 max-w-4xl mx-auto leading-tight">
            {t('home.title.part1')} <span className="text-emerald-600 bg-emerald-50 px-2 rounded-lg">{t('home.title.part2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('home.desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login?tab=register">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-200 border-0">{t('home.btn.patient')}</Button>
            </Link>
            <Link href="/cadastro-nutricionista">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border-slate-200">{t('home.btn.professional')}</Button>
            </Link>
          </div>
        </section>

        <section id="funcionalidades" className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold mb-4 text-slate-800">{t('home.features.title')}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">{t('home.features.desc')}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Apple className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{t('home.feature1.title')}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{t('home.feature1.desc')}</p>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{t('home.feature2.title')}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{t('home.feature2.desc')}</p>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{t('home.feature3.title')}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{t('home.feature3.desc')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6 text-center text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-white mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Apple className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Nutrilia</span>
          </div>
          <p className="mb-4">{t('home.footer')}</p>
          <p className="text-sm">{t('home.footer.sim')}</p>
        </div>
      </footer>
    </div>
  );
}
