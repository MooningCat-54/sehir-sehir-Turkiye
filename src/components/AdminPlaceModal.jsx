import React, { useState } from 'react';
import './css/AdminPlaceModal.css';

const AdminPlaceModal = ({ onClose, initialData = null }) => {

    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        title: initialData?.Title || '',
        city: initialData?.City || '',
        category: initialData?.Category || '',
        description: initialData?.Description || '',
        locationDetail: initialData?.LocationDetail || ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('city', formData.city);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('locationDetail', formData.locationDetail);

        if (image) data.append('image', image);

        // Dinamik API rotası ve Method
        const url = isEditMode 
            ? `http://localhost:5000/api/posts/official/update/${initialData.Id}` 
            : 'http://localhost:5000/api/posts/official/add';
        
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method: method, body: data });
            const result = await response.json();

            if (result.success) {
                alert(isEditMode ? "Güncellendi!" : "Eklendi!");
                onClose();
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        } finally { setLoading(false); }
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content">
                <div className="admin-modal-header">
                    <h2>{isEditMode ? "Rotayı Düzenle" : "Yeni Resmi Rota Ekle"}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="admin-modal-form">
                    <input name="title" value={formData.title} placeholder="Mekan Adı (Örn: Efes Antik Kenti)" onChange={handleChange} required />
                    <input name="city" value={formData.city} placeholder="Şehir" onChange={handleChange} required />
                    <input name="category" value={formData.category} placeholder="Kategoriler (Virgülle ayırın)" onChange={handleChange} required />
                    <input name="locationDetail" value={formData.locationDetail} placeholder="Konum Tarifi / Adres" onChange={handleChange} />
                    <textarea name="description" value={formData.description} placeholder="Mekan hakkında detaylı bilgi..." onChange={handleChange} required />
                    
                    <div className="file-input-group">
                        <label>Mekan Görseli {isEditMode && "(Değiştirmek istemiyorsanız boş bırakın)"}:</label>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} required={!isEditMode} />
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? "İşleniyor..." : (isEditMode ? "Güncellemeleri Kaydet" : "Rotayı Yayınla")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPlaceModal;