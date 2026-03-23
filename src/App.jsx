import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 

// --- PAGES ---
import Landing from './pages/Landing'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Plans from './pages/Plans'; 
import ForgotPassword from './pages/ForgotPassword'; 
import ResetPassword from './pages/ResetPassword';   

// --- ROUTE GUARDS ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/browse" />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-netflix-black text-white font-sans">
      {/* EVERYTHING MUST BE INSIDE THESE ROUTES TAGS */}
      <Routes>
        
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} /> 
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} /> 
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        
        {/* === PROTECTED ROUTES === */}
        <Route path="/browse" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
        
      </Routes>
      {/* NOTHING CAN BE DOWN HERE! */}
    </div>
  );
}

export default App;