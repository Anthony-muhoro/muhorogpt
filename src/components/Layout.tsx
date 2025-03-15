
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu,
  X,
  PlusCircle,
  Trash2,
  Moon,
  Sun,
  Sparkles
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(localStorage.getItem('current_chat_id'));
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');
  const [newChatAnimation, setNewChatAnimation] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    loadChatHistory();
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Open sidebar by default on desktop
    setSidebarOpen(!isMobile);
  }, [theme, isMobile]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleNewChat = () => {
    // Set animation flag
    setNewChatAnimation(true);
    
    createNewChat();
    setActiveChat(null);
    navigate('/chat');
    
    toast({
      title: "New Chat Created",
      description: "Start typing to begin your conversation"
    });
    
    // Close sidebar on mobile after creating new chat
    if (isMobile) setSidebarOpen(false);
    
    // Reset animation flag after 500ms
    setTimeout(() => setNewChatAnimation(false), 500);
    
    // Refresh chat history
    loadChatHistory();
  };

  const handleChatSelect = (chatId: string) => {
    // Don't reload if it's already the active chat
    if (activeChat === chatId) {
      if (isMobile) setSidebarOpen(false);
      return;
    }
    
    loadChat(chatId);
    setActiveChat(chatId);
    navigate('/chat');
    
    // Show a confirmation toast
    toast({
      title: "Chat Loaded",
      description: "Successfully loaded previous conversation"
    });
    
    if (isMobile) setSidebarOpen(false);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    
    deleteChat(chatId);
    
    // If the deleted chat is the active one, create a new chat
    if (activeChat === chatId) {
      createNewChat();
      setActiveChat(null);
      navigate('/chat');
    }
    
    toast({
      title: "Chat Deleted",
      description: "The conversation has been removed"
    });
    
    loadChatHistory();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode Activated`,
      description: `Switched to ${newTheme} theme`
    });
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
      path: "/settings"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-[280px] glass-morphism transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 h-full
        overflow-hidden flex flex-col
      `}>
        <div className="flex flex-col h-screen p-4 overflow-hidden">
          <div className="flex items-center space-x-2 mb-8 pt-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Muhoro GPT</h1>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground">CHATS</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 transition-all ${newChatAnimation ? 'animate-spin' : ''}`}
              onClick={handleNewChat}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1 mb-6 overflow-y-auto flex-1 scrollbar-none">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-4 px-2">
                <Sparkles className="h-10 w-10 text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground text-center">
                  No chats yet. Click the + button to start a new conversation.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNewChat}
                  className="mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
            ) : (
              chatHistory.map((chat) => (
                <div 
                  key={chat.id}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-accent group transition-colors duration-200 ${activeChat === chat.id ? 'bg-accent' : ''}`}
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

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start transition-colors ${window.location.pathname === item.path ? 'bg-accent/50' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setSidebarOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="pt-4 border-t border-border mt-4">
            <div className="flex justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="flex items-center space-x-2 transition-all hover:bg-accent"
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
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={user?.fullName || "User"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-primary-foreground">
                    {user?.fullName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full transition-colors"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:pl-0 w-full h-screen overflow-y-auto">
        <div className="p-4 pt-16 md:pt-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
