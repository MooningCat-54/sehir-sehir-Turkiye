import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShareButton from '../components/ShareButton';
import SaveButton from '../components/SaveButton';

// YENİ CSS DOSYASININ IMPORT EDİLMESİ
import './css/OfficialPlaceDetailPage.css';

const OfficialPlaceDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const baseUrl = "http://localhost:5000";

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedStatus, setSavedStatus] = useState(false);

    useEffect(() => {
        const fetchPlaceData = async () => {
            try {
                const userIdParam = user?.userId || user?.UserId || 0;
                const res = await fetch(`${baseUrl}/api/posts/official/detail/${id}?userId=${userIdParam}`);
                const data = await res.json();

                if (data.success) {
                    setPlace(data.place);
                    setSavedStatus(Number(data.place.IsSaved) === 1);
                }
            } catch (err) {
                console.error("Resmi rota yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceData();
    }, [id, user]);

    const handleSaveToggle = async () => {
        if (!user) { alert("Rotaları kaydetmek için lütfen giriş yapın!"); return; }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${baseUrl}/api/posts/save-toggle`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ targetId: Number(id), itemType: 'OFFICIAL' })
            });
            const result = await res.json();
            if (result.success) setSavedStatus(result.isSaved);
        } catch (err) { console.error("Kaydetme hatası:", err); }
    };

    if (loading) return <div className="no-comments-box">Yükleniyor...</div>;
    if (!place) return <div className="no-comments-box">Rota bulunamadı.</div>;

    return (
        <div className="official-detail-container">
            <div className="official-detail-card">
                
                {/* BAŞLIK */}
                <h1 className="official-detail-title">{place.Title}</h1>
                
                {/* METADATA (KONUM & KATEGORİ) */}
                <div className="official-detail-meta-bar">
                    <span className="official-detail-location">
                        📍 {place.City} / {place.LocationDetail}
                    </span>
                    {place.Category && (
                        <span className="official-detail-category-badge">
                            {place.Category}
                        </span>
                    )}
                </div>

                {/* 1. ANA RESİM */}
                <div className="official-detail-image-wrapper">
                    <img className="official-detail-image" src={`${baseUrl}${place.MainImage}`} alt={place.Title} />
                </div>

                {/* DETAYLI MAKALELER / GEZİ YAZISI */}
                <p className="official-detail-content">
                    {place.DetailedContent}
                </p>

                {/* EĞER VARSA 2. GALERİ RESMİ */}
                {place.AdditionalImage && (
                    <div className="official-detail-image-wrapper">
                        <img className="official-detail-image" src={`${baseUrl}${place.AdditionalImage}`} alt={`${place.Title} Galeri`} />
                    </div>
                )}

                {/* AKSİYON BUTONLARI */}
                <div className="official-detail-action-bar">
                    <ShareButton postId={place.Id} itemType="OFFICIAL" />
                    <SaveButton active={savedStatus} onClick={handleSaveToggle} />
                </div>

            </div>
        </div>
    );
};

export default OfficialPlaceDetailPage;