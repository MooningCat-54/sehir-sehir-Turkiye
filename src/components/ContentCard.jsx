import React from "react";
import { useState } from "react";
import DropdownMenu from "./DropDownMenu";
import { useAuth } from "../context/AuthContext";
import './css/ContentCard.css';
import AdminPlaceModal from './AdminPlaceModal';

const ContentCard = ({ data }) => {
    const baseUrl = "http://localhost:5000";
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageSource = data.MainImage 
        ? `${baseUrl}${data.MainImage}` 
        : `${baseUrl}/uploads/official/default.jpg`;

    const handleDelete = async () => {
        // Backend 'Id' (Büyük I) beklediği için garantiye alıyoruz
        const placeId = data.Id;

        if (!placeId) {
            alert("Hata: Silinecek öğenin ID'si bulunamadı!");
            return;
        }

        const confirmDelete = window.confirm("Bu resmi rotayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");
        
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${baseUrl}/api/posts/official/${placeId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Backend'den gelen hata metni:", errorText);
                    alert("Hata: " + errorText);
                    return;
                }

                const result = await response.json();

                if (result.success) {
                    alert("Rota başarıyla silindi.");
                    window.location.reload(); 
                } else {
                    alert("Silme işlemi başarısız: " + result.message);
                }
            } catch (err) {
                console.error("Silme hatası:", err);
                alert("Sunucuyla bağlantı kurulamadı.");
            }
        }
    };

    const handleSave = () => console.log("Kaydedildi");
    
    const handleShare = () => {
        const shareUrl = `${window.location.origin}/home`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                alert("Bağlantı kopyalandı! İstediğiniz yerde paylaşabilirsiniz.");
            })
            .catch(err => {
                console.error("Kopyalama hatası:", err);
                alert("Bağlantı kopyalanamadı.");
            });
    };

    const handleEdit = () => {
        setIsModalOpen(true);
    };
    const handleCloseModel = () => {
        setIsModalOpen(false);
    };

    const contentOptions = [
        { label: 'Kaydet', icon: '🔖', action: handleSave },
        { label: 'Paylaş', icon: '🔗', action: handleShare },
        ...(user?.isAdmin ? [
            { label: 'Düzenle', icon: '✏️', action: handleEdit },
            // DÜZELTME: action: () => handleDelete() yerine direkt fonksiyonun kendisini (handleDelete) geçiyoruz
            { label: 'Sil', icon: '🗑️', action: handleDelete } 
        ] : [])
    ];
        
    return (
        <div className="card-box">
            {/* Sadece giriş yapılmışsa menü gözüksün */}
            {user && <DropdownMenu options={contentOptions} />}
            
            <img 
                className="card-image"
                src={imageSource}
                alt={data.Title}
                onError={(e) => e.target.src = "https://via.placeholder.com/400x250?text=Görsel+Bulunamadı"}
            />
            
            <div className="card-content-container">
                <h3 className="card-title">{data.Title}</h3>
                <p className="card-text-content">{data.Description}</p>
                
                <div className="card-date-n-like-button-container">
                    <span className="card-date">📍 {data.City} / {data.LocationDetail}</span>
                </div>
                
                {data.Category && (
                    <div className="card-categories" style={{fontSize: '0.8rem', color: '#1877f2', marginTop: '5px'}}>
                        {data.Category}
                    </div>
                )}
            </div>
            
            {isModalOpen && (
                <AdminPlaceModal 
                    onClose={handleCloseModel} 
                    initialData={data} // Kartın tüm verisini (Title, Description, Id vb.) gönderiyoruz
                />
            )}

        </div>
    );
};

export default ContentCard;