import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings, User } from "lucide-react";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome, {user.firstName || 'User'}!</h1>
          <p className="text-muted-foreground">Manage your chats and account settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-morphism p-6 rounded-lg">
            <MessageSquare className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your Chats</h2>
            <p className="text-muted-foreground mb-4">Access your conversation history</p>
            <Button variant="outline" className="w-full">View Chats</Button>
          </div>

          <div className="glass-morphism p-6 rounded-lg">
            <User className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-muted-foreground mb-4">Update your personal information</p>
            <Button variant="outline" className="w-full">Edit Profile</Button>
          </div>

          <div className="glass-morphism p-6 rounded-lg">
            <Settings className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-muted-foreground mb-4">Customize your experience</p>
            <Button variant="outline" className="w-full">Manage Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;