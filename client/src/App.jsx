import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useStore from './store/useStore';
import { useUser } from './api/queries';

// Pages
import Home from './pages/Home';
import LearningRoom from './pages/LearningRoom';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import Placement from './pages/Placement';
import HabitTracker from './pages/HabitTracker';
import ChallengeMode from './pages/ChallengeMode';
import Reflection from './pages/Reflection';
import Auth from './pages/Auth';
import Navbar from './components/layout/Navbar';

const queryClient = new QueryClient();

function AppRoutes() {
  // App Layout
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);

  // Check for token in storage
  const token = localStorage.getItem('token');

  // Query user profile if token exists
  const { data: user, isLoading, isError } = useUser({
    enabled: !!token,
    retry: false
  });

  // Sync session state
  useEffect(() => {
    if (user) {
      setSession(user);
    } else if (isError) {
      // If fetching fails (e.g. invalid token), clear everything
      localStorage.removeItem('token');
      setSession(null);
    }
  }, [user, isError, setSession]);

  // 1. Loading State
  if (isLoading && token) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0D1117] text-white">
        <div className="animate-pulse">Loading Student Tracker...</div>
      </div>
    );
  }

  // 2. Auth Guard
  // If no session is established AND (no token exists OR we failed to fetch user), show Auth
  if (!session && (!token || isError)) {
    return (
      <Routes>
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  // App Layout
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 font-sans pb-24">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<LearningRoom />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/placement" element={<Placement />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/challenge" element={<ChallengeMode />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Navbar />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
