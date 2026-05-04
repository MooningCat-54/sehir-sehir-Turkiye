import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; //[cite: 16]
import './css/CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose }) => {
    const { user } = useAuth(); // Kimin paylaştığını anlamak için[cite: 16]
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Doğa'); //[cite: 13]
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Resim gönderdiğimiz için FormData paketini hazırlıyoruz[cite: 12]
        const formData = new FormData();
        formData.append('username', user.username); // SQL tarafında UserId'yi bulmak için[cite: 2]
        formData.append('caption', description);
        formData.append('city', location);
        formData.append('category', category);
        formData.append('type', 'post'); // Multer klasör seçimi için
        if (selectedFile) {
            formData.append('image', selectedFile); //[cite: 3]
        }

        try {
            // 2. Backend'e POST isteği atıyoruz[cite: 12]
            const response = await fetch('http://localhost:5000/api/posts/add', {
                method: 'POST',
                body: formData // Header ekleme, tarayıcı halleder[cite: 12]
            });

            if (response.ok) {
                alert("Deneyiminiz paylaşıldı! 🚀");
                onClose();
                window.location.reload(); // Listeyi güncellemek için en basit yol[cite: 13]
            }
        } catch (error) {
            console.error("Yükleme hatası:", error);
            alert("Sunucuya ulaşılamıyor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Yeni Deneyim Paylaş</h2>
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
                            <option value="Gastronomi">Gastronomi</option>
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
                        <label>Fotoğraf Ekle</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="file-input" 
                            onChange={(e) => setSelectedFile(e.target.files[0])} // Dosyayı yakalıyoruz[cite: 12]
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>İptal</button>
                        <button type="submit" className="share-btn" disabled={loading}>
                            {loading ? 'Paylaşılıyor...' : 'Paylaş'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;