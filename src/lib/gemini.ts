
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

// Initialize the API with a key
export function initGeminiAPI(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey);
  return true;
}

// Check if API is initialized
export function isGeminiInitialized() {
  return genAI !== null;
}

export async function getGeminiResponse(prompt: string) {
  if (!genAI) {
    throw new Error("Gemini API not initialized. Please set the API key first.");
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    throw error;
  }
}
