import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { PanditSignUpForm } from '../components/auth/PanditSignUpForm';
import { SignUpOptions } from '../components/auth/SignUpOptions';
import { AuthHeader } from '../components/auth/AuthHeader';
import { useAuth } from '../hooks/useAuth';

type AuthMode = 'login' | 'signup-options' | 'signup-user' | 'signup-pandit';

export function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleSignUpOptionSelect = (type: 'user' | 'pandit') => {
    setMode(type === 'user' ? 'signup-user' : 'signup-pandit');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthHeader isLogin={mode === 'login'} />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mode === 'login' && (
            <LoginForm onSubmit={handleLogin} error={error} />
          )}
          {mode === 'signup-options' && (
            <SignUpOptions onSelect={handleSignUpOptionSelect} />
          )}
          {mode === 'signup-user' && <SignUpForm />}
          {mode === 'signup-pandit' && <PanditSignUpForm />}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {mode === 'login' ? "New to PanditJi?" : "Already have an account?"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  setError(null);
                  setMode(mode === 'login' ? 'signup-options' : 'login');
                }}
                className="w-full text-center text-sm text-orange-600 hover:text-orange-700"
              >
                {mode === 'login' ? "Create a new account" : "Sign in to your account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}