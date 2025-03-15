
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Loader, AlertCircle, Magic } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { 
  getGeminiResponse, 
  initGeminiAPI, 
  isGeminiInitialized, 
  saveChat, 
  loadChat, 
  createNewChat,
  getChatHistory 
} from "@/lib/gemini";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

// Cool feature: Message suggestions
const messageSuggestions = [
  "Tell me about artificial intelligence",
  "What's the weather like today?",
  "How does blockchain technology work?",
  "Write a short poem about nature",
  "Explain quantum computing in simple terms",
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState<string | null>(localStorage.getItem('gemini_key'));
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('gemini_key'));
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (geminiKey) {
      const success = initGeminiAPI(geminiKey);
      if (!success) {
        toast({
          title: "API Error",
          description: "Could not initialize Gemini API with the provided key",
          variant: "destructive",
        });
        setShowKeyInput(true);
      } else {
        // Load chat history
        loadChatHistory();
        
        // Load current chat if any
        const currentChatId = localStorage.getItem('current_chat_id');
        if (currentChatId) {
          const chatMessages = loadChat(currentChatId);
          if (chatMessages) {
            setMessages(chatMessages);
            setShowSuggestions(false);
          }
        }
      }
    }
  }, [geminiKey, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).key.value;
    localStorage.setItem('gemini_key', input);
    setGeminiKey(input);
    initGeminiAPI(input);
    setShowKeyInput(false);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved",
    });
  };

  const resetKey = () => {
    localStorage.removeItem('gemini_key');
    setGeminiKey(null);
    setShowKeyInput(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (!isGeminiInitialized()) {
      toast({
        title: "API Not Initialized",
        description: "Please set your Gemini API key first",
        variant: "destructive",
      });
      setShowKeyInput(true);
      return;
    }

    // Hide suggestions after first message
    setShowSuggestions(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Save the user message
      saveChat(userMessage);
      
      const response = await getGeminiResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save the assistant response
      saveChat(assistantMessage);
      
      // Refresh chat history
      loadChatHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get response from AI. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleNewChat = () => {
    createNewChat();
    setMessages([]);
    setShowSuggestions(true);
    toast({
      title: "New Chat",
      description: "Started a new conversation"
    });
    loadChatHistory();
  };

  const handleLoadChat = (chatId: string) => {
    const chatMessages = loadChat(chatId);
    if (chatMessages) {
      setMessages(chatMessages);
      setShowSuggestions(false);
      toast({
        title: "Chat Loaded",
        description: "Loaded previous conversation"
      });
    }
  };

  if (showKeyInput) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] max-w-md mx-auto p-4">
        <div className="glass-morphism p-6 rounded-lg w-full">
          <h2 className="text-xl font-bold mb-4 text-primary">Enter Gemini API Key</h2>
          <p className="text-muted-foreground mb-4">
            To use the chat feature, please enter your Google Gemini API key.
          </p>
          <form onSubmit={handleKeySubmit} className="space-y-4">
            <Input 
              name="key"
              type="text"
              placeholder="Enter your Gemini API key"
              required
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Save Key
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chat with AI</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNewChat}
          className="flex items-center space-x-1"
        >
          <span>New Chat</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg glass-morphism bg-opacity-30 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
            <p className="text-muted-foreground mb-6">
              Type your message below to chat with Muhoro GPT
            </p>
            
            {showSuggestions && (
              <div className="w-full max-w-md">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Magic className="w-4 h-4 mr-1" />
                  Try asking about:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {messageSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="truncate max-w-full whitespace-normal text-left h-auto py-1.5"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-lg ${
                message.role === "assistant"
                  ? "bg-secondary"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 p-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 glass-morphism rounded-lg p-3">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={resetKey}
            title="Change API Key"
          >
            <AlertCircle className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
