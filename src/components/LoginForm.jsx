import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    //const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if(!email || !password) {
            setError('hata şifre eposta');
            return;
        }

        setUploading(true);

        const isLoginSucceed = await login(email, password);

        if(isLoginSucceed) {
            alert('girş başarılı');
            navigate('/');
        }
        else {
            setError('şifre yada eposta');
        }
        setUploading(false);
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