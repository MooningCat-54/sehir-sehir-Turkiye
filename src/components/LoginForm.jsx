import React, { useState } from 'react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Giriş isteği gönderiliyor:", { email, password });
    };

    return (
        <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
                <label>E-posta Adresi</label>
                <input 
                    type="email" 
                    placeholder="ornek@mail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            </div>
            <div className="input-group">
                <label>Şifre</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>
            <button type="submit" className="auth-submit-btn">Giriş Yap</button>
        </form>
    );
};

export default LoginForm;