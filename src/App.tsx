import { ClerkProvider, SignIn, SignUp } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => {
  const [clerkKey, setClerkKey] = useState<string | null>(localStorage.getItem('clerk_key'));
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('clerk_key'));

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).key.value;
    localStorage.setItem('clerk_key', input);
    setClerkKey(input);
    setShowKeyInput(false);
  };

  if (showKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass-morphism p-8 rounded-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-primary">Enter Clerk Publishable Key</h1>
          <form onSubmit={handleKeySubmit} className="space-y-4">
            <Input 
              name="key"
              type="text"
              placeholder="pk_test_..."
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

  if (!clerkKey) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;