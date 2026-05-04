 // src/components/GalleryArea.jsx
import React from 'react';
import './css/GalleryArea.css'

const GalleryArea = ({ images }) => {
    // images dizisi artık Profile.jsx içindeki useEffect'ten geliyor[cite: 14]
    // Veri yapısı: [{ id: 1, image: "http://localhost:5000/uploads/posts/..." }, ...]

    return (
        <div className='gallery-container'>
            <h3 className="gallery-title"> Fotoğraflarım </h3>
            
            <div className="gallery-grid">
                {/* Eğer kullanıcının hiç postu yoksa bir mesaj gösterelim */}
                {images.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', padding: '20px' }}>
                        Henüz hiç paylaşım yapılmamış.
                    </p>
                ) : (
                    images.map((img, index) => (
                        <div className="gallery-image" key={img.id || index}>
                            <img 
                                className="gallery-image-button" 
                                // Profile.jsx tarafında baseUrl zaten eklenmişti[cite: 14]
                                src={img.image} 
                                alt={`Galeri Görseli ${index}`}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        </div>
                    ))
                )}
            </div>
            
            {images.length > 6 && (
                <button className="show-all-button">
                    Tümünü Gör
                </button>
            )}
        </div>
    );
};

export default GalleryArea;