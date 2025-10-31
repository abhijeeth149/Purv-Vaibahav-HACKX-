import { GoogleGenAI, Chat, Type } from '@google/genai';
import type { RushPrediction, MonumentInfo } from '../types';

// Per guidelines, initialize with apiKey from process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Identifies a monument from an image.
 * @param base64Image The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns The name of the identified monument.
 */
export const identifyMonument = async (base64Image: string, mimeType: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };

    const textPart = {
        text: "Identify the Indian monument in this image. Respond with only the name of the monument. If it's not a famous Indian monument, say 'Unknown Monument'.",
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // A good model for vision tasks
        contents: { parts: [imagePart, textPart] },
    });

    const text = response.text.trim();
    if (!text) {
        throw new Error("Could not identify the monument. The response was empty.");
    }
    return text;
};

/**
 * Gets detailed information about a monument.
 * @param monumentName The name of the monument.
 * @returns Detailed information about the monument.
 */
export const getMonumentInfo = async (monumentName: string): Promise<MonumentInfo> => {
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: 'A brief summary of the monument.' },
            architecture: { type: Type.STRING, description: 'Details about the architectural style.' },
            keyFacts: {
                type: Type.ARRAY,
                description: 'A list of key facts, each with a label and value.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.STRING },
                    },
                    required: ['label', 'value'],
                },
            },
            guidelines: { type: Type.STRING, description: 'Guidelines for visitors.' },
            precautions: { type: Type.STRING, description: 'Preservation precautions to be aware of.' },
        },
        required: ['summary', 'architecture', 'keyFacts', 'guidelines', 'precautions'],
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide detailed information for the monument: ${monumentName}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as MonumentInfo;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The model returned an invalid data format for monument information.");
    }
};

/**
 * Predicts the crowd level for a monument on a specific date.
 * @param monumentName The name of the monument.
 * @param date The date for the prediction.
 * @returns A prediction of the crowd level.
 */
export const predictRushHour = async (monumentName: string, date: string): Promise<RushPrediction> => {
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            level: { type: Type.STRING, description: "Predicted crowd level. Can be 'Low', 'Medium', or 'High'." },
            visitorCount: { type: Type.STRING, description: "Estimated number of visitors, e.g., '5,000 - 8,000'." },
            recommendation: { type: Type.STRING, description: "A brief recommendation for visitors based on the prediction." },
        },
        required: ['level', 'visitorCount', 'recommendation'],
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Predict the crowd level for ${monumentName} on the date: ${date}. Consider factors like day of the week, holidays, and season.`,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });
    
    const jsonText = response.text.trim();
    try {
        const prediction = JSON.parse(jsonText) as RushPrediction;
        // Ensure level is one of the expected values.
        if (!['Low', 'Medium', 'High'].includes(prediction.level)) {
            prediction.level = 'Medium'; // Default fallback
        }
        return prediction;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The model returned an invalid data format for crowd prediction.");
    }
};

/**
 * Creates a new chat session.
 * @param monumentName Optional name of a monument to focus the chat on.
 * @returns A new chat session instance.
 */
export const createChatSession = (monumentName?: string): Chat => {
    const systemInstruction = monumentName
        ? `You are a friendly and knowledgeable AI tour guide specializing in Indian heritage sites. You are currently helping a visitor at ${monumentName}. Answer questions concisely and engagingly. Do not make up facts.`
        : `You are a friendly and knowledgeable AI tour guide specializing in Indian heritage sites. Answer questions concisely and engagingly. Do not make up facts.`;
    
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};

/**
 * Streams a chat response from the model.
 * @param chat The active chat session.
 * @param message The user's message.
 * @param onChunk A callback function to handle each chunk of the response.
 */
export const streamChatResponse = async (chat: Chat, message: string, onChunk: (chunk: string) => void): Promise<void> => {
    try {
        const result = await chat.sendMessageStream({ message });
        for await (const chunk of result) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error streaming chat response:", error);
        onChunk("I'm sorry, I encountered an error. Please try again.");
    }
};
