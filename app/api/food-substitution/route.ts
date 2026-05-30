import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { mealDescription } = await req.json();

    if (!mealDescription) {
      return NextResponse.json({ error: "Missing mealDescription" }, { status: 400 });
    }

    const prompt = `Você é um nutricionista especialista. O paciente tem a seguinte refeição no planejamento alimentar: "${mealDescription}".
Por favor, sugira uma única opção de substituição direta, prática e rápida que mantenha aproximadamente o mesmo valor calórico e perfil de macronutrientes.
Retorne apenas o texto da sugestão de forma direta e amigável.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ suggestion: response.text });
  } catch (error) {
    console.error("Error generating substitution:", error);
    return NextResponse.json({ error: "Failed to generate substitution." }, { status: 500 });
  }
}
