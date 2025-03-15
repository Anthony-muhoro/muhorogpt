
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

// Initialize the API with a key
export function initGeminiAPI(apiKey: string) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    return true;
  } catch (error) {
    console.error('Error initializing Gemini API:', error);
    return false;
  }
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
    // Using gemini-1.5-flash instead of gemini-pro as it's available in the free tier
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Add logging to help debug
    console.log("Sending request to Gemini API with model: gemini-1.5-flash");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error getting Gemini response:', error);
    throw new Error(error?.message || "Failed to get response from Gemini API");
  }
}

export async function getChatHistory() {
  // In a real app, this would fetch from a database
  // For now, we'll return mock data or localStorage data
  const savedHistory = localStorage.getItem('chat_history');
  if (savedHistory) {
    return JSON.parse(savedHistory);
  }
  
  // Return empty array if no history
  return [];
}

export function saveChat(message: { id: string, content: string, role: "user" | "assistant" }) {
  try {
    const history = localStorage.getItem('chat_history');
    let chatHistory = history ? JSON.parse(history) : [];
    
    // Check if this is a new conversation or continuing existing
    const currentChatId = localStorage.getItem('current_chat_id');
    
    if (!currentChatId) {
      // Create a new chat
      const newChatId = Date.now().toString();
      localStorage.setItem('current_chat_id', newChatId);
      
      chatHistory.push({
        id: newChatId,
        title: message.content.substring(0, 30) + '...',
        messages: [message],
        createdAt: new Date().toISOString()
      });
    } else {
      // Add to existing chat
      const chatIndex = chatHistory.findIndex((chat: any) => chat.id === currentChatId);
      if (chatIndex !== -1) {
        chatHistory[chatIndex].messages.push(message);
      } else {
        // Chat ID exists but not found in history, create new
        chatHistory.push({
          id: currentChatId,
          title: message.content.substring(0, 30) + '...',
          messages: [message],
          createdAt: new Date().toISOString()
        });
      }
    }
    
    localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    return true;
  } catch (error) {
    console.error('Error saving chat:', error);
    return false;
  }
}

export function createNewChat() {
  localStorage.removeItem('current_chat_id');
  return true;
}

export function loadChat(chatId: string) {
  try {
    const history = localStorage.getItem('chat_history');
    if (!history) return null;
    
    const chatHistory = JSON.parse(history);
    const chat = chatHistory.find((c: any) => c.id === chatId);
    
    if (chat) {
      localStorage.setItem('current_chat_id', chatId);
      return chat.messages;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading chat:', error);
    return null;
  }
}

export function deleteChat(chatId: string) {
  try {
    const history = localStorage.getItem('chat_history');
    if (!history) return false;
    
    let chatHistory = JSON.parse(history);
    chatHistory = chatHistory.filter((c: any) => c.id !== chatId);
    
    localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    
    // If current chat was deleted, clear current chat id
    const currentChatId = localStorage.getItem('current_chat_id');
    if (currentChatId === chatId) {
      localStorage.removeItem('current_chat_id');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
}
