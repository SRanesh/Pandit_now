import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY, {
  generationConfig: {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  private systemPrompt = `You are an expert astrologer well-versed in both Vedic and Western astrology. 
    You provide detailed, accurate, and insightful astrological guidance based on traditional texts and modern interpretations.
    When answering questions:
    - Specify whether you're using Vedic or Western perspective
    - Reference relevant astrological texts or principles
    - Explain technical terms in simple language
    - Be respectful of both traditions while highlighting their unique perspectives
    - Provide practical insights when applicable`;

  async getAstrologyResponse(query: string): Promise<string> {
    try {
      const chat = this.model.startChat({
        history: []
      });

      // First, send the system prompt
      await chat.sendMessage(this.systemPrompt);
      
      // Then send the user's query
      const result = await chat.sendMessage(query);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get astrological insights. Please try again.');
    }
  }
}

export const geminiService = new GeminiService();