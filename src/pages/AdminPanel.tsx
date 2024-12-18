import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Users, BarChart, MessageSquare, Settings } from "lucide-react";

const AdminPanel = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // In a real app, you'd check if the user has admin privileges
  const isAdmin = true; // This should be determined by your backend

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, analytics, and system settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-morphism p-6 rounded-lg">
            <Users className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <p className="text-muted-foreground mb-4">View and manage user accounts</p>
            <Button variant="outline" className="w-full">Manage Users</Button>
          </div>

          <div className="glass-morphism p-6 rounded-lg">
            <BarChart className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground mb-4">View system analytics and metrics</p>
            <Button variant="outline" className="w-full">View Analytics</Button>
          </div>

          <div className="glass-morphism p-6 rounded-lg">
            <MessageSquare className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Message Management</h2>
            <p className="text-muted-foreground mb-4">Monitor and manage chat messages</p>
            <Button variant="outline" className="w-full">View Messages</Button>
          </div>

          <div className="glass-morphism p-6 rounded-lg">
            <Settings className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">System Settings</h2>
            <p className="text-muted-foreground mb-4">Configure system parameters</p>
            <Button variant="outline" className="w-full">Manage Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;