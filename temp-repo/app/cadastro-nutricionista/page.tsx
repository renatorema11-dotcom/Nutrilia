"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Stethoscope, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function CadastroNutricionistaPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const { registerNutricionista } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nome: "",
    crn: "",
    certificado: "",
    email: "",
    senha: "",
    especialidade: "Nutrição Clínica",
    bio: "",
    valor: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("O arquivo do certificado deve ter no máximo 10MB.");
        setFormData({ ...formData, certificado: "" });
        e.target.value = '';
        return;
      }
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError("Formato inválido. Aceitamos apenas PDF, PNG ou JPG.");
        setFormData({ ...formData, certificado: "" });
        e.target.value = '';
        return;
      }
      
      setFormData({ ...formData, certificado: e.target.value });
      if (error) setError("");
    } else {
      setFormData({ ...formData, certificado: "" });
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.nome || !formData.crn || !formData.email || !formData.senha || !formData.certificado) {
        setError("Por favor, preencha todos os campos e anexe seu certificado para prosseguir.");
        return;
      }
    } else if (step === 2) {
      if (!formData.especialidade || !formData.bio || !formData.valor) {
        setError("Por favor, preencha todas as informações do seu perfil para prosseguir.");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 text-emerald-600 mb-8 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Apple className="h-5 w-5 text-white" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-slate-800">Nutrilia Pro</span>
      </Link>

      <Card className="w-full max-w-xl shadow-lg border-emerald-100">
        <CardHeader className="text-center bg-emerald-50/50 rounded-t-3xl pb-8 pt-8 border-b border-emerald-50">
          <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-6 w-6" />
          </div>
          <CardTitle className="font-display text-2xl text-slate-800">Junte-se à Plataforma</CardTitle>
          <CardDescription className="text-slate-600">
            Encontre novos pacientes, acompanhe progressos com IA e expanda sua clínica.
          </CardDescription>
          
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className={`h-2 rounded-full transition-all ${step >= 1 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200'}`} />
            <div className={`h-2 rounded-full transition-all ${step >= 2 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200'}`} />
            <div className={`h-2 rounded-full transition-all ${step >= 3 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200'}`} />
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="font-bold text-lg text-slate-800 mb-4">Dados Básicos</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Dr/Dra." className="bg-slate-50" value={formData.nome} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crn">CRN</Label>
                  <Input id="crn" placeholder="00000/UF" className="bg-slate-50" value={formData.crn} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificado">Certificado Profissional</Label>
                <Input id="certificado" type="file" accept=".pdf,.png,.jpg,application/pdf,image/png,image/jpeg" className="bg-slate-50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" value={formData.certificado} onChange={handleFileChange} />
                <p className="text-[10px] text-slate-500">Envie seu diploma ou certificado de especialização para agilizar a verificação. Tamanho máximo: 10MB.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Profissional</Label>
                <Input id="email" type="email" placeholder="contato@suaclinica.com" className="bg-slate-50" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" className="bg-slate-50" value={formData.senha} onChange={handleChange} />
              </div>
              {error && <p className="text-sm font-medium text-red-500 p-3 bg-red-50 rounded-md border border-red-100">{error}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="font-bold text-lg text-slate-800 mb-4">Especialidades e Perfil</h3>
              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade Principal</Label>
                <select id="especialidade" value={formData.especialidade} onChange={handleChange} className="flex h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500">
                  <option value="Nutrição Clínica">Nutrição Clínica</option>
                  <option value="Nutrição Esportiva">Nutrição Esportiva</option>
                  <option value="Emagrecimento">Emagrecimento</option>
                  <option value="Comportamental">Comportamental</option>
                  <option value="Materno-Infantil">Materno-Infantil</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Resumo do Perfil (Bio)</Label>
                <textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 resize-none"
                  placeholder="Conte um pouco sobre sua abordagem e experiência..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor Médio da Consulta (R$)</Label>
                <Input id="valor" type="number" placeholder="150" className="bg-slate-50" value={formData.valor} onChange={handleChange} />
              </div>
              {error && <p className="text-sm font-medium text-red-500 p-3 bg-red-50 rounded-md border border-red-100">{error}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-500 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">Tudo Pronto!</h3>
              <p className="text-slate-600 max-w-sm mx-auto">
                Seu perfil foi pré-cadastrado. Após a validação do seu CRN pela nossa equipe (em até 24h), você aparecerá na busca para milhares de pacientes.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-0 flex flex-col gap-4">
          <div className="flex w-full justify-between items-center">
            {step > 1 && step < 3 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>Voltar</Button>
            )}
            {step === 1 && <div />} {/* Spacer */}
            
            {step < 3 ? (
              <Button className="ml-auto" onClick={handleNextStep}>
                Próximo Passo
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => {
                  registerNutricionista(formData.nome, formData.email, formData.crn, formData.senha);
                }}
              >
                Ir para meu painel Nutricionista
              </Button>
            )}
          </div>
          
          {step === 1 && (
             <p className="text-xs text-slate-500 text-center w-full">
               No próximo passo, solicitaremos detalhes sobre suas especialidades.
             </p>
          )}
          {step === 2 && (
             <p className="text-xs text-slate-500 text-center w-full">
               Ao clicar em avançar, criaremos seu perfil para entrar no processo de aprovação da plataforma.
             </p>
          )}
        </CardFooter>
      </Card>
      
      {step < 3 && (
        <p className="mt-8 text-sm text-slate-500">
          Já possui conta? <Link href="/login" className="text-emerald-600 font-medium hover:underline">Faça login</Link>
        </p>
      )}
    </div>
  );
}
