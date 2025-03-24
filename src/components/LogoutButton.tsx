import React from 'react';
import { LogOut } from 'lucide-react';
import { Link } from './Link';
import { useAuth } from '../hooks/useAuth';

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Link 
      href="#" 
      icon={<LogOut className="w-5 h-5" />} 
      variant="danger"
      onClick={logout}
    >
      Logout
    </Link>
  );
}