import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu,
  X
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard"
    },
    {
      icon: MessageSquare,
      label: "Chat",
      path: "/chat"
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin"
    }
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 glass-morphism transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center space-x-2 mb-8">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Muhoro GPT</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center mb-4 space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;