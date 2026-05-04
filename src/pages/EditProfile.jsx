// pages/EditProfile.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Gizli dosya seçiciye erişmek için

    const [bio, setBio] = useState(user?.bio || '');
    const [preview, setPreview] = useState(user?.avatarUrl || 'https://via.placeholder.com/150');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fotoğrafa tıklandığında gizli <input type="file" />'ı tetikler
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            //use state ile dosya konumunu 
            setPreview(URL.createObjectURL(file));
        }
    };

    // src/pages/EditProfile.jsx içindeki handleSave fonksiyonu
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Resim dosyası içerdiği için FormData kullanmak zorundayız[cite: 12]
        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('username', user.username); // Backend'de WHERE Username = @username için[cite: 2]
        
        if (selectedFile) {
            // 'avatar' ismi backend'deki upload.single('avatar') ile aynı olmalı![cite: 4]
            formData.append('avatar', selectedFile); 
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'PUT',
                headers: { 
                    // FormData kullanırken Content-Type manuel yazılmaz, tarayıcı halleder.
                    // Ancak token'ı mutlaka ekliyoruz.[cite: 12, 16]
                    'Authorization': `Bearer ${user.token}` 
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert("Profil başarıyla güncellendi!");
                
                // 2. Telsizi (Event) ateşle! NavBar ve ProfileButton bunu dinleyip resmi yenileyecek
                window.dispatchEvent(new Event('profileUpdateted')); 
                
                navigate(`/${user.username}/profile`); // Kendi profiline yönlendir[cite: 14]
            }
        } catch (err) {
            alert("Bağlantı hatası: Sunucu kapalı olabilir.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Profili Düzenle</h2>
            
            {/* Fotoğraf Önizleme Alanı */}
            <div 
                onClick={handleImageClick}
                style={{ 
                    width: '150px', height: '150px', borderRadius: '50%', 
                    margin: '0 auto 20px', cursor: 'pointer', overflow: 'hidden',
                    border: '3px solid #ddd', position: 'relative'
                }}
            >
                <img src={preview} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ 
                    position: 'absolute', bottom: 0, background: 'rgba(0,0,0,0.5)', 
                    width: '100%', color: 'white', fontSize: '12px', padding: '5px 0' 
                }}>Değiştir</div>
            </div>

            {/* Gizli Dosya Girişi */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*" 
            />

            <form onSubmit={handleSave}>
                <textarea 
                    placeholder="Biyografinizi yazın..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{ width: '300px', height: '100px', padding: '10px', marginBottom: '20px' }}
                /><br />

                <button type="submit" disabled={loading} style={{ padding: '10px 30px' }}>
                    {loading ? 'Yükleniyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;