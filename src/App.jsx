import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import NavBar from './components/NavBar'; 
import Home from './pages/Home'; 
import Auth from './pages/Auth'; 
import Profile from './pages/Profile'; 
import LoginForm from './components/LoginForm'; 
import RegisterForm from './components/RegisterForm';
import EditProfile from './pages/EditProfile';
import AdminFAB from './components/AdminFAB';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import SavedPlacesPage from './pages/SavedPlacesPage';
import PostDetailPage from './pages/PostDetailPage';
import OfficialPlaceDetailPage from './pages/OfficialPlaceDetailPage';

function App() {
  return (
    <AuthProvider>
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
          <NavBar />
            
          <Routes>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/official/:id" element={<OfficialPlaceDetailPage />} />

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

              <Route path="saved" element={
                <ProtectedRoute>
                  <SavedPlacesPage />
                </ProtectedRoute>
              } />

              <Route path="profile/edit" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />

            </Route>

          </Routes>

          <AdminFAB />

        </div>
    </AuthProvider>
  );
}

export default App;