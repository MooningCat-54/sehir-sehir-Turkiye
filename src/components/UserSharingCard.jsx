import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LikeButton from './LikeButton';
import DisLikeButton from './DisLikeButton';
import ShareButton from './ShareButton';
import SaveButton from './SaveButton';
import CommentArea from './CommentArea';
import './css/UserSharingCard.css';
import DropdownMenu from './DropDownMenu';

const UserSharingCard = ({ sharingCard }) => {
    const { user } = useAuth();
    const baseUrl = "http://localhost:5000";

    const handleDelete = async () => {
        const postId = sharingCard.Id// Props ismine göre kontrol et

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

    const userSharingOptions = [
        { label: 'Kaydet', icon: '🔖', action: () => handleSave() },
        { label: 'Paylaş', icon: '🔗', action: () => handleShare() },
        // Bildir butonu: Admin değilse VE post sahibi değilse görünsün
        ...(!user?.isAdmin && user?.userId !== sharingCard.UserId ? [
            { label: 'Bildir', icon: '🚩', action: () => handleReport() }
        ] : []),
        // Sil/Düzenle: Adminse VEYA postun sahibiyse görünsün
        ...(user?.isAdmin || user?.userId === sharingCard.UserId ? [
            { label: 'Düzenle', icon: '✏️', action: () => handleEdit() },
            { label: 'Sil', icon: '🗑️', action: () => handleDelete() }
        ] : [])
    ];

    const { 
        ImageUrl, Caption, City, Username, AvatarUrl, Id,
        LikeCount, DislikeCount, UserInteraction 
    } = sharingCard;

    // YARDIMCI FONKSİYON: Gelen veriyi güvenli bir şekilde sayıya veya null'a çevirir
    const parseStatus = (val) => {
        if (val === null || val === undefined) return null;
        return Number(val); // "1" -> 1 yapar
    };

    const [stats, setStats] = useState({
        likes: Number(LikeCount) || 0,
        dislikes: Number(DislikeCount) || 0,
        myStatus: parseStatus(UserInteraction)
    });

    useEffect(() => {
    setStats({
        likes: Number(LikeCount) || 0,
        dislikes: Number(DislikeCount) || 0,
        // Number() kullanarak gelen veriyi kesin olarak sayıya çeviriyoruz
        myStatus: UserInteraction !== null ? Number(UserInteraction) : null
    });
}, [LikeCount, DislikeCount, UserInteraction]);

    const handleAction = async (type) => {
        try {
            const res = await fetch(`${baseUrl}/api/posts/${Id}/interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, type: type })
            });
            const data = await res.json();

            if (data.success) {
                // Backend'den gelen kesin rakamlar neyse o!
                setStats({
                    likes: data.likes,
                    dislikes: data.dislikes,
                    myStatus: data.myStatus
                });
            }
        } catch (err) { console.error(err); }
    };

    const displayAvatar = AvatarUrl ? `${baseUrl}${AvatarUrl}` : `https://ui-avatars.com/api/?name=${Username}&background=random&color=fff`;

    return (
        <div className="usersharingcard-card-container">
            {user && <DropdownMenu options={userSharingOptions} />}

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

                <div className="usersharingcard-engagement-buttons-container">
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
                    <SaveButton postId={Id} />
                </div>
                
                <div className="usersharingcard-comment-container">
                    <CommentArea postId={Id} /> 
                </div>
            </div>
        </div>
    );
};

export default UserSharingCard;