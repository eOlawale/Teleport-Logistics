import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLogisticsAdvice = async (
  query: string,
  context: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable (Missing Key)";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are "Tele", an expert logistics coordinator and AI assistant for the Teleport platform.
        Teleport is a high-end delivery and ride-sharing aggregator.
        
        Context about the user's business/situation:
        ${context}

        User Query:
        ${query}

        Provide a concise, professional, and actionable response. Focus on cost-saving, route optimization, and efficiency.
        If the user asks about specific prices, simulate an intelligent estimate based on market trends (Uber/Lyft).
        Keep your tone helpful, futuristic, and efficient.
      `,
    });
    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the logistics network right now. Please try again.";
  }
};

export const analyzeBusinessEfficiency = async (
  data: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Analysis Unavailable";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyze the following weekly business delivery data JSON and provide 3 key insights to save money or improve speed.
        Data: ${data}
        
        Format the output as a simple Markdown list.
      `,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Could not analyze data at this time.";
  }
};
