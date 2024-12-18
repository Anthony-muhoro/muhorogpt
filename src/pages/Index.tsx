import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Loader } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { getGeminiResponse } from "@/lib/gemini";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Muhoro GPT</h1>
          <p className="text-muted-foreground mb-8">Please sign in to continue</p>
          <Button onClick={() => window.location.href = "/sign-in"}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 glass-morphism p-4 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Muhoro GPT</h1>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            New Chat
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            History
          </Button>
        </nav>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <main className="chat-container">
          <div className="message-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`message-content ${
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
              <div className="typing-indicator">
                <div className="typing-dot" style={{ animationDelay: "0s" }} />
                <div className="typing-dot" style={{ animationDelay: "0.2s" }} />
                <div className="typing-dot" style={{ animationDelay: "0.4s" }} />
              </div>
            )}
          </div>
        </main>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 glass-morphism mt-auto">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;