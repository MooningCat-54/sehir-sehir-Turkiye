import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './css/ProfileButton.css'

const ProfileButton = ({ userImage }) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    const navigate = useNavigate();

    const {user, logout} = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogOut = () => {
        logout();
        setIsOpen(false);
        navigate('/auth/login');
    }

    return (
        <div className="profile-button-container">
            
            <div 
                className="profile-button"
                onClick={toggleMenu}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img 
                    className="profile-image"
                    src={userImage || defaultImage} 
                    alt="Profil" 
                />
            </div>

            {isOpen && (
                <div className="dropdown-container">
                    
                    <button className="dropdown-button-style green-button" onClick={() => {
                        if(user && user.username) {
                            const safeName = user.username.toLowerCase().replace(/\s+/g, '-');
                            navigate(`/${safeName}/profile`);
                        }
                        else {
                            console.log(user);
                            navigate('/kullanici/profile');
                        }
                        console.log("Profile tıklandı");
                        setIsOpen(false);
                        }}>
                        👤 Profilim
                    </button>
                    <button className='dropdown-button-style green-button' onClick={() => { console.log("Ayarlara git"); setIsOpen(false); }}>
                        ⚙️ Ayarlar
                    </button>
                    
                    <hr className="line"/>
                    
                    <button className="dropdown-button-style red-button" onClick={() => { 
                        handleLogOut();
                        setIsOpen(false); 
                        }}>
                        🚪 Çıkış Yap
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;