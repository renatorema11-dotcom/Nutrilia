"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MessageSquarePlus, Video, Calendar, MapPin, Clock, Award } from "lucide-react";

const professionalsData: Record<string, any> = {
  "1": {
    name: "Dr. Especialista 1",
    specialty: "Nutrição Comportamental",
    crn: "CRN 12341",
    rating: 4.9,
    reviews: 124,
    description: "Especialista em comportamento alimentar e transtornos alimentares. Minha abordagem foca em construir uma relação saudável com a comida, sem dietas restritivas.",
    education: "Doutorado pela USP",
    location: "São Paulo, SP (também atende online)",
    availability: "Segunda a Quinta, 09h às 18h",
    tags: ["Veganismo", "Intolerâncias", "Mindful Eating"]
  },
  "2": {
    name: "Dr. Especialista 2",
    specialty: "Nutrição Esportiva",
    crn: "CRN 12342",
    rating: 4.8,
    reviews: 89,
    description: "Foco no emagrecimento saudável e ganho de massa muscular. Acompanhamento para atletas amadores e profissionais, com planejamento individualizado focado em performance.",
    education: "Mestrado pela UNICAMP",
    location: "Atendimento Online",
    availability: "Terça a Sábado, 08h às 17h",
    tags: ["Hipertrofia", "Performance", "Suplementação"]
  },
  "3": {
    name: "Dra. Especialista 3",
    specialty: "Nutrição Clínica",
    crn: "CRN 12343",
    rating: 5.0,
    reviews: 205,
    description: "Ampla experiência no tratamento nutricional de doenças crônicas como diabetes, hipertensão e doenças autoimunes. Foco na saúde integrativa e longevidade.",
    education: "Especialização pelo Albert Einstein",
    location: "Rio de Janeiro, RJ (também atende online)",
    availability: "Segunda a Sexta, 10h às 19h",
    tags: ["Diabetes", "Saúde da Mulher", "Longevidade"]
  }
};

export default function ProfessionalProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const professional = professionalsData[id] || professionalsData["1"];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Button 
        variant="ghost" 
        className="gap-2 text-slate-500 hover:text-slate-800 -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Atendimento
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden border-slate-200">
            <div className="h-32 bg-emerald-600/10" />
            <CardContent className="pt-0 relative px-6 pb-6 text-center flex flex-col items-center">
              <div className="h-28 w-28 rounded-full overflow-hidden bg-white p-1 border border-slate-200 -mt-14 mb-4">
                <img 
                  src={`https://picsum.photos/seed/doc${id}/200`} 
                  alt={professional.name} 
                  className="h-full w-full object-cover rounded-full" 
                />
              </div>
              <h1 className="text-xl font-bold font-display text-slate-900">{professional.name}</h1>
              <p className="text-emerald-700 font-medium text-sm mb-1">{professional.specialty}</p>
              <p className="text-xs text-slate-500 mb-4">{professional.crn}</p>

              <div className="flex items-center justify-center gap-1 text-amber-500 font-medium bg-amber-50 px-3 py-1.5 rounded-full mb-6">
                <Star className="h-4 w-4 fill-amber-500" />
                {professional.rating} <span className="text-amber-700/60 text-xs ml-1">({professional.reviews} avaliações)</span>
              </div>

              <div className="w-full space-y-3">
                <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Calendar className="h-4 w-4" /> Agendar Consulta
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => router.push(`/dashboard/atendimento/chat/${id}`)}
                >
                  <MessageSquarePlus className="h-4 w-4" /> Enviar Mensagem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Sobre o Profissional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-slate-600 leading-relaxed">
                  {professional.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {professional.tags.map((tag: string) => (
                  <span key={tag} className="text-xs uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Formação</h4>
                  <p className="text-sm text-slate-600">{professional.education}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Local de Atendimento</h4>
                  <p className="text-sm text-slate-600">{professional.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Horário de Disponibilidade</h4>
                  <p className="text-sm text-slate-600">{professional.availability}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Serviços e Valores</CardTitle>
              <CardDescription>Valores de referência para particular</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-slate-400" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Primeira Consulta (Online)</h4>
                    <p className="text-xs text-slate-500">Duração: 60 minutos</p>
                  </div>
                </div>
                <div className="font-bold text-emerald-700">R$ 250</div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-slate-400" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Consulta de Retorno</h4>
                    <p className="text-xs text-slate-500">Duração: 45 minutos</p>
                  </div>
                </div>
                <div className="font-bold text-emerald-700">R$ 150</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
