
# Purv Vaibhav - Your AI Guide to India's Heritage

<p align="center">
  <img src="https://raw.githubusercontent.com/user-attachments/assets/91c10d3f-8461-460b-870a-0d85a089d4d8" alt="Purv Vaibhav Logo" width="150"/>
</p>

<h3 align="center"> Ancient Glory, Modern Technology </h3>

<p align="center">
  <strong>An intelligent cultural tourism application that uses the power of Google's Gemini AI to bring the magnificent history of Indian monuments to life.</strong>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript">
  <img alt="Gemini AI" src="https://img.shields.io/badge/Google%20Gemini-AI%20Powered-purple?style=for-the-badge&logo=google-gemini">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-3.x-blue?style=for-the-badge&logo=tailwind-css&color=38BDF8">
</p>

---

**Purv Vaibhav** (meaning *Ancient Glory*) is a cutting-edge web application designed for tourists, history enthusiasts, and students. It acts as a personal, AI-powered guide, capable of identifying monuments from a photo, providing rich historical context, predicting crowd levels, and answering questions in a natural, conversational way. This project showcases a modern, serverless frontend architecture where all complex logic—from vision to structured data generation—is handled by the versatile Google Gemini API.

##  Key Features

| Feature                  | Description                                                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
|  **AI Monument Recognition** | Upload an image or use your device's camera to instantly identify famous Indian monuments.                                               |
|  **In-Depth Information**  | Get detailed, AI-generated information including history, architectural style, key facts, visitor guidelines, and preservation tips.     |
|  **Text-to-Speech**        | Listen to the monument's details with a built-in audio narration feature.                                                                |
|  **Crowd Prediction**      | Plan your visit perfectly by getting an AI-powered prediction of crowd levels for any given day.                                         |
|  **Nearby Discovery**       | Use your geolocation to find monuments near you, sort them by distance, and plan your heritage trail.                                  |
| **Conversational AI Guide**| Chat with a friendly AI guide about any monument. Ask about timings, ticket prices, history, or even local food recommendations.        |
|  **Stunning UI/UX**        | Experience a beautiful, responsive interface with a "glassmorphism" design, dynamic backgrounds, smooth animations, and a dark mode. |

##  Technology Stack

-   **Frontend**: React, TypeScript
-   **AI & Backend Logic**: Google Gemini API (`gemini-2.5-flash`)
    -   **Vision Model**: For monument recognition from images.
    -   **JSON Mode**: For generating structured data (monument info, crowd predictions).
    -   **Chat Model**: For the conversational AI guide.
-   **Styling**: Tailwind CSS
-   **Icons**: Phosphor Icons
-   **Local Development**: `npx serve`

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes `npx`) installed on your system.

### Installation & Setup

1.  **Create Your Project Folder**
    Create a new folder for the project and replicate the file structure provided. Place all the project files (`.tsx`, `.ts`, `.html`, etc.) in their respective directories.

2.  ** Crucial Step: Add Your Gemini API Key**
    This application will not work without a valid Google Gemini API key.

    -   Open the file: `services/geminiService.ts`.
    -   Find the following line:
        ```typescript
        // Per guidelines, initialize with apiKey from process.env
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        ```
    -   **Replace** that line with your actual API key like this:
        ```typescript
        // Add your Gemini API Key here
        const API_KEY = "PASTE_YOUR_API_KEY_HERE";
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        ```
    -   Replace `PASTE_YOUR_API_KEY_HERE` with your key.

3.  **Run the Local Server**
    -   Open your terminal or command prompt.
    -   Navigate to the root directory of your project (`purv-vaibhav`).
    -   Run the following command:
        ```bash
        npx serve
        ```
    -   This will start a local web server.

4.  **Launch the Application**
    -   Open your web browser and go to the URL provided by the `serve` command, which is usually:
        [http://localhost:3000](http://localhost:3000)

You should now see the "Purv Vaibhav" application running!

##  Project Structure

The project is organized into logical folders to keep the codebase clean and maintainable.

```
/
├── components/         # Reusable React components
│   ├── common/         # Generic components like Button, Card, Spinner
│   ├── AiChatbot.tsx
│   └── ...             # Other feature-specific components
├── services/           # Modules for external API communication
│   └── geminiService.ts# All logic for interacting with the Google Gemini API
├── utils/              # Utility functions (e.g., location calculations)
│   └── location.ts
├── App.tsx             # Main application component and layout
├── constants.ts        # Application-wide constants (monument list, tabs)
├── types.ts            # TypeScript type definitions
├── index.html          # The main HTML file
└── index.tsx           # The entry point of the React application
```

##  (Future Enhancements)

This project has a lot of potential for growth. Here are some features I'm considering for future versions:

-   [ ] **Multilingual Support**: Extend language support for UI, AI-generated content, and text-to-speech.
-   [ ] **User Accounts**: Allow users to save favorite monuments and chat history.
-   [ ] **Offline Mode**: Cache monument data for access without an internet connection.
-   [ ] **Augmented Reality (AR)**: Create an AR view to overlay historical information on a live camera feed of a monument.

---

Made with ❤️ for the love of Indian heritage.
