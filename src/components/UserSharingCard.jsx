import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LikeButton from './LikeButton';
import DisLikeButton from './DisLikeButton';
import ShareButton from './ShareButton';
import SaveButton from './SaveButton';
import CommentArea from './CommentArea';
import './css/UserSharingCard.css';
import DropdownMenu from './DropDownMenu';
import CreatePostModal from './CreatePostModal';
import { useNavigate } from 'react-router-dom';

const UserSharingCard = ({ data, onUnsave }) => {
    const { user } = useAuth();
    const baseUrl = "http://localhost:5000";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    const { 
        ImageUrl, Caption, City, Username, AvatarUrl, Id,
        LikeCount, DislikeCount, UserInteraction, IsSaved
    } = data;

    const handleDelete = async () => {
        const postId = Id; // Yukarıda destruct ettiğin Id'yi doğrudan kullanıyoruz

        if (!window.confirm("Bu paylaşımı silmek istediğinize emin misiniz?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/posts/user-share/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                alert("Paylaşım başarıyla silindi.");
                window.location.reload();
            } else {
                alert("Hata: " + result.message);
            }
        } catch (err) {
            console.error("Silme hatası:", err);
        }
    };

    const handleEdit = () => {
        setIsModalOpen(true); // Modalı açar
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Modalı kapatır
    };

    const handleSave = () => {
        console.log("Kaydedildi, post ID:", Id);
        // Buraya ileride SavedItems tablosuna atılacak istek gelecek
    };

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/posts/${Id}`; // Veya özel post linki
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert("Bağlantı kopyalandı!"))
            .catch(err => console.error("Kopyalama hatası:", err));
    };

    const handleReport = () => {
        alert("Gönderi bildirildi.");
    };

    // YARDIMCI FONKSİYON: Gelen veriyi güvenli bir şekilde sayıya veya null'a çevirir
    const parseStatus = (val) => {
        if (val === null || val === undefined) return null;
        return Number(val);
    };

    const [stats, setStats] = useState({
        likes: Number(LikeCount) || 0,
        dislikes: Number(DislikeCount) || 0,
        myStatus: parseStatus(UserInteraction)
    });

    const [savedStatus, setSavedStatus] = useState(Number(IsSaved) === 1);

    useEffect(() => {
        setStats({
            likes: Number(LikeCount) || 0,
            dislikes: Number(DislikeCount) || 0,
            myStatus: UserInteraction !== null ? Number(UserInteraction) : null
        });
        setSavedStatus(Number(IsSaved) === 1);
    }, [LikeCount, DislikeCount, UserInteraction, IsSaved]);

    const handleAction = async (type) => {
        try {
            const res = await fetch(`${baseUrl}/api/posts/${Id}/interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId || user.UserId, type: type })
            });
            const data = await res.json();

            if (data.success) {
                setStats({
                    likes: data.likes,
                    dislikes: data.dislikes,
                    myStatus: data.myStatus
                });
            }
        } catch (err) { console.error(err); }
    };

    const handleSaveToggle = async () => {
        if (!user) {
            alert("İçerikleri kaydetmek için lütfen giriş yapın!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${baseUrl}/api/posts/save-toggle`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // AuthMiddleWare'in token'ı yakalaması için şart
                },
                body: JSON.stringify({ targetId: Id, itemType: 'POST' })
            });
            const result = await res.json();

            if (result.success) {
                if (!result.isSaved && onUnsave) {
                    onUnsave(Id);
                }    
                setSavedStatus(result.isSaved);
            }
        } catch (err) { 
            console.error("Kaydetme hatası:", err); 
        }
    };

    const displayAvatar = AvatarUrl ? `${baseUrl}${AvatarUrl}` : `https://ui-avatars.com/api/?name=${Username}&background=random&color=fff`;

    const userSharingOptions = [
        { label: savedStatus ? 'Kaydedildi' : 'Kaydet', icon: '🔖', action: handleSaveToggle },
        { label: 'Paylaş', icon: '🔗', action: () => handleShare() },
        
        ...(!user?.isAdmin && (user?.userId !== data.UserId && user?.UserId !== data.UserId) ? [
            { label: 'Bildir', icon: '🚩', action: () => handleReport() }
        ] : []),
        
        ...(user?.isAdmin || user?.userId === data.UserId || user?.UserId === data.UserId ? [
            { label: 'Düzenle', icon: '✏️', action: () => handleEdit() },
            { label: 'Sil', icon: '🗑️', action: () => handleDelete() }
        ] : [])
    ];

    return (
        <div className="usersharingcard-card-container"
            onClick={() => navigate(`/posts/${Id}`)}
            style={{ cursor: 'pointer' }}
        >
            <div onClick={(e) => e.stopPropagation()}>
                {user && <DropdownMenu options={userSharingOptions} />}
            </div>

            {ImageUrl && (
                <div className="usersharingcard-image-container">
                    <img className="usersharingcard-image-element" src={`${baseUrl}${ImageUrl}`} alt="Gezi Görseli" />
                </div>
            )}

            <div className="usersharingcard-content-container">
                <div className="usersharingcard-profile-container">
                    <div className="usersharingcard-avatar-container">
                        <img className="usersharingcard-avatar-element" src={displayAvatar} alt={Username} />
                        <span className="usersharingcard-name-container">{Username}</span>
                    </div>
                    <span className="usersharingcard-date-container">📍 {City}</span>
                </div>

                <p className="usersharingcard-text-content-container">{Caption}</p>

                <div className="usersharingcard-engagement-buttons-container" onClick={(e) => e.stopPropagation()}>
                    <LikeButton 
                        count={stats.likes} 
                        active={stats.myStatus === 1} 
                        onClick={() => handleAction(1)} 
                    /> 
                    <DisLikeButton 
                        count={stats.dislikes} 
                        active={stats.myStatus === 2} 
                        onClick={() => handleAction(2)}
                    />
                    <ShareButton postId={Id} />
                    <SaveButton 
                        active={savedStatus} 
                        onClick={handleSaveToggle} 
                    />
                </div>
                
                <div className="usersharingcard-comment-container" onClick={(e) => e.stopPropagation()}>
                    <CommentArea postId={Id} /> 
                </div>
            </div>

            {isModalOpen && (
                <div>
                    <CreatePostModal 
                        isOpen={isModalOpen}
                        onClose={handleCloseModal} 
                        initialData={data} // Kartın orijinal verisini modal içine paslıyoruz
                    />
                </div>
            )}
        </div>
    );
};

export default UserSharingCard;