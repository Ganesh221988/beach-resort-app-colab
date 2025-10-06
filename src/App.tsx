import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { BrokerDashboard } from './components/dashboard/BrokerDashboard';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';


// Main App Content
function AppContent() {
  const { user, isLoading, signup } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup'>('landing');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
            <span className="text-white font-bold text-lg">ECR</span>
          </div>
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentView === 'login') {
      return (
        <LoginPage 
          onBack={() => setCurrentView('landing')}
          onSwitchToSignup={() => setCurrentView('signup')}
          onBackToLanding={() => setCurrentView('landing')}
        />
      );
    }
    
    if (currentView === 'signup') {
      return (
        <SignupPage
          onBack={() => setCurrentView('landing')}
          onSwitchToLogin={() => setCurrentView('login')}
          onBackToLanding={() => setCurrentView('landing')}
          onSignup={async (userData) => {
            try {
              const success = await signup(userData);
              return success;
            } catch (error) {
              console.error('Signup error in App:', error);
              return false;
            }
          }}
          isLoading={isLoading}
        />
      );
    }
    
    return (
      <LandingPage
        onLogin={() => setCurrentView('login')}
        onSignup={() => setCurrentView('signup')}
      />
    );
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'owner':
      return <OwnerDashboard />;
    case 'broker':
      return <BrokerDashboard />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;