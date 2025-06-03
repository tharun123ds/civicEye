
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from "@/components/ui/button";

interface AuthPageProps {
  onLogin: (token: string, role: string) => void;
  onRegister: (token: string, role: string) => void;
}

export default function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {showRegister ? (
          <>
            <RegisterForm onRegister={onRegister} />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setShowRegister(false)}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </>
        ) : (
          <>
            <LoginForm onLogin={onLogin} />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setShowRegister(true)}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
