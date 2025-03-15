
import { ClerkProvider, SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const [clerkKey, setClerkKey] = useState<string | null>(localStorage.getItem('clerk_key'));
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('clerk_key'));

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).key.value;
    if (!input.startsWith('pk_')) {
      alert('Please enter a valid Clerk publishable key starting with "pk_"');
      return;
    }
    localStorage.setItem('clerk_key', input);
    setClerkKey(input);
    setShowKeyInput(false);
  };

  const resetKey = () => {
    localStorage.removeItem('clerk_key');
    setClerkKey(null);
    setShowKeyInput(true);
  };

  if (showKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass-morphism p-8 rounded-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-primary">Enter Clerk Publishable Key</h1>
          <p className="text-muted-foreground mb-4">
            Please enter your Clerk publishable key (starts with pk_). You can get this from your Clerk dashboard.
          </p>
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
    <ClerkProvider 
      publishableKey={clerkKey}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Chat />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <div className="fixed bottom-4 right-4 z-10">
            <Button variant="outline" size="sm" onClick={resetKey}>
              Reset Clerk Key
            </Button>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
