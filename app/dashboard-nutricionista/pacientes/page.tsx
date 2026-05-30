"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function MeusPacientesPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([
    {
      id: "1",
      name: "Carlos Ferreira",
      email: "carlos.f@email.com",
      age: 32,
      lastVisit: "12/05/2026",
      status: "Ativo",
      initials: "CF",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "2",
      name: "Julia Santos",
      email: "julia.santos@email.com",
      age: 28,
      lastVisit: "08/05/2026",
      status: "Ativo",
      initials: "JS",
      color: "bg-pink-100 text-pink-600"
    }
  ]);
  const [search, setSearch] = useState("");

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Simulate removing
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Meus Pacientes
          </h1>
          <p className="text-slate-500">Gerencie seus pacientes e acompanhe seus progressos.</p>
        </div>

      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Todos os Pacientes</CardTitle>
              <CardDescription>Lista completa de pacientes cadastrados.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar paciente..." 
                className="pl-8 bg-slate-50" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredPatients.length > 0 ? filteredPatients.map(patient => (
              <div 
                key={patient.id}
                onClick={() => router.push(`/dashboard-nutricionista/pacientes/${patient.id}`)}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                 <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 ${patient.color} rounded-full flex items-center justify-center font-bold`}>
                      {patient.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {patient.name}
                      </h4>
                      <p className="text-xs text-slate-500">{patient.email} • {patient.age} anos</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="hidden sm:block text-left">
                       <p className="text-xs text-slate-500 font-medium uppercase">Última Consulta</p>
                       <p className="text-sm font-semibold text-slate-700">{patient.lastVisit}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                      {patient.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleRemove(e, patient.id)}
                      title="Remover paciente"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
              </div>
            )) : (
              <div className="py-12 text-center text-slate-500">
                Nenhum paciente encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
