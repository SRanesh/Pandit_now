import React from 'react';
import { BookOpen as Om, Calendar, User, Settings, Star, MessageSquare } from 'lucide-react';
import { Link } from './Link';
import { LogoutButton } from './LogoutButton';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Layout({ children, onNavigate, currentPage }: LayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-8">
          <Om className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Pandit Now</h1>
        </div>
        
        <nav className="space-y-1">
          <Link 
            href="#" 
            icon={<Om className="w-5 h-5" />}
            isActive={currentPage === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </Link>
          <Link 
            href="#" 
            icon={<Star className="w-5 h-5" />}
            isActive={currentPage === 'astro-chart'}
            onClick={() => onNavigate('astro-chart')}
          >
            Astro Chart
          </Link>
          <Link 
            href="#" 
            icon={<MessageSquare className="w-5 h-5" />}
            isActive={currentPage === 'messages'}
            onClick={() => onNavigate('messages')}
          >
            Messages
          </Link>
          <Link 
            href="#" 
            icon={<Calendar className="w-5 h-5" />}
            isActive={currentPage === 'bookings'}
            onClick={() => onNavigate('bookings')}
          >
            My Bookings
          </Link>
          <Link 
            href="#" 
            icon={<User className="w-5 h-5" />}
            isActive={currentPage === 'profile'}
            onClick={() => onNavigate('profile')}
          >
            Profile
          </Link>
          <Link 
            href="#" 
            icon={<Settings className="w-5 h-5" />}
            isActive={currentPage === 'settings'}
            onClick={() => onNavigate('settings')}
          >
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-4 space-y-4">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <UserAvatar user={user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}