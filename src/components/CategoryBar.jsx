import React from 'react';
import './css/CategoryBar.css'

const CategoryBar = ({selectedCategories, onSelectCategory}) => {
    const categories = [
        { id: 1, name: 'Hepsi', icon: '🌍' },
        { id: 2, name: 'Doğa', icon: '🌲' },
        { id: 3, name: 'Tarih', icon: '🏛️' },
        { id: 4, name: 'Deniz', icon: '🌊' },
        { id: 5, name: 'Kamp', icon: '🔥' },
        { id: 6, name: 'Şehir', icon: '🏙️' },
        { id: 7, name: 'Gastronomi', icon: '🍲' },
        { id: 8, name: 'Kış Turizmi', icon: '❄️' },
        { id: 9, name: 'Antik Kent', icon: '🏺' },
        { id: 10, name: 'Mimari', icon: '🏟️' },
        { id: 11, name: 'Kültür', icon: '⛲' },
        { id: 12, name: 'İnanç', icon: '📿' },
        { id: 13, name: 'Termal', icon: '♨️' },
        { id: 14, name: 'Macera', icon: '🪂' },
        { id: 15, name: 'Manzara', icon: '🌉' },
        { id: 16, name: 'Alışveriş', icon: '🛍️' },
        { id: 17, name: 'Köy', icon: '🌺' },
        { id: 18, name: 'Saray', icon: '🏰' },
    ];

    return (
        <div className="bar">
            {categories.map((cat) => {
                const isSelected = cat.name === 'Hepsi' ? selectedCategories.length === 0 : selectedCategories.includes(cat.name);

                return (
                    <button 
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.name)} 
                        className="bar-button"
                        style={{ 
                            opacity: isSelected ? 1 : 0.6,
                            backgroundColor: isSelected ? 'rgba(46, 204, 113, 0.1)' : 'transparent' 
                        }} 
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div className="button-frame">
                            {cat.icon}
                        </div>
                        
                        <span className='button-text'>
                            {cat.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryBar;