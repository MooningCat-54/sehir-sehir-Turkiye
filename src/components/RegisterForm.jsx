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

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if(!name || !password || !email || !userName) {
            setError('boş bırakılan alan');
            return;
        }

        setUploading(true);

        const isRegisterSucceed = await register(name, userName, email, password);

        if(isRegisterSucceed) {
            alert('kayıt başarılı');
            navigate('/auth/login');
        }
        else {
            setError('başarısız deneme');
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