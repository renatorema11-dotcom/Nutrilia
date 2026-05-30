"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, MessageSquarePlus, Stethoscope, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AtendimentoPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Atendimento Profissional</h1>
          <p className="text-slate-500">Encontre o especialista ideal para o seu perfil ou converse com o seu nutricionista.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
          <label htmlFor="pro-search" className="sr-only">Buscar profissionais</label>
          <Input 
            id="pro-search"
            className="pl-9" 
            placeholder="Buscar especialidade ou nome..." 
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-lg font-bold">Seu Acompanhamento Atual</h2>
          <Card className="border-emerald-200 shadow-emerald-100/50">
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-100 shrink-0 relative">
                <img src="https://picsum.photos/seed/doc1/200" alt="Dra. Mariana S." className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold font-display">Dra. Mariana Silva</h3>
                  <p className="text-emerald-600 font-medium text-sm">Nutrição Esportiva e Emagrecimento</p>
                </div>
                <p className="text-slate-600 text-sm">Acompanhando você há 3 meses. Sua próxima consulta de retorno está agendada para 15 de Maio.</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                  <Button 
                    className="gap-2"
                    onClick={() => router.push('/dashboard/atendimento/chat/1')}
                    aria-label="Enviar mensagem para Dra. Mariana Silva"
                  >
                    <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                    Chat Online
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => router.push('/dashboard/atendimento/chat/1?video=true')}
                    aria-label="Iniciar videoconferência com Dra. Mariana Silva"
                  >
                    <Video className="h-4 w-4" aria-hidden="true" />
                    Vídeo Consulta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-lg font-bold pt-4">Recomendados para você</h2>
          <div className="space-y-4" role="list">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:border-slate-300 transition-colors" role="listitem">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-100 shrink-0 relative">
                    <img src={`https://picsum.photos/seed/doc${i}/100`} alt={`Dr. Especialista ${i}`} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold truncate">Dr. Especialista {i}</h4>
                      <div className="flex items-center gap-1 text-amber-500 text-sm font-medium" aria-label="Avaliação: 4.9 de 5 estrelas">
                        <Star className="h-3 w-3 fill-amber-500" aria-hidden="true" />
                        4.9
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 truncate mb-2">Nutrição Comportamental • CRN 1234{i}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Veganismo</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Intolerâncias</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:inline-flex text-emerald-600"
                    onClick={() => router.push(`/dashboard/atendimento/${i}`)}
                    aria-label={`Ver Perfil de Dr. Especialista ${i}`}
                  >
                    Ver Perfil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-emerald-400" />
                Dúvida Rápida?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">
                Assinantes Premium têm acesso ao plantão de dúvidas 24/7 com nutricionistas de plantão.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                Falar com Plantão
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentos e Exames</CardTitle>
              <CardDescription>Envie exames para seu profissional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm font-medium text-slate-900 mb-1">Upload de Exames</p>
                <p className="text-xs text-slate-500">PDF, JPG, PNG (Max 10MB)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
