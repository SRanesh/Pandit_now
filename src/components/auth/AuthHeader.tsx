import React from 'react';
import { BookOpen as Om } from 'lucide-react';

interface AuthHeaderProps {
  isLogin: boolean;
}

export function AuthHeader({ isLogin }: AuthHeaderProps) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Om className="w-10 h-10 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Pandit Now</h1>
        </div>
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {isLogin ? "Sign in to your account" : "Create your account"}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Find and book verified pandits for your ceremonies
      </p>
    </div>
  );
}