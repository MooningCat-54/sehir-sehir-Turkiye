import React from 'react';
import './css/RandomSuggestion.css'

const RandomSuggestionButton = ({ locations }) => {
    
    const handleRandomClick = () => {
        if (!locations || locations.length === 0) return;

        // hocanın da gösterdiği random index seçici
        const randomIndex = Math.floor(Math.random() * locations.length);
        const randomPlace = locations[randomIndex];

        // daha sonradan css vs gelicek şimdilik alert
        alert(`Bugünün şanslı rotası: ${randomPlace.location} - ${randomPlace.user.name} öneriyor!`);
    };

    return (
        <button
            className="random-suggestion-button"
            onClick={handleRandomClick}
            title="Rastgele bir rota öner!"
            onMouseOver={(e) => e.target.style.backgroundColor = '#1917f1'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#166fe5'}
        >
            🎰
        </button>
    );
};

export default RandomSuggestionButton;