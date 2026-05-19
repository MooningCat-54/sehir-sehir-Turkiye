import React from "react";
import './css/LikeButton.css'; // Mevcut CSS dosyanı paylaşıyor

const SaveButton = ({ active, onClick }) => {
    return (
        <button
            // Eğer aktifse yanına active class'ını veya stili dinamik basabiliriz
            className={`save-button like-button ${active ? 'active' : ''}`}
            onClick={onClick}
            style={{
                color: active ? '#1877f2' : '#666', // Kaydedildiyse mavi, değilse gri font
                fontWeight: active ? 'bold' : '500',
                transition: 'all 0.2s ease'
            }}
        >
            {/* Duruma göre yazı veya ikon değişimi */}
            {active ? '🔖 Kaydedildi' : '💾 Kaydet'}
        </button>
    );
};

export default SaveButton;