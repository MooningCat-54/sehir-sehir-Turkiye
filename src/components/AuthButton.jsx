import React from "react";
import { useNavigate } from "react-router-dom";

const AuthButton = () => {

    const navigate = useNavigate();

    return (

        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px 20px' }}>
                <button 
                    onClick={() => navigate('/auth/login')} // Tıklanınca /auth adresine git
                    style={{
                        padding: '10px 20px', 
                        backgroundColor: '#1877f2', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    🚪 Giriş / Kayıt Sayfasına Git
                </button>
            </div>

    )
}

export default AuthButton;