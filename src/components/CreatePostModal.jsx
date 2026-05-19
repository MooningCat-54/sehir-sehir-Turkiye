import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import './css/CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, initialData = null }) => {
    const { user } = useAuth(); 
    const isEditMode = !!initialData;
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Doğa'); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setLocation(initialData.City || initialData.city || '');
                setDescription(initialData.Caption || initialData.caption || '');
                setCategory(initialData.Category || initialData.category || 'Doğa');
            } 
            else {
                setLocation('');
                setDescription('');
                setCategory('Doğa');
                setSelectedFile(null);
            }
        }
    }, [isOpen, initialData, isEditMode]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('username', user.username); 
        formData.append('caption', description);
        formData.append('city', location);
        formData.append('category', category);
        formData.append('type', 'post'); 
        
        if (selectedFile) {
            formData.append('image', selectedFile); 
        }

        const url = isEditMode 
            ? `http://localhost:5000/api/posts/user/update/${initialData.Id || initialData.id}`
            : 'http://localhost:5000/api/posts/add';
        
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                body: formData 
            });

            if (response.ok) {
                alert(isEditMode ? "Deneyiminiz başarıyla güncellendi! 📝" : "Deneyiminiz paylaşıldı! 🚀");
                onClose();
                window.location.reload(); 
            } 
            else {
                const errText = await response.text();
                alert("Hata oluştu: " + errText);
            }
        } 
        catch (error) {
            console.error("İşlem hatası:", error);
            alert("Sunucuya ulaşılamıyor.");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditMode ? "Deneyimi Düzenle" : "Yeni Deneyim Paylaş"}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Nereyi Gezdin?</label>
                        <input 
                            type="text" 
                            placeholder="Örn: Sivas, Divriği" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Kategori</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Doğa">Doğa</option>
                            <option value="Tarih">Tarih</option>
                            <option value="Deniz">Deniz</option>
                            <option value="Kamp">Kamp</option>
                            <option value="Şehir">Şehir</option>
                            <option value="Gastronomi">Gastronomi</option>
                            <option value="Kış Turizmi">Kış Turizmi</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Deneyimlerini Anlat</label>
                        <textarea 
                            placeholder="Neler gördün?" 
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Fotoğraf {isEditMode ? "Değiştir (Aynı kalacaksa boş bırakın)" : "Ekle"}</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="file-input" 
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            required={!isEditMode}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>İptal</button>
                        <button type="submit" className="share-btn" disabled={loading}>
                            {loading ? 'Kaydediliyor...' : (isEditMode ? 'Değişiklikleri Kaydet' : 'Paylaş')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;