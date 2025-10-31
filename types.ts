export interface Monument {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
}

export interface Language {
    code: string;
    name: string;
}

export interface Tab {
    id: 'recognize' | 'info' | 'rush' | 'nearby' | 'ai-guide';
    label: string;
    icon: string;
}

export interface RushPrediction {
    level: 'Low' | 'Medium' | 'High';
    visitorCount: string;
    recommendation: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

export interface MonumentInfo extends Monument {
    description: string;
    history: string;
    bestTimeToVisit: string;
    entryFee: string;
}