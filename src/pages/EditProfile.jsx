import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './css/EditProfile.module.css';

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const baseUrl = "http://localhost:5000";
    const defaultImage = `${baseUrl}/uploads/avatars/default_avatar.png`;

    const [bio, setBio] = useState('');
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isImageRemoved, setIsImageRemoved] = useState(false);

    useEffect(() => {
        const fetchFullProfile = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/auth/profile/${user.username}`);
                const data = await response.json();

                if (data.success) {
                    const p = data.profile;
                    setBio(p.Bio || '');
                    
                    if (p.AvatarUrl && !p.AvatarUrl.includes('default_avatar.png')) {
                        setPreview(`${baseUrl}${p.AvatarUrl}`);
                    } else {
                        setPreview(defaultImage);
                    }
                }
            } catch (err) {
                console.error("Profil bilgileri yüklenemedi:", err);
                setPreview(defaultImage);
            }
        };

        if (user?.username) {
            fetchFullProfile();
        }
    }, [user, baseUrl, defaultImage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setIsImageRemoved(false);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setIsImageRemoved(true);
        setPreview(defaultImage);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('bio', bio);
        
        if (selectedFile) {
            formData.append('avatar', selectedFile);
            formData.append('isImageRemoved', 'false');
        } else if (isImageRemoved) {
            formData.append('isImageRemoved', 'true'); 
        } else {
            formData.append('isImageRemoved', 'false');
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseUrl}/api/auth/update-profile`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Profil güncellendi!");
                window.dispatchEvent(new Event('profileUpdateted'));
                navigate(`/${user.username}/profile`);
            } else {
                alert("Hata: " + data.error);
            }
        } catch (err) {
            console.error("Save Error:", err);
            alert("Bağlantı hatası.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Profili Düzenle</h2>
            
            <form onSubmit={handleSave}>
                <div className={styles.avatarSection} onClick={() => fileInputRef.current.click()}>
                    <img 
                        src={preview || defaultImage} 
                        alt="Profil" 
                        className={styles.avatarImage} 
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = defaultImage; 
                        }} 
                    />
                    <div className={styles.avatarOverlay}>
                        <span>Fotoğraf Değiştir</span>
                    </div>
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                />

                <textarea 
                    className={styles.bioInput}
                    placeholder="Kendinizden bahsedin..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <div className={styles.buttonGroup}>
                    <button 
                        type="submit" 
                        className={styles.saveButton}
                        disabled={loading}
                    >
                        {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>

                    {preview && !preview.includes('default_avatar.png') && (
                        <button 
                            type="button" 
                            className={styles.removeButton} 
                            onClick={handleRemoveImage}
                        >
                            Fotoğrafı Kaldır
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditProfile;