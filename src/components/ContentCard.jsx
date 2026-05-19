import React, { useState, useEffect } from "react";
import DropdownMenu from "./DropDownMenu";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './css/ContentCard.css';
import AdminPlaceModal from './AdminPlaceModal';

const ContentCard = ({ data, onUnsave }) => {
    const baseUrl = "http://localhost:5000";
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { Id, IsSaved } = data;
    const [savedStatus, setSavedStatus] = useState(Number(IsSaved) === 1);

    useEffect(() => {
        setSavedStatus(Number(IsSaved) === 1);
    }, [IsSaved]);

    const imageSource = data.MainImage 
        ? `${baseUrl}${data.MainImage}` 
        : `${baseUrl}/uploads/official/default.jpg`;

    const handleDelete = async () => {
        const placeId = Id;
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
                    alert("Silme işlemi başarısız oldu.");
                }
            } 
            catch (error) {
                console.error("Silme hatası:", error);
            }
        }
    };

    const handleOpenModel = () => {
        setIsModalOpen(true);
    };

    const handleCloseModel = () => {
        setIsModalOpen(false);
    };

    const handleSaveToggle = async () => {
        if (!user) {
            alert("Rotaları kaydetmek için lütfen giriş yapın!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${baseUrl}/api/posts/save-toggle`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetId: Id, itemType: 'OFFICIAL' })
            });
            const result = await res.json();

            if (result.success) {
                setSavedStatus(result.isSaved);
                if (!result.isSaved && onUnsave) {
                    onUnsave(Id);
                }
            }
        } 
        catch (err) { 
            console.error("Resmi rota kaydetme hatası:", err); 
        }
    };

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/official/${Id}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert("Bağlantı kopyalandı!"))
            .catch(err => console.error("Kopyalama hatası:", err));
    };
    
    const contentOptions = [
        {
            label: savedStatus ? "Kaydedildi" : "Kaydet",
            icon: savedStatus ? "🔖" : "💾",
            action: handleSaveToggle
        },
        { label: 'Paylaş', icon: '🔗', action: () => handleShare() },
        ...(user && user.isAdmin ? [
            { label: "Düzenle", icon: "✏️", action: handleOpenModel },
            { label: "Sil", icon: "🗑️", action: handleDelete }
        ] : [])
    ];
        
    return (
        <div 
            className="card-box"
            onClick={() => navigate(`/official/${Id}`)}
            style={{ cursor: 'pointer' }}
        >
    
            {user && (
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu options={contentOptions} />
                </div>
            )}
            
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
                <div onClick={(e) => e.stopPropagation()}>
                    <AdminPlaceModal 
                        onClose={handleCloseModel} 
                        initialData={data} 
                    />
                </div>
            )}
        </div>
    );
};

export default ContentCard;