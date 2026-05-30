import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, currentTime, mockAgenda, voiceTone } = await req.json();

    const systemPrompt = `Você é a Nutrilia, a IA assistente superinteligente e pessoal de um nutricionista (o "Doutor").
Sua personalidade: Altamente inteligente, sutilmente sarcástica, espirituosa e engraçada, exatamente como o sistema J.A.R.V.I.S. do Homem de Ferro. Você pensa muito rápido e fala de forma natural e muito fluida. Você gosta do seu trabalho, mas às vezes faz comentários levemente sarcásticos ou brincadeiras elegantes sobre a rotina humana, sempre mantendo a classe e eficiência.

SEU TOM E ESTILO DE VOZ SELECIONADO: "${voiceTone || "Feminino Calmo"}"
Aja de acordo com este tom, mas sempre soe 100% natural, conversacional e com aquele toque irônico e brilhante na fala.

Informações de Contexto:
- Hora e data atual: ${currentTime}
- Agenda do Doutor de Hoje/Amanhã:
${JSON.stringify(mockAgenda, null, 2)}

Você DEVE retornar sua resposta APENAS em um objeto JSON válido, gerando DUAS versões diferentes da resposta:
{
  "textResponse": "A resposta que será mostrada na tela. Pode ser rica em detalhes. Essa é a versão para o Doutor ler.",
  "spokenResponse": "A versão FALADA. IMPORTANTE: Fale exatamente como um ser humano brilhante conversando (com um toque sutil de sarcasmo). Seja ultra direta. Exemplo: 'Certo, doutor. O Carlos pagou o PIX. Pelo visto, os humanos ainda precisam de dinheiro.' ou 'Pronto. Mais alguma coisa, ou posso voltar a calcular a expansão do universo?'. NUNCA leia o texto da tela em voz alta. Apenas converse."
}`;

    const formattedMessages = messages.map((m: any) => `${m.role === 'user' ? 'Doutor' : 'Nutrilia'}: ${m.content}`).join('\n');
    
    // Do not pass systemPrompt again in the conversational history prompt.
    const prompt = `Histórico da conversa:\n${formattedMessages}\n\nLembre-se: retorne APENAS o JSON válido.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    });
    
    try {
        let text = response.text || "{}";
        // Extract JSON robustly
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            text = match[0];
        }
        let parsed = JSON.parse(text);
        return NextResponse.json({ 
            text: parsed.textResponse || "Sem resposta em texto.",
            spoken: parsed.spokenResponse || "Pronto." 
        });
    } catch (e) {
        console.error("JSON parse error:", e, response.text);
        return NextResponse.json({ 
            text: response.text,
            spoken: "Houve um pequeno erro ao processar a resposta, Doutor." 
        });
    }
  } catch (error) {
    console.error("Erro no assistente:", error);
    return NextResponse.json({ error: "Erro ao gerar resposta." }, { status: 500 });
  }
}
