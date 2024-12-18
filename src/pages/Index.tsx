import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Shield, Zap } from "lucide-react";

const Index = () => {
  const { isSignedIn } = useUser();

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
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent animate-fade-in">
          Welcome to Muhoro GPT
        </h1>
        <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
          Your intelligent AI assistant for seamless conversations
        </p>
        <div className="space-x-4">
          <Button
            size="lg"
            className="animate-fade-in"
            onClick={() => window.location.href = isSignedIn ? "/chat" : "/sign-in"}
          >
            {isSignedIn ? "Start Chatting" : "Sign In"}
          </Button>
          {!isSignedIn && (
            <Button
              size="lg"
              variant="outline"
              className="animate-fade-in"
              onClick={() => window.location.href = "/sign-up"}
            >
              Sign Up
            </Button>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-morphism p-6 rounded-lg text-center hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;