// src/components/ProfileButton.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './css/ProfileButton.css'

const ProfileButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // AuthContext'ten gelen veriler[cite: 16]
    
    // Varsayılan resim: Kullanıcıda hiç resim yoksa[cite: 28]
    const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const [miniAvatar, setMiniAvatar] = useState(null); 
    const baseUrl = "http://localhost:5000";

    useEffect(() => {
        const fetchMiniAvatar = async () => {
            if (user && user.username) {
                try {
                    // SQL'den güncel profil verisini çekiyoruz[cite: 2, 28]
                    const response = await fetch(`${baseUrl}/api/auth/profile/${user.username}`);
                    const data = await response.json();

                    if (data.success && data.profile) {
                        // Eğer SQL'de AvatarUrl varsa başına baseUrl ekle, yoksa UI-Avatars oluştur[cite: 14, 28]
                        const avatarSrc = data.profile.AvatarUrl 
                            ? `${baseUrl}${data.profile.AvatarUrl}` 
                            : `https://ui-avatars.com/api/?name=${data.profile.FullName}&background=random&color=fff&size=64`;
                        setMiniAvatar(avatarSrc);
                    }
                }
                catch(error) {
                    console.error("Avatar çekilemedi:", error);
                }
            }
        };

        fetchMiniAvatar();

        // Profil düzenlendiğinde bu fonksiyonun tekrar çalışmasını tetikliyoruz[cite: 28]
        window.addEventListener('profileUpdateted', fetchMiniAvatar);

        return () => window.removeEventListener('profileUpdateted', fetchMiniAvatar);
        
    }, [user]);

    const handleLogOut = () => {
        logout(); // Context içindeki temizlik fonksiyonu[cite: 16]
        setIsOpen(false);
        navigate('/auth/login');
    }

    return (
        <div className="profile-button-container">
            <div 
                className="profile-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img 
                    className="profile-image"
                    src={miniAvatar || defaultImage} 
                    alt="Profil" 
                    style={{ objectFit: 'cover' }}
                />
            </div>

            {isOpen && (
                <div className="dropdown-container">
                    <button className="dropdown-button-style green-button" onClick={() => {
                        navigate(`/${user?.username}/profile`); // Dinamik path[cite: 9]
                        setIsOpen(false);
                    }}>
                        👤 Profilim
                    </button>
                    
                    <button className='dropdown-button-style green-button' onClick={() => setIsOpen(false)}>
                        ⚙️ Ayarlar
                    </button>
                    
                    <hr className="line"/>
                    
                    <button className="dropdown-button-style red-button" onClick={handleLogOut}>
                        🚪 Çıkış Yap
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;