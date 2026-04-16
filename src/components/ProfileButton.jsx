import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ProfileButton.css'

const ProfileButton = ({ userImage }) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultImage = "";

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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
                        navigate('/kullanici-adi/profile');
                        console.log("Profile tıklandı");
                        setIsOpen(false);
                        }}>
                        👤 Profilim
                    </button>
                    <button className='dropdown-button-style green-button' onClick={() => { console.log("Ayarlara git"); setIsOpen(false); }}>
                        ⚙️ Ayarlar
                    </button>
                    
                    <hr className="line"/>
                    
                    <button className="dropdown-button-style red-button" onClick={() => { console.log("Çıkış yap"); setIsOpen(false); }}>
                        🚪 Çıkış Yap
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;