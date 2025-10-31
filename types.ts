export interface Monument {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
}

export interface Tab {
    id: 'recognize' | 'info' | 'rush' | 'nearby' | 'chat';
    label: string;
    icon: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

export interface Language {
    code: string;
    name: string;
}

export interface RushPrediction {
    level: 'Low' | 'Medium' | 'High';
    visitorCount: string;
    recommendation: string;
}

export interface MonumentInfo {
    summary: string;
    architecture: string;
    keyFacts: { label: string; value: string }[];
    guidelines: string;
    precautions: string;
}