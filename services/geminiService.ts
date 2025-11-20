import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeEmotion = async (text: string): Promise<AnalysisResult> => {
  // Using Gemini 2.5 Flash for speed and accuracy
  const modelId = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `作为一位专业的情绪分析心理学家，请分析以下文本的情感内容。
      
      文本内容: "${text}"
      
      请提供一个结构化的JSON响应（所有文本内容必须使用中文），包含以下内容：
      1. primaryEmotion: 主要情绪（如：喜悦、愤怒、悲伤、焦虑、平静等）。
      2. intensity: 该主要情绪的强度（0-100）。
      3. sentimentScore: 情感极性分数，从 -100 (极度负面) 到 100 (极度正面)。
      4. breakdown: 6种基本情绪（喜悦、悲伤、愤怒、恐惧、惊讶、厌恶）的详细分析，每种情绪的分数 (0-100)。
      5. keywords: 文本中的关键情感触发词（提取3-5个）。
      6. suggestion: 一句简短、治愈的心理学建议或应对机制（中文）。
      7. colorHex: 代表该情绪的十六进制颜色代码（例如：愤怒用 #EF4444，喜悦用 #F59E0B，悲伤用 #3B82F6，清新明亮色调为主）。
      8. emoji: 一个最能代表该情绪的Emoji表情（如 😄, 😭, 😡, 😱）。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryEmotion: { type: Type.STRING },
            intensity: { type: Type.NUMBER },
            sentimentScore: { type: Type.NUMBER },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  emotion: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                },
              },
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestion: { type: Type.STRING },
            colorHex: { type: Type.STRING },
            emoji: { type: Type.STRING },
          },
          required: ["primaryEmotion", "intensity", "sentimentScore", "breakdown", "keywords", "suggestion", "colorHex", "emoji"],
        },
      },
    });

    if (!response.text) {
      throw new Error("AI未返回结果");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Emotion Analysis Failed:", error);
    throw error;
  }
};