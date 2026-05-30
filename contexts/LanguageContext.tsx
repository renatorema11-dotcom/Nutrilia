"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries } from '@/lib/dictionaries';

type Language = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt-BR',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('pt-BR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('app_lang');
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string) => {
    const baseLang = language.split('-')[0];
    const dict = (dictionaries as any)[language] || (dictionaries as any)[baseLang] || dictionaries['en'];
    return (dict as any)[key] || (dictionaries['pt'] as any)[key] || key;
  };

  // Prevent hydration mismatch by rendering normally, but translations will snap
  // Since this is a simple implementation, it's a known tradeoff for client-side language switching.
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={mounted ? "opacity-100 transition-opacity duration-300" : "opacity-0"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
