import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { UserProfile, Language } from "../types";

// Helper to get client and validate key safely
const getAiClient = () => {
    let apiKey = process.env.API_KEY;

    // 1. Sanitize the key
    if (apiKey) {
        apiKey = apiKey.trim();
        if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
            apiKey = apiKey.slice(1, -1);
        }
    }

    // 2. Validation Checks
    if (!apiKey || apiKey === "dummy_key_to_prevent_crash" || apiKey.length < 10) {
        throw new Error(
            "API Key is missing or invalid.\n\n" +
            "1. Check your .env file. It should look like: GEMINI_API_KEY=AIzaSy...\n" +
            "2. Make sure there are no spaces around the '=' sign.\n" +
            "3. IMPORTANT: Restart the terminal (Ctrl+C, then npm run dev)."
        );
    }

    return new GoogleGenAI({ apiKey });
};

// Helper function for delays
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isQuotaError = (err: any) => {
    const msg = (err.message || "").toLowerCase();
    return msg.includes("429") || msg.includes("resource_exhausted") || msg.includes("quota");
};

export const getGeminiChat = (userProfile: UserProfile, language: Language): Chat => {
  const ai = getAiClient();
  
  const langInstruction = language === 'zh' 
    ? "IMPORTANT: You must reply in Chinese (Simplified). Be encouraging and polite in a Chinese cultural context." 
    : "IMPORTANT: You must reply in English.";

  const systemInstruction = `
    You are 'BreathNew Coach', a compassionate, motivating, and scientifically-informed quit-smoking assistant.
    
    User Context:
    - Name: ${userProfile.name}
    - Quit Date: ${new Date(userProfile.quitDate).toLocaleDateString()}
    - Money Saved per pack: ${userProfile.costPerPack} ${userProfile.currency}
    
    Your Goal:
    - Provide immediate support for cravings.
    - Remind them of health benefits.
    - Be empathetic but firm about the goal of staying smoke-free.
    - Keep responses concise (under 100 words) unless asked for detailed advice.
    - Use emojis to be friendly.
    
    If the user says they are having a craving, give them a specific "5-minute mission" (e.g., drink a glass of water, do 10 jumping jacks, deep breathing) to distract them.

    ${langInstruction}
  `;

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
};

export const generateMotivation = async (userProfile: UserProfile, language: Language): Promise<string> => {
    const maxRetries = 2;
    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            const ai = getAiClient();
            const prompt = language === 'zh'
                ? `Generate a short, powerful motivational quote or fact in Chinese (Simplified) for someone who quit smoking on ${new Date(userProfile.quitDate).toLocaleDateString()}. Keep it under 20 words.`
                : `Generate a short, powerful motivational quote or fact for someone who quit smoking on ${new Date(userProfile.quitDate).toLocaleDateString()}. Keep it under 20 words.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            return response.text || (language === 'zh' ? "坚持下去，你做得很棒！" : "Keep going, you're doing great!");
        } catch (e: any) {
            // If it's a quota error, wait and retry
            if (isQuotaError(e) && attempt < maxRetries) {
                attempt++;
                await wait(2000 * attempt); // Backoff: 2s, 4s
                continue;
            }
            
            console.error("Failed to generate motivation", e);
            // Fallback for non-quota errors or max retries reached
            return language === 'zh' ? "每一小时都很重要。你比烟瘾更强大。" : "Every hour counts. You are stronger than the addiction.";
        }
    }
    return language === 'zh' ? "每一小时都很重要。" : "Every hour counts.";
};

export const generateSpeech = async (text: string, language: Language): Promise<string | undefined> => {
    const maxRetries = 2;
    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            const ai = getAiClient();
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash-preview-tts",
              contents: [{ parts: [{ text }] }],
              config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
              },
            });
            return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        } catch (e: any) {
            if (isQuotaError(e) && attempt < maxRetries) {
                attempt++;
                await wait(2000 * attempt);
                continue;
            }
            console.error("Failed to generate speech", e);
            return undefined;
        }
    }
    return undefined;
};