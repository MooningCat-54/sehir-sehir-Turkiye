import React from "react";
import './css/LikeButton.css';

const SaveButton = ({ active, onClick }) => {
    return (
        <button
            className={`save-button like-button ${active ? 'active' : ''}`}
            onClick={onClick}
            style={{
                color: active ? '#1877f2' : '#666',
                fontWeight: active ? 'bold' : '500',
                transition: 'all 0.2s ease'
            }}
        >
            {active ? '🔖 Kaydedildi' : '💾 Kaydet'}
        </button>
    );
};

export default SaveButton;