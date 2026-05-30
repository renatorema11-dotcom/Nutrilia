"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, EyeOff, Eye, Mail, Lock, User } from "lucide-react";
import { Suspense, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

function LoginForm() {
  const searchParams = useSearchParams();
  const isRegister = searchParams.get("tab") === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();
  const { login, register, loginWithGoogle, loginWithFacebook } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = email;
    const finalPassword = password;
    
    if (isRegister) {
      const finalName = name || "Novo Usuário";
      register(finalName, finalEmail, finalPassword);
    } else {
      login(finalEmail, finalPassword);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="w-full shadow-lg border-emerald-100">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="font-display text-2xl font-bold tracking-tight text-slate-800">
            {isRegister ? t('login.register.title') : t('login.title')}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {isRegister ? t('login.register.desc') : t('login.desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-600 font-medium" onClick={() => loginWithGoogle()} type="button">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t('login.google')}
            </Button>
            <Button variant="outline" className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-600 font-medium" onClick={() => loginWithFacebook()} type="button">
              <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {t('login.facebook')}
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">{t('login.or')}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">{t('login.name')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('login.name.placeholder')} className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" required />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={t('login.email.placeholder')} className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('login.password')}</Label>
                {!isRegister && (
                  <Link href="#" className="text-xs font-semibold text-emerald-600 hover:underline">
                    {t('login.forgot')}
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 mt-6 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-200 font-semibold border-0 text-base">
              {isRegister ? t('login.btn.register') : t('login.btn.login')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm text-slate-600 gap-2 pb-6">
          {isRegister ? (
            <p className="font-medium text-slate-500">
              {t('login.has_account')} <Link href="/login" className="text-emerald-600 font-bold hover:underline">{t('login.enter_here')}</Link>
            </p>
          ) : (
            <div className="text-center space-y-3 w-full border-t border-slate-100 pt-4">
              <p className="font-medium text-slate-500">{t('login.no_account')}</p>
              <div className="flex flex-col gap-2">
                <Link href="/login?tab=register">
                  <Button variant="outline" className="w-full font-semibold border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-colors">
                    {t('login.create_patient')}
                  </Button>
                </Link>
                <Link href="/cadastro-nutricionista">
                  <Button variant="outline" className="w-full font-semibold border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-colors">
                    {t('login.im_professional')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-xs text-slate-400 max-w-sm text-center">
        {t('login.terms')}
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 text-emerald-600 mb-8 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Apple className="h-5 w-5 text-white" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-slate-800">Nutrilia</span>
      </Link>

      <Suspense fallback={<div className="h-96 w-full max-w-md bg-white rounded-xl shadow animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
