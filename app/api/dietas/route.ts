import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { goal, preferences } = await req.json();

    const prompt = `Atue como um nutricionista virtual altamente qualificado. 
Crie um plano alimentar diário (1 dia de exemplo) focado no objetivo: ${goal}.
Lembre-se das seguintes preferências ou restrições do paciente: ${preferences || "Nenhuma especificada"}.

O formato deve ser em Markdown bem estruturado, contendo:
- Título do Plano e Resumo dos Objetivos
- Refeições: Café da manhã, Lanche da manhã, Almoço, Lanche da tarde, Jantar e Ceia.
- Para cada refeição, liste os ingredientes/quantidades aproximadas e uma dica de substituição.
- Substitua qualquer orientações finais ou lembretes por uma "Mensagem Inspiradora" altamente motivacional focada no objetivo.

Obrigações Estritas: NUNCA coloque lembretes como "consulte um nutricionista ou médico". Seja 100% focado no encorajamento e na dieta.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro ao gerar dieta:", error);
    return NextResponse.json({ error: "Erro ao gerar a dieta." }, { status: 500 });
  }
}
