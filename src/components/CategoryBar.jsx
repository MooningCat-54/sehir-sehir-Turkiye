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
        { id: 8, name: 'Kış Turizmi', icon: '❄️' }
    ];

    return (
        <div className="bar">
            {categories.map((cat) => {
                // Bu kategori şu anki seçili olanların içinde var mı?
                const isSelected = cat.name === 'Hepsi' ? selectedCategories.length === 0 : selectedCategories.includes(cat.name);

                return (
                    <button 
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.name)} 
                        className="bar-button"
                        // Seçiliyse opaklığı tam yap, değilse soluk bırak
                        style={{ 
                            opacity: isSelected ? 1 : 0.6,
                            // Bonus: Seçiliyse hafif bir yeşilimsi arkaplan verebilirsin
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