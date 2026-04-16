 import React from 'react';
 import './css/GalleryArea.css'

const GalleryArea = ({images}) => {

    return (
        <div className='gallery-container'>
            <h3 className="gallery-title"> fotoğraflarım </h3>
            
            <div className="gallery-grid">
                {images.map((img, id) => (
                    <div className="gallery-image" key={id}>
                        <img 
                            className="gallery-image-button" 
                            src={img.image} 
                            alt={`Galeri ${id}`}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        />
                    </div>
                ))}
            </div>
            
            <button className="show-all-button">
                Tümünü Gör
            </button>
        </div>
    );
};

export default GalleryArea;