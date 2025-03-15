
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const features = [
    {
      icon: MessageSquare,
      title: "Advanced Chat",
      description: "Engage in natural conversations with our AI assistant"
    },
    {
      icon: Sparkles,
      title: "Smart Responses",
      description: "Get intelligent, context-aware responses to your queries"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Your conversations are private and protected"
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Quick responses powered by cutting-edge AI technology"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent animate-fade-in">
          Welcome to Muhoro GPT
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-2xl mx-auto">
          Your intelligent AI assistant for seamless conversations powered by Gemini 1.5 Flash
        </p>
        <div className="space-x-4 animate-fade-in">
          <Button
            size={isMobile ? "default" : "lg"}
            className="animate-fade-in"
            onClick={() => navigate(isSignedIn ? "/chat" : "/sign-in")}
          >
            {isSignedIn ? "Start Chatting" : "Sign In"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          {!isSignedIn && (
            <Button
              size={isMobile ? "default" : "lg"}
              variant="outline"
              className="animate-fade-in"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </Button>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-morphism p-6 rounded-lg text-center hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Try Now Section */}
      <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
        <div className="glass-morphism p-8 rounded-lg animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to experience the power of AI?</h2>
          <p className="text-muted-foreground mb-6">
            Start chatting with Muhoro GPT now and discover how it can assist you with information, creative content, and more.
          </p>
          <Button
            size="lg"
            onClick={() => navigate(isSignedIn ? "/chat" : "/sign-in")}
          >
            Try Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
