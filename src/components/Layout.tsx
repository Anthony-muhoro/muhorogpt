
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu,
  X,
  PlusCircle,
  Trash2,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { 
  getChatHistory, 
  createNewChat, 
  loadChat, 
  deleteChat 
} from "@/lib/gemini";

interface LayoutProps {
  children: React.ReactNode;
}

interface ChatItem {
  id: string;
  title: string;
  createdAt: string;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(localStorage.getItem('current_chat_id'));
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    loadChatHistory();
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleNewChat = () => {
    createNewChat();
    setActiveChat(null);
    navigate('/chat');
  };

  const handleChatSelect = (chatId: string) => {
    loadChat(chatId);
    setActiveChat(chatId);
    navigate('/chat');
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
    if (activeChat === chatId) {
      setActiveChat(null);
    }
    loadChatHistory();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground">CHATS</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleNewChat}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1 mb-6 overflow-y-auto flex-1">
            {chatHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">No chats yet</p>
            ) : (
              chatHistory.map((chat) => (
                <div 
                  key={chat.id}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-accent group ${activeChat === chat.id ? 'bg-accent' : ''}`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <div className="flex-1 truncate pr-2">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(chat.createdAt)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
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
            <div className="flex justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="flex items-center space-x-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </Button>
            </div>
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
