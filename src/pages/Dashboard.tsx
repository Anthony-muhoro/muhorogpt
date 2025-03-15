
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Zap, Key, AreaChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Demo stats - these would come from a database in a real app
  const stats = [
    { label: "Total Chats", value: "12" },
    { label: "Messages", value: "157" },
    { label: "Avg. Response Time", value: "1.2s" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Welcome, {user.firstName || 'User'}!</h1>
          <p className="text-muted-foreground">Here's an overview of your activity</p>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          {stats.map((stat, index) => (
            <div key={index} className="glass-morphism p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Actions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="glass-morphism p-6 rounded-lg hover:scale-105 transition-transform duration-300">
            <MessageSquare className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Continue Chatting</h2>
            <p className="text-muted-foreground mb-4">Pick up where you left off in your conversations</p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/chat')}>
              Open Chat
            </Button>
          </div>

          <div className="glass-morphism p-6 rounded-lg hover:scale-105 transition-transform duration-300">
            <User className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-muted-foreground mb-4">View and manage your profile information</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://accounts.clerk.dev/user', '_blank')}
            >
              Manage Profile
            </Button>
          </div>

          <div className="glass-morphism p-6 rounded-lg hover:scale-105 transition-transform duration-300">
            <Key className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">API Settings</h2>
            <p className="text-muted-foreground mb-4">Update your Gemini API key</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                localStorage.removeItem('gemini_key');
                navigate('/chat');
              }}
            >
              Update API Key
            </Button>
          </div>
        </div>

        {/* Activity section - only on desktop */}
        {!isMobile && (
          <div className="mt-8 glass-morphism p-6 rounded-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <AreaChart className="w-12 h-12 mx-auto text-primary mb-2" />
                <p>Activity charts will appear here as you use the chat</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
