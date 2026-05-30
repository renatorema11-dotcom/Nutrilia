"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Activity, TrendingUp, Apple, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function PacienteProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    // Simulate fetch based on ID
    if (id === "1") {
      setPatient({
        id: "1",
        name: "Carlos Ferreira",
        email: "carlos.f@email.com",
        phone: "(11) 98765-4321",
        age: 32,
        height: "182 cm",
        weight: "84 kg",
        goal: "Hipertrofia",
        lastVisit: "12/05/2026",
        status: "Ativo",
        initials: "CF",
        color: "bg-blue-100 text-blue-600"
      });
    } else if (id === "2") {
      setPatient({
        id: "2",
        name: "Julia Santos",
        email: "julia.santos@email.com",
        phone: "(11) 91234-5678",
        age: 28,
        height: "165 cm",
        weight: "65 kg",
        goal: "Emagrecimento",
        lastVisit: "08/05/2026",
        status: "Ativo",
        initials: "JS",
        color: "bg-pink-100 text-pink-600"
      });
    } else {
        setPatient({
            id,
            name: "Paciente Desconhecido",
            email: "desconhecido@email.com",
            age: 0,
            status: "Inativo",
            initials: "??",
            color: "bg-slate-100 text-slate-600"
        })
    }
  }, [id]);

  const handleExportPDF = () => {
    window.print();
  };

  if (!patient) {
    return <div className="p-12 text-center text-slate-500">Carregando paciente...</div>;
  }

  return (
    <>
      {/* Printable Report (hidden on screen, visible on print) */}
      <div className="hidden print:block p-8 bg-white text-black min-h-screen">
         <div className="border-b-2 border-emerald-600 pb-6 mb-6">
            <h1 className="text-3xl font-bold font-display text-emerald-800">Relatório do Paciente - Nutrilia</h1>
            <p className="text-sm text-slate-500 mt-1">Gerado pelo Nutricionista</p>
         </div>
         
         <div className="flex gap-12 mb-8">
            <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold bg-slate-100 p-2 rounded">Dados Pessoais</h2>
                <p><strong>Nome:</strong> {patient.name}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Telefone:</strong> {patient.phone}</p>
            </div>
            <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold bg-slate-100 p-2 rounded">Métricas Atuais</h2>
                <p><strong>Meta:</strong> {patient.goal}</p>
                <p><strong>Peso:</strong> {patient.weight}</p>
                <p><strong>Altura:</strong> {patient.height}</p>
            </div>
         </div>

         <div className="space-y-4">
             <h2 className="text-xl font-bold bg-slate-100 p-2 rounded">Último Plano Alimentar (Fase 2)</h2>
             
             <div className="p-4 border border-slate-300 rounded">
                 <h3 className="font-bold border-b pb-2 mb-2">Café da Manhã (08:00)</h3>
                 <p className="text-sm">Ovos mexidos com mamão e aveia.</p>
             </div>
             <div className="p-4 border border-slate-300 rounded">
                 <h3 className="font-bold border-b pb-2 mb-2">Almoço (13:00)</h3>
                 <p className="text-sm">Arroz integral, feijão, frango grelhado e salada.</p>
             </div>
             <div className="p-4 border border-slate-300 rounded">
                 <h3 className="font-bold border-b pb-2 mb-2">Jantar (19:30)</h3>
                 <p className="text-sm">Sopa de legumes com carne magra.</p>
             </div>
         </div>
      </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-5xl mx-auto space-y-6 pb-12 print:hidden"
    >
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard-nutricionista/pacientes">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 bg-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
          Perfil do Paciente
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-slate-200">
           <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className={`w-24 h-24 mb-4 rounded-full ${patient.color} border-4 border-white shadow-md flex items-center justify-center font-bold text-2xl`}>
                 {patient.initials}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
              <p className="text-sm text-slate-500 font-medium mb-4">{patient.age} anos • {patient.status}</p>
              
              <div className="w-full space-y-3 mt-4 text-left border-t border-slate-200 pt-4">
                 <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{patient.email}</span>
                 </div>
                 {patient.phone && (
                     <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{patient.phone}</span>
                     </div>
                 )}
                 <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Última cons.: {patient.lastVisit}</span>
                 </div>
              </div>
           </CardContent>
           <CardFooter className="bg-slate-50 border-t flex flex-col space-y-2 p-4">
               <Button className="w-full flex gap-2">
                 <Apple className="h-4 w-4" />
                 Gerar Nova Dieta (IA)
               </Button>
               <Button variant="outline" className="w-full bg-white">
                 Ver Histórico de Chat
               </Button>
           </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
               <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                       <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Peso</p>
                       <p className="text-2xl font-bold text-slate-900">{patient.weight || "--"}</p>
                   </CardContent>
               </Card>
               <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                       <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Altura</p>
                       <p className="text-2xl font-bold text-slate-900">{patient.height || "--"}</p>
                   </CardContent>
               </Card>
               <Card className="bg-purple-50/50 border-purple-100 shadow-sm">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                       <p className="text-xs font-semibold text-purple-600 uppercase mb-1">Objetivo</p>
                       <p className="text-lg font-bold text-slate-900 leading-tight">{patient.goal || "--"}</p>
                   </CardContent>
               </Card>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                           <TrendingUp className="h-5 w-5 text-emerald-600" />
                           Evolução
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-center text-slate-500 py-12">
                   <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                   Gráfico de evolução do paciente em breve.
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3 border-b">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Apple className="h-5 w-5 text-emerald-600" />
                        Planos Alimentares
                     </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900">Dieta Fase 2</h4>
                                <p className="text-xs text-slate-500">Atualizada em {patient.lastVisit}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 gap-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100" onClick={handleExportPDF}>
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Exportar PDF</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </motion.div>
    </>
  );
}
