import React, { useState } from 'react';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Kayıt isteği gönderiliyor:", { name, email, password });
    };

    return (
        <form className="auth-form" onSubmit={handleRegister}>
            <div className="input-group">
                <label>Ad Soyad</label>
                <input 
                    type="text" 
                    placeholder="Adınız Soyadınız" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                />
            </div>
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
            <button type="submit" className="auth-submit-btn">Kayıt Ol</button>
        </form>
    );
};

export default RegisterForm;