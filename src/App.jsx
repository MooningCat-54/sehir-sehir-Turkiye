import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; //router yönlendirme yapmak için
import NavBar from './components/NavBar'; //navbar componenti
import Home from './pages/Home'; //sitenin anasayfası
import Auth from './pages/Auth'; //sitenin doğrulama/giriş sayfası
import Profile from './pages/Profile'; //profil sayfası
import LoginForm from './components/LoginForm'; //profil sayfası için component
import RegisterForm from './components/RegisterForm'; //profil sayfası için component

//birbirinden izole yollar ve isimleri

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <NavBar />
        
        <Routes>

          <Route index element={<Navigate to="home" replace />} />
          <Route path="/home" element={<Home />} />

          <Route path="/auth" element={<Auth />}>
            <Route index element={<Navigate to='login' replace />} />
            <Route path="login" index element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>

          <Route path="/kullanici-adi">
            <Route index element={<Home />} />
            <Route path="Profile" element={<Profile />} />
          </Route>


        </Routes>
      </div>
    </Router>
  );
}

export default App;