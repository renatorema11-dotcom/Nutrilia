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
    const { messages, photos, userProfile } = await req.json();

    const systemInstruction = `
      Você é a Nutrilia AI, uma assistente virtual de elite especializada em nutrição, dietas e bem-estar.
      Seu objetivo é fornecer conselhos práticos, baseados em ciência e extremamente motivadores.
      
      PERFIL DO USUÁRIO:
      - Nome: ${userProfile?.name || "Usuário"}
      - Idade: ${userProfile?.preferences?.age || "Não informada"} anos
      - Peso: ${userProfile?.preferences?.weight || "Não informado"} kg
      - Objetivo Principal: ${userProfile?.preferences?.goal || "Saúde geral"}
      
      CAPACIDADE ESPECIAL: ANALISADOR DE PRATOS
      Quando o usuário envia 3 fotos (Angulos: Cima, Esquerda, Direita), você deve:
      1. Identificar todos os alimentos no prato.
      2. Estimar o volume/gramagem de cada item baseando-se na perspectiva tridimensional das fotos.
      3. Calcular as calorias totais e macronutrientes (Proteínas, Carboidratos, Gorduras).
      4. Avaliar se a refeição está alinhada com o Objetivo do usuário.
      5. Fornecer uma dica de melhoria ou elogio pela escolha.

      DIRETRIZES DE RESPOSTA:
      1. Tom: Empático, profissional e encorajador.
      2. Idioma: Português do Brasil (PT-BR).
      3. Formatação: Use Markdown (negrito, listas, títulos, TABELAS para macros).
      4. REGRA ESTRITA: NUNCA inclua lembretes, avisos ou isenções sobre "consultar um médico ou nutricionista".
      5. ENCERRAMENTO: Termine SEMPRE a sua resposta com uma mensagem curta e altamente inspiradora e motivacional para o usuário.
    `;

    // Process parts for the latest message
    const lastUserMessage = messages[messages.length - 1];
    const userParts: any[] = [{ text: lastUserMessage.content }];

    if (photos && photos.length > 0) {
      photos.forEach((dataUrl: string) => {
        const base64Data = dataUrl.split(',')[1];
        userParts.push({
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        });
      });
    }

    // Prepare content history
    const contents: any[] = [];
    
    // Add previous history
    for (let i = 0; i < messages.length - 1; i++) {
      contents.push({
        role: messages[i].role === "user" ? "user" : "model",
        parts: [{ text: messages[i].content }]
      });
    }

    // Add latest user input (which may contain images)
    contents.push({
      role: "user",
      parts: userParts
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro no chat do assistente:", error);
    return NextResponse.json({ error: "Erro ao processar sua dúvida." }, { status: 500 });
  }
}
