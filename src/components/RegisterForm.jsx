import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const {register} = useAuth();

    // src/components/RegisterForm.jsx içindeki handleRegister fonksiyonu
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Backend'deki 'register' fonksiyonu 4 parametre bekliyor: name, username, email, password[cite: 2, 16]
        // Senin formundaki 'userName' (N büyük) ile AuthContext'teki 'username' (n küçük) eşleşmeli.
        if(!name || !password || !email || !userName) {
            setError('Lütfen tüm alanları doldurunuz.');
            return;
        }

        setUploading(true);

        // 2. AuthContext.js içindeki register fonksiyonuna verileri gönderiyoruz[cite: 16, 32]
        // Dikkat: Parametre sırası backend ile aynı olmalı: (FullName, Username, Email, Password)
        const isRegisterSucceed = await register(name, userName, email, password);

        if(isRegisterSucceed) {
            alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            navigate('/auth/login'); //[cite: 11, 32]
        }
        else {
            // Backend'den gelen spesifik hata mesajlarını (örneğin: "Email kullanımda") gösterir
            setError('Kayıt sırasında bir sorun oluştu. Lütfen bilgileri kontrol edin.');
        }
        setUploading(false);
    };

    return (
        <form className="auth-form" onSubmit={handleRegister}>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <div className="input-group">
                <label>Ad Soyad</label>
                <input 
                    type="text" 
                    placeholder="Adınız Soyadınız" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={uploading}
                    required 
                />
            </div>
            <div className="input-group">
                <label>Takma ad</label>
                <input 
                    type="text" 
                    placeholder="Uygulama içinde görünücek adınız" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={uploading}
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
                    disabled={uploading}
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
                    disabled={uploading}
                    required 
                />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={uploading}>{uploading ? 'lütfen bekleyiniz...' : 'kayıt olun'}</button>
        </form>
    );
};

export default RegisterForm;