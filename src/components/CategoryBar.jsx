import React from 'react';
import './css/CategoryBar.css'

const CategoryBar = () => {
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
            {categories.map((cat) => (
                <button 
                    key={cat.id}
                    onClick={() => console.log(`${cat.name} kategorisi seçildi`)}
                    className="bar-button"
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
            ))}
        </div>
    );
};

export default CategoryBar;