import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { PanditProvider } from './contexts/PanditContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <PanditProvider>
        <App />
        </PanditProvider>
      </AuthProvider>
    </SessionContextProvider>
  </StrictMode>
);