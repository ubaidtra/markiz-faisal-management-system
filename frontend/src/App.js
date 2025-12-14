import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Halqas from './pages/Halqas';
import QuranProgress from './pages/QuranProgress';
import Fees from './pages/Fees';
import FeeSettings from './pages/FeeSettings';
import Withdrawals from './pages/Withdrawals';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <PrivateRoute>
                <Teachers />
              </PrivateRoute>
            }
          />
          <Route
            path="/halqas"
            element={
              <PrivateRoute>
                <Halqas />
              </PrivateRoute>
            }
          />
          <Route
            path="/quran-progress"
            element={
              <PrivateRoute>
                <QuranProgress />
              </PrivateRoute>
            }
          />
          <Route
            path="/fees"
            element={
              <PrivateRoute>
                <Fees />
              </PrivateRoute>
            }
          />
          <Route
            path="/fee-settings"
            element={
              <PrivateRoute>
                <FeeSettings />
              </PrivateRoute>
            }
          />
          <Route
            path="/withdrawals"
            element={
              <PrivateRoute>
                <Withdrawals />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

