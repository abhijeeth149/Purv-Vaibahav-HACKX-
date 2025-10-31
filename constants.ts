import type { Monument, Language, Tab } from './types';

export const MONUMENTS: Monument[] = [
    { id: 1, name: "Taj Mahal", latitude: 27.1751, longitude: 78.0421, category: "Mausoleum" },
    { id: 2, name: "Qutub Minar", latitude: 28.5245, longitude: 77.1855, category: "Minaret" },
    { id: 3, name: "India Gate", latitude: 28.6129, longitude: 77.2295, category: "War Memorial" },
    { id: 4, name: "Gateway of India", latitude: 18.9220, longitude: 72.8347, category: "Arch-monument" },
    { id: 5, name: "Hawa Mahal", latitude: 26.9239, longitude: 75.8267, category: "Palace" },
    { id: 6, name: "Mysore Palace", latitude: 12.3052, longitude: 76.6552, category: "Palace" },
    { id: 7, name: "Victoria Memorial", latitude: 22.5448, longitude: 88.3426, category: "Memorial" },
    { id: 8, name: "Charminar", latitude: 17.3616, longitude: 78.4747, category: "Monument" },
    { id: 9, name: "Konark Sun Temple", latitude: 19.8876, longitude: 86.0945, category: "Temple" },
    { id: 10, name: "Red Fort", latitude: 28.6562, longitude: 77.2410, category: "Fort" },
];

export const LANGUAGES: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
];

export const TABS: Tab[] = [
    { id: 'recognize', label: 'Recognize', icon: 'ph-om' },
    { id: 'info', label: 'Information', icon: 'ph-book-open-text' },
    { id: 'rush', label: 'Crowd Predict', icon: 'ph-users-three' },
    { id: 'nearby', label: 'Nearby', icon: 'ph-map-pin' },
    { id: 'ai-guide', label: 'AI Guide', icon: 'ph-robot' },
];