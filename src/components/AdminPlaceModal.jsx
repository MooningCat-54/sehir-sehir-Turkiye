import React, { useState, useEffect } from 'react';
import './css/AdminPlaceModal.css';

const CATEGORIES_LIST = [
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

const AdminPlaceModal = ({ onClose, initialData = null }) => {
    const isEditMode = !!initialData;
    const baseUrl = "http://localhost:5000";
    const [formData, setFormData] = useState({
        title: initialData?.Title || '',
        city: initialData?.City || '',
        description: initialData?.Description || '',
        locationDetail: initialData?.LocationDetail || '',
        detailedContent: ''
    });
    const [image, setImage] = useState(null);
    const [additionalImage, setAdditionalImage] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && initialData?.Id) {
            const fetchDetailedData = async () => {
                try {
                    const res = await fetch(`${baseUrl}/api/posts/official/detail/${initialData.Id}`);
                    const data = await res.json();
                    
                    if (data.success && data.place) {
                        setFormData(prev => ({
                            ...prev,
                            detailedContent: data.place.DetailedContent || ''
                        }));

                        if (data.place.Category) {
                            const existingNames = data.place.Category.split(',').map(name => name.trim().toLowerCase());
                            const matchedIds = CATEGORIES_LIST
                                .filter(cat => existingNames.includes(cat.name.toLowerCase()))
                                .map(cat => cat.id);
                            setSelectedCategories(matchedIds);
                        }
                    }
                } 
                catch (err) {
                    console.error("Detaylı veriler yüklenirken hata oluştu:", err);
                }
            };
            fetchDetailedData();
        }
    }, [isEditMode, initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (catId) => {
        if (catId === 1) return; 

        if (selectedCategories.includes(catId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== catId));
        } 
        else {
            setSelectedCategories([...selectedCategories, catId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedCategories.length === 0) {
            alert("Lütfen en az bir kategori seçin!");
            return;
        }
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('city', formData.city);
        data.append('description', formData.description);
        data.append('locationDetail', formData.locationDetail);
        data.append('detailedContent', formData.detailedContent);
        data.append('categoryIds', JSON.stringify(selectedCategories));

        if (image) data.append('image', image);
        if (additionalImage) data.append('additionalImage', additionalImage);

        const url = isEditMode 
            ? `${baseUrl}/api/posts/official/update/${initialData.Id}` 
            : `${baseUrl}/api/posts/official/add`;

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                body: data
            });

            const result = await res.json();

            if (result.success) {
                alert(isEditMode ? "Rota başarıyla güncellendi!" : "Yeni rota başarıyla yayınlandı!");
                onClose();
                window.location.reload();
            } 
            else {
                alert(result.error || "İşlem başarısız oldu.");
            }
        } 
        catch (err) {
            console.error("İstek hatası:", err);
            alert("Sunucu bağlantı hatası oluştu!");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="admin-modal-header">
                    <h2>{isEditMode ? "🗺️ Resmi Rotayı Düzenle" : "🗺️ Yeni Resmi Rota Ekle"}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                
                <form onSubmit={handleSubmit} className="admin-modal-form">
                    <input name="title" value={formData.title} placeholder="Mekan Adı (Örn: Efes Antik Kenti)" onChange={handleChange} required />
                    <input name="city" value={formData.city} placeholder="Şehir" onChange={handleChange} required />
                    <input name="locationDetail" value={formData.locationDetail} placeholder="Konum Tarifi / Adres" onChange={handleChange} />
                    <input name="description" value={formData.description} placeholder="Kart Özeti (İlk Başta Görünecek Kısa Cümle)" onChange={handleChange} required />
                    <textarea name="detailedContent" value={formData.detailedContent} placeholder="Detaylı Gezi Rehberi Metni (1500-2000 Karakter)..." onChange={handleChange} style={{ minHeight: '150px' }} required />

                    <div className="category-selection-container" style={{ margin: '15px 0' }}>
                        <label style={{ fontWeight: '700', color: '#0f1419', display: 'block', marginBottom: '8px' }}>Mekan Kategorileri:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', backgroundColor: '#f7f9f9', padding: '12px', borderRadius: '12px', border: '1px solid #cfd9de' }}>
                            {CATEGORIES_LIST.filter(c => c.id !== 1).map((cat) => (
                                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer', color: '#2f3336' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes(cat.id)} 
                                        onChange={() => handleCategoryChange(cat.id)} 
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                    {cat.icon} {cat.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="file-input-group" style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: '700' }}>1. Ana Görsel {isEditMode && "(Değiştirmek istemiyorsanız boş bırakın)"}:</label>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} required={!isEditMode} />
                    </div>

                    <div className="file-input-group" style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: '700' }}>2. Ek Galeri Görseli (İsteğe Bağlı):</label>
                        <input type="file" onChange={(e) => setAdditionalImage(e.target.files[0])} />
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