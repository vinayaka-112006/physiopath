import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'
import './index.css'

import Dashboard from './pages/Dashboard'
import PlanBuilder from './pages/PlanBuilder'

import PatientPortal from './pages/PatientPortal'
import WorkoutEngine from './pages/WorkoutEngine'
import History from './pages/History'
import ExerciseDetails from './pages/ExerciseDetails'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/builder" 
        element={
          <ProtectedRoute>
            <PlanBuilder />
          </ProtectedRoute>
        } 
      />
      <Route path="/patient/:token" element={<PatientPortal />} />
      <Route path="/exercise/:token/:exerciseId" element={<ExerciseDetails />} />
      <Route path="/workout/:token" element={<WorkoutEngine />} />
      <Route path="/history/:token" element={<History />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
