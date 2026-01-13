import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { UserProfile, Language } from "../types";

// Initialize client securely. API_KEY is injected by Vite at build time.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiChat = (userProfile: UserProfile, language: Language): Chat => {
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
    try {
        const prompt = language === 'zh'
            ? `Generate a short, powerful motivational quote or fact in Chinese (Simplified) for someone who quit smoking on ${new Date(userProfile.quitDate).toLocaleDateString()}. Keep it under 20 words.`
            : `Generate a short, powerful motivational quote or fact for someone who quit smoking on ${new Date(userProfile.quitDate).toLocaleDateString()}. Keep it under 20 words.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || (language === 'zh' ? "坚持下去，你做得很棒！" : "Keep going, you're doing great!");
    } catch (e) {
        console.error("Failed to generate motivation", e);
        return language === 'zh' ? "每一小时都很重要。你比烟瘾更强大。" : "Every hour counts. You are stronger than the addiction.";
    }
};

export const generateSpeech = async (text: string, language: Language): Promise<string | undefined> => {
    try {
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
    } catch (e) {
        console.error("Failed to generate speech", e);
        return undefined;
    }
};