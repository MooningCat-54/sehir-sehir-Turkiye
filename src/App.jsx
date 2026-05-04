import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import NavBar from './components/NavBar'; 
import Home from './pages/Home'; 
import Auth from './pages/Auth'; 
import Profile from './pages/Profile'; 
import LoginForm from './components/LoginForm'; 
import RegisterForm from './components/RegisterForm';
import EditProfile from './pages/EditProfile';

import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    // 2. TÜM UYGULAMAYI (AuthProvider) KAPSAMA ALANINA ALIYORUZ
    // Bu sayede navbar profile ve diğer tüm sayfalar giriş yapılıp yapılmadığını bilecek.
    <AuthProvider>
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
          <NavBar />
            
          <Routes>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />

            <Route path="/auth" element={
              <PublicRoute>
                <Auth />
              </PublicRoute> }>
              <Route index element={<Navigate to='login' replace />} />
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<RegisterForm />} />
            </Route>

            <Route path="/:username">
              <Route index element={<Home />} />
              
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="profile/edit" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />

            </Route>

          </Routes>
        </div>
    </AuthProvider>
  );
}

export default App;