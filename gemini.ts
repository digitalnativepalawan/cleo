import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY in .env.local");
}

export const genAI = new GoogleGenerativeAI(apiKey);

