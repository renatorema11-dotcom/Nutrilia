"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Watch, Smartphone, Link as LinkIcon, CheckCircle2, X, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function WearablesPage() {
  const { 
    user, 
    connectAppleWatch, 
    disconnectAppleWatch, 
    connectGoogleFit, 
    disconnectGoogleFit,
    connectGarmin,
    disconnectGarmin
  } = useAuth();
  const [showInstructions, setShowInstructions] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      if (!event.origin.endsWith('.run.app') && !event.origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'GOOGLE_FIT_SUCCESS') {
        connectGoogleFit();
        setIsConnecting(null);
      }

      if (event.data?.type === 'GARMIN_SUCCESS') {
        connectGarmin();
        setIsConnecting(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [connectGoogleFit, connectGarmin]);

  const handleConnectOAuth = async (provider: 'google' | 'garmin') => {
    setIsConnecting(provider);
    try {
      const response = await fetch(`/api/auth/${provider}/url`);
      if (!response.ok) throw new Error('Failed to fetch auth URL');
      const { url } = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(url, `connect_${provider}`, `width=${width},height=${height},left=${left},top=${top}`);
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error);
      setIsConnecting(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <Watch className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Dispositivos Vestíveis</h1>
          <p className="text-slate-500">Conecte seus apps e smartwatches para coleta automática de dados.</p>
        </div>
      </div>

      {user?.isAppleWatchConnected && (
        <Card className="border-emerald-500 bg-emerald-50/50 mb-6 overflow-hidden">
          <div className="h-1 bg-emerald-500 w-full animate-pulse"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-emerald-800 text-lg">Apple Watch Conectado!</CardTitle>
                <CardDescription className="text-emerald-700">Seus dados já estão sendo lidos automaticamente em tempo real.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex flex-col items-center justify-center gap-2 transform transition-transform hover:scale-105">
                <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Calorias Ativas</span>
                <span className="text-sm font-bold text-slate-800">Sincronizando...</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex flex-col items-center justify-center gap-2 transform transition-transform hover:scale-105">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-600">Passos Diários</span>
                <span className="text-sm font-bold text-slate-800">Sincronizando...</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex flex-col items-center justify-center gap-2 transform transition-transform hover:scale-105">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-600">Treinos</span>
                <span className="text-sm font-bold text-slate-800">Sincronizando...</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex flex-col items-center justify-center gap-2 transform transition-transform hover:scale-105">
                <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-600">Frequência Card.</span>
                <span className="text-sm font-bold text-slate-800">Sincronizando...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showInstructions && !user?.isAppleWatchConnected && (
        <Card className="border-emerald-200 bg-emerald-50 mb-6 relative">
          <button 
            onClick={() => setShowInstructions(false)}
            className="absolute top-4 right-4 text-emerald-600 hover:text-emerald-800"
          >
            <X className="h-5 w-5" />
          </button>
          <CardHeader>
            <CardTitle className="text-emerald-800">Como conectar seu Apple Watch</CardTitle>
            <CardDescription className="text-emerald-700">Para sincronizar, siga os passos no seu iPhone:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-emerald-800 text-sm">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Abra o aplicativo <strong>Saúde (Health)</strong> no seu iPhone.</li>
              <li>Toque na sua foto de perfil no canto superior direito.</li>
              <li>Na seção &quot;Privacidade&quot;, toque em <strong>Apps e Serviços</strong>.</li>
              <li>Selecione <strong>Nutrilia</strong> na lista.</li>
              <li>Ative a opção <strong>&quot;Ativar Tudo&quot;</strong> para permitir a leitura de Passos, Frequência Cardíaca e Energia Ativa.</li>
            </ol>
            <div className="pt-4 flex justify-end">
              <Button onClick={() => {
                connectAppleWatch();
                setShowInstructions(false);
              }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Simular Conexão
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-6 pt-4">
        <Card className={user?.isAppleWatchConnected ? "border-blue-200 shadow-blue-100/50" : ""}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-slate-900 text-white rounded-lg flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM13 15V13H11V15H13ZM13 11V7H11V11H13Z" />
                </svg>
              </div>
              {user?.isAppleWatchConnected && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Conectado
                </span>
              )}
            </div>
            <CardTitle>Apple Health</CardTitle>
            <CardDescription>Sincronizando passos, calorias ativas e batimentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className={user?.isAppleWatchConnected ? "font-medium text-emerald-600" : "font-medium text-slate-400"}>
                {user?.isAppleWatchConnected ? "Ativo (Última sync: Há 5 min)" : "Desconectado"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            {user?.isAppleWatchConnected ? (
              <Button onClick={disconnectAppleWatch} variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">Desconectar</Button>
            ) : (
              <Button onClick={() => setShowInstructions(true)} className="w-full gap-2 bg-slate-900 hover:bg-slate-800">
                <LinkIcon className="h-4 w-4" />
                Conectar
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className={user?.isGarminConnected ? "border-[#002A3A] shadow-blue-100/50" : ""}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-[#002A3A] text-white rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6" />
              </div>
              {user?.isGarminConnected && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Conectado
                </span>
              )}
            </div>
            <CardTitle>Garmin Connect</CardTitle>
            <CardDescription>Sincronize seus treinos e métricas avançadas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className={user?.isGarminConnected ? "font-medium text-emerald-600" : "font-medium text-slate-400"}>
                {user?.isGarminConnected ? "Ativo (Última sync: Há 12 min)" : "Desconectado"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            {user?.isGarminConnected ? (
              <Button onClick={disconnectGarmin} variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">Desconectar</Button>
            ) : (
              <Button 
                onClick={() => handleConnectOAuth('garmin')} 
                disabled={isConnecting === 'garmin'}
                className="w-full gap-2 bg-[#002A3A] hover:bg-[#001D29]"
              >
                {isConnecting === 'garmin' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
                Conectar
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className={user?.isGoogleFitConnected ? "border-[#ff4a3d] shadow-red-100/50" : ""}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-[#ff4a3d] text-white rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6" />
              </div>
              {user?.isGoogleFitConnected && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Conectado
                </span>
              )}
            </div>
            <CardTitle>Google Fit</CardTitle>
            <CardDescription>Conecte seus dados do celular e acessórios Android.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className={user?.isGoogleFitConnected ? "font-medium text-emerald-600" : "font-medium text-slate-400"}>
                {user?.isGoogleFitConnected ? "Ativo (Última sync: Agora)" : "Desconectado"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            {user?.isGoogleFitConnected ? (
              <Button onClick={disconnectGoogleFit} variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">Desconectar</Button>
            ) : (
              <Button 
                onClick={() => handleConnectOAuth('google')} 
                disabled={isConnecting === 'google'}
                className="w-full gap-2 bg-[#ff4a3d] hover:bg-[#e03d32]"
              >
                {isConnecting === 'google' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
                Conectar
              </Button>
            )}
          </CardFooter>
        </Card>
        
      </div>
    </div>
  );
}
