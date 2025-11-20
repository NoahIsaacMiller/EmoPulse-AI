import { BackendResponse } from "../types";
import { GoogleGenAI } from "@google/genai";

// ============================================================================
// CONFIGURATION
// ============================================================================
const LOCAL_API_URL = 'http://localhost:8088/analyze';

// ============================================================================
// HELPERS
// ============================================================================
const cleanJsonResponse = (text: string): string => {
  let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    clean = clean.substring(start, end + 1);
  }
  return clean;
};

const fallbackResponse = (errorMsg: string): BackendResponse => ({
  primary_emotion: "系统错误",
  score: 0,
  sentiment_polarity: 0,
  details: [
    { name: "错误", value: 100 },
    { name: "重试", value: 0 },
    { name: "链接", value: 0 },
    { name: "超时", value: 0 },
    { name: "未知", value: 0 },
    { name: "异常", value: 0 }
  ],
  emoji: "😵‍💫",
  theme_color: "#FF5252", // Bright Red for error
  comment: errorMsg || "无法连接分析服务，请检查网络或本地后端。"
});

// ============================================================================
// LOCAL ENGINE (Python Flask)
// ============================================================================
export const analyzeLocal = async (text: string): Promise<BackendResponse> => {
  try {
    const response = await fetch(LOCAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error(`本地服务错误: ${response.statusText}`);
    const data = await response.json();
    return data as BackendResponse;
  } catch (error) {
    console.error("Local Engine Error:", error);
    throw error; 
  }
};

// ============================================================================
// CLOUD ENGINE (Google Gemini)
// ============================================================================
export const analyzeCloud = async (text: string): Promise<BackendResponse> => {
  try {
    // @ts-ignore - Environment variable injection
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("缺少 Google API Key");

    const ai = new GoogleGenAI({ apiKey });
    
    // Prompt design to match the Python backend's output format
    const prompt = `
    分析文本: "${text}"
    
    作为情绪分析专家，请返回严格的 JSON 格式（不要 Markdown 标记）。
    字段要求：
    1. primary_emotion: 主导情绪名称(如: 兴奋, 焦虑, 宁静)
    2. score: 情绪强度(0-100)
    3. sentiment_polarity: 情感极性(-100到100，负数消极，正数积极)
    4. details: 数组，包含6个维度的具体数值(name: string, value: number)。维度固定为：快乐, 悲伤, 愤怒, 恐惧, 惊讶, 厌恶。
    5. emoji: 一个最能代表该情绪的 Unicode Emoji (严禁代码)
    6. theme_color: 推荐的十六进制颜色代码
    7. comment: 30字以内的犀利中文点评
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonStr = cleanJsonResponse(response.text || "{}");
    const data = JSON.parse(jsonStr);
    
    // Simple validation/patching
    if(!data.details) {
       data.details = [
          {name: "快乐", value: 10}, {name: "悲伤", value: 10},
          {name: "愤怒", value: 10}, {name: "恐惧", value: 10},
          {name: "惊讶", value: 10}, {name: "厌恶", value: 10}
       ];
    }
    
    return data as BackendResponse;

  } catch (error) {
    console.error("Cloud Engine Error:", error);
    throw error;
  }
};