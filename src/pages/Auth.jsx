import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Link ve useLocation ekledik
import './css/Auth.css';

const Auth = () => {
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase(); //pathi lowercase yapıyor
    const isLoginPage = currentPath === '/auth/login'; //burda karşılaştırma yapıyor path doğru ise true yanlış ise false döndürüyor

    return (
        <div className="auth-page-container">
            <div className="auth-card">
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