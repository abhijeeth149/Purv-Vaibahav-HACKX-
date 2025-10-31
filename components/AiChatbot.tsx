import React, { useState, useEffect, useRef } from 'react';
import { createChatSession, streamChatResponse } from '../services/geminiService';
import type { Monument, ChatMessage } from '../types';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import type { Chat } from '@google/genai';


interface AiChatbotProps {
    currentMonument: Monument | null;
}

const AiChatbot: React.FC<AiChatbotProps> = ({ currentMonument }) => {
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            const initialMessage = currentMonument 
                ? `Hello! I'm your AI guide. How can I help you with your visit to ${currentMonument.name}?`
                : `Hello! I'm your AI guide for Indian heritage sites. Ask me anything!`;

            setMessages([{ sender: 'bot', text: initialMessage, timestamp: new Date().toISOString() }]);
            const session = createChatSession(currentMonument?.name);
            setChatSession(session);
        };
        initChat();
    }, [currentMonument]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || userInput;
        if (!textToSend.trim() || !chatSession || isLoading) return;

        const newUserMessage: ChatMessage = { sender: 'user', text: textToSend, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const botMessageId = `bot-${Date.now()}`;
        setMessages(prev => [...prev, { sender: 'bot', text: '', timestamp: botMessageId }]);

        await streamChatResponse(chatSession, textToSend, (chunk) => {
            setMessages(prev => prev.map(msg => 
                msg.timestamp === botMessageId 
                ? { ...msg, text: msg.text + chunk }
                : msg
            ));
        });
        
        setIsLoading(false);
    };

    const quickActionButtons = [
        `Tell me about ${currentMonument?.name || 'the Taj Mahal'}`,
        'Best time to visit?',
        'What are the entry fees?',
        'Nearby attractions?',
    ];

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 mb-4">AI Heritage Guide</h2>
            <div className="flex-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 overflow-hidden flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{
                    backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0),
                        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)
                    `,
                    backgroundSize: '20px 20px'
                }}>
                    {messages.map((msg) => (
                        <div key={msg.timestamp} className={`flex items-end gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                                     <i className="ph-bold ph-robot text-lg text-white"></i>
                                </div>
                            )}
                            <div className={`max-w-md lg:max-w-lg p-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-lg' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                {msg.text === '' && <Spinner size="sm" />}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                 { messages.length <= 1 &&
                    <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/60 flex flex-wrap gap-2 justify-center">
                        {quickActionButtons.map(text => (
                            <button key={text} onClick={() => handleSendMessage(text)} className="px-3 py-1.5 bg-gray-500/10 dark:bg-gray-400/10 rounded-full text-sm hover:bg-primary-500/20 dark:hover:bg-primary-400/20 transition-colors duration-200">
                                {text}
                            </button>
                        ))}
                    </div>
                }
                <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask about history, timings, etc..."
                            className="flex-1 p-2.5 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow shadow-sm"
                            disabled={isLoading}
                        />
                        <Button onClick={() => handleSendMessage()} disabled={isLoading || !userInput.trim()} isLoading={isLoading} className="rounded-lg !py-3">
                             <i className="ph-bold ph-paper-plane-tilt text-lg"></i>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiChatbot;