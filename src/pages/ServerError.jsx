// components/ServerError.jsx VEYA pages/ServerError.jsx
import React from 'react';

const ServerError = () => {
    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f8d7da', // Hafif kırmızımsı hata rengi
            color: '#721c24',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '6rem', margin: '0' }}>500</h1>
            <h2 style={{ fontSize: '2rem', margin: '10px 0' }}>Sunucuya Ulaşılamıyor</h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '500px' }}>
                Şu anda mutfakta (Backend) bir yangın var! Aşçılarımız sorunu çözmek için uğraşıyor. 
                Lütfen daha sonra tekrar deneyin. 👨‍🍳🔥
            </p>
            <button 
                onClick={() => window.location.reload()} 
                style={{ 
                    marginTop: '20px', padding: '10px 20px', 
                    fontSize: '1rem', cursor: 'pointer', 
                    backgroundColor: '#dc3545', color: 'white', 
                    border: 'none', borderRadius: '5px' 
                }}
            >
                Sayfayı Yenile
            </button>
        </div>
    );
};

export default ServerError;