
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthPage from './pages/AuthPage';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

const queryClient = new QueryClient();

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

  // Sync localStorage when token or role changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  const handleLogin = (jwtToken: string, userRole: string) => {
    setToken(jwtToken);
    setRole(userRole);
  };

  const handleRegister = (jwtToken: string, userRole: string) => {
    setToken(jwtToken);
    setRole(userRole);
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {token ? (
          role === 'admin' ? (
            <AdminDashboard token={token} onLogout={handleLogout} />
          ) : (
            <UserDashboard token={token} onLogout={handleLogout} />
          )
        ) : (
          <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
