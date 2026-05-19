import React from 'react';
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import './css/Auth.css';

const Auth = () => {
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase(); 
    const isLoginPage = currentPath === '/auth/login'; 
    const navigate = useNavigate();

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <button onClick={() => navigate('/home')} style={{border: 'none', background: 'none', cursor: 'pointer'}}>
                    ❌
                </button>
                <div className="auth-header">
                    <h2>{isLoginPage ? "Şehir Şehir Türkiyeye Giriş Yap" : "Yeni Hesap Oluştur"}</h2>
                    <p>{isLoginPage ? "Türkiyeyi keşfetmeye devam et." : "Türkiyenin güzzeliklerini paylaş."}</p>
                </div>

                <Outlet />

                <div className="auth-footer">
                    {isLoginPage ? (
                        <p>Hesabın yok mu? <Link to="/auth/register">Kayıt Ol</Link></p>
                    ) : (
                        <p>Zaten üye misin? <Link to="/auth/login">Giriş Yap</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;