import React from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { Layout } from './components/Layout';
import { PanditProvider } from './contexts/PanditContext';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { DevoteeDashboard } from './components/dashboard/DevoteeDashboard';
import { PanditDashboard } from './components/dashboard/PanditDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MessagesPage } from './pages/MessagesPage';
import { SearchSection } from './components/SearchSection';
import { QAMessaging } from './components/dashboard/QAMessaging';
import { PanditList } from './components/pandits/PanditList';
import { ProfilePage } from './pages/ProfilePage';
import { BookingsPage } from './pages/BookingsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TutorialOverlay } from './components/tutorial/TutorialOverlay';
import { AstrologyCalculator } from './components/astrology/AstrologyCalculator';
import { PanchangOverlay } from './components/panchang/PanchangOverlay';

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [showTutorial, setShowTutorial] = React.useState(true);
  const [hasCheckedStorage, setHasCheckedStorage] = React.useState(false);

  React.useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorial_completed');
    if (tutorialCompleted === 'true') {
      setShowTutorial(false);
    }
    setHasCheckedStorage(true);
  }, []);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Render admin dashboard if user is admin
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <PanditProvider>
      <Layout onNavigate={setCurrentPage} currentPage={currentPage}>
        {hasCheckedStorage && showTutorial && <TutorialOverlay />}
        <PanchangOverlay />
        <QAMessaging />
        <div className="p-8">
          {currentPage === 'dashboard' && (
            <>
              <DashboardHeader user={user!} />
              {user?.role === 'pandit' ? (
                <PanditDashboard />
              ) : (
                <>
                  <DevoteeDashboard />
                  <div className="mt-8">
                    <SearchSection />
                    <PanditList />
                  </div>
                </>
              )}
            </>
          )}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'bookings' && <BookingsPage />}
          {currentPage === 'messages' && <MessagesPage />}
          {currentPage === 'astro-chart' && <AstrologyCalculator />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </Layout>
    </PanditProvider>
  );
}