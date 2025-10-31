import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { RushPrediction, Monument, MonumentInfo } from '../types';

// Fix: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Identifies a monument from a base64 encoded image.
 * @param base64Image The base64 encoded image string.
 * @param imageType The MIME type of the image.
 * @returns The name of the identified monument.
 */
export const identifyMonument = async (base64Image: string, imageType: string): Promise<string> => {
    // Fix: Use a Gemini model capable of vision tasks.
    const model = 'gemini-2.5-flash';
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: imageType,
        },
    };
    const textPart = {
        text: 'Identify this Indian monument. Respond with only the name of the monument.',
    };

    try {
        // Fix: Call the generateContent method with the model and contents.
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });

        // Fix: Extract text directly from the response object.
        const text = response.text.trim();
        if (!text) {
            throw new Error("Could not identify the monument.");
        }
        return text;
    } catch (error) {
        console.error("Error identifying monument:", error);
        throw new Error("Failed to connect to the AI service. Please try again.");
    }
};


/**
 * Predicts the crowd level for a monument on a specific date.
 * @param monumentName The name of the monument.
 * @param date The date for the prediction.
 * @returns A RushPrediction object.
 */
export const predictRushHour = async (monumentName: string, date: string): Promise<RushPrediction> => {
    // Fix: Use a suitable Gemini model for structured data generation.
    const model = 'gemini-2.5-flash';
    const prompt = `Predict the crowd level for ${monumentName} on ${date}. Consider factors like day of the week, holidays, and typical tourist seasons. Provide the visitor count as a range.`;

    try {
        // Fix: Use generateContent with responseSchema for reliable JSON output.
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        level: {
                            type: Type.STRING,
                            description: 'The predicted crowd level. Can be "Low", "Medium", or "High".'
                        },
                        visitorCount: {
                            type: Type.STRING,
                            description: 'An estimated range for the number of visitors, e.g., "5,000 - 7,000".'
                        },
                        recommendation: {
                            type: Type.STRING,
                            description: 'A brief recommendation based on the predicted crowd level.'
                        },
                    },
                    required: ['level', 'visitorCount', 'recommendation'],
                },
            },
        });

        // Fix: Extract and parse the JSON text from the response.
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as RushPrediction;
    } catch (error) {
        console.error("Error predicting rush hour:", error);
        throw new Error("Failed to get prediction data. Please try again.");
    }
};

/**
 * Retrieves detailed information about a monument.
 * @param monumentName The name of the monument.
 * @returns An object with detailed information.
 */
export const getMonumentInfo = async (monumentName: string): Promise<Omit<MonumentInfo, keyof Monument>> => {
    // Fix: Use a more powerful model for generating detailed, high-quality text.
    const model = 'gemini-2.5-pro';
    const prompt = `Provide detailed information about ${monumentName} in India. Include a description (around 100 words), its history (around 150 words), the best time to visit, and entry fee details. Format the entry fee clearly.`;

    try {
        // Fix: Use generateContent with responseSchema to get structured JSON data.
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING },
                        history: { type: Type.STRING },
                        bestTimeToVisit: { type: Type.STRING },
                        entryFee: { type: Type.STRING },
                    },
                    required: ['description', 'history', 'bestTimeToVisit', 'entryFee'],
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting monument info:", error);
        throw new Error("Failed to load monument details. Please try again.");
    }
};


/**
 * Creates a new chat session with the AI model.
 * @param monumentName Optional context for the chat session.
 * @returns A Chat session object.
 */
export const createChatSession = (monumentName?: string): Chat => {
    const model = 'gemini-2.5-flash';
    const systemInstruction = monumentName
        ? `You are a friendly and knowledgeable AI tour guide specializing in Indian heritage sites. You are currently focused on providing information about ${monumentName}. Answer questions concisely and engagingly.`
        : 'You are a friendly and knowledgeable AI tour guide specializing in Indian heritage sites. Answer questions concisely and engagingly.';
    
    // Fix: Use the ai.chats.create method to initialize a chat session.
    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
};

/**
 * Streams a response from the chat session.
 * @param chat The active chat session.
 * @param message The user's message.
 * @param onChunk Callback function to handle incoming text chunks.
 */
export const streamChatResponse = async (
    chat: Chat,
    message: string,
    onChunk: (chunk: string) => void
): Promise<void> => {
    try {
        // Fix: Use chat.sendMessageStream for streaming responses.
        const result = await chat.sendMessageStream({ message });
        for await (const chunk of result) {
            // Fix: Extract text from each chunk and pass to the callback.
            onChunk(chunk.text);
        }
    } catch(error) {
        console.error("Error in chat stream:", error);
        onChunk("\n\n[Sorry, I encountered an error. Please try again.]");
    }
};
