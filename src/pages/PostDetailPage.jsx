import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LikeButton from '../components/LikeButton';
import DisLikeButton from '../components/DisLikeButton';
import ShareButton from '../components/ShareButton';
import SaveButton from '../components/SaveButton';
import DropdownMenu from '../components/DropDownMenu';
import CreatePostModal from '../components/CreatePostModal';


import '../components/css/UserSharingCard.css'; 
import './css/PostDetailPage.css' // <-- Yeni CSS Dosyamız Buraya Eklendi

const PostDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const baseUrl = "http://localhost:5000";

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedStatus, setSavedStatus] = useState(false);
    const [stats, setStats] = useState({ likes: 0, dislikes: 0, myStatus: 0 });

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const userIdParam = user?.userId || user?.UserId || 0;
                
                const postRes = await fetch(`${baseUrl}/api/posts/user-share/detail/${id}?userId=${userIdParam}`);
                const postData = await postRes.json();

                const commentRes = await fetch(`${baseUrl}/api/comments/${id}`);
                const commentData = await commentRes.json();

                if (postData.success) {
                    setPost(postData.post);
                    setSavedStatus(Number(postData.post.IsSaved) === 1);
                    setStats({
                        likes: postData.post.LikeCount || 0,
                        dislikes: postData.post.DislikeCount || 0,
                        myStatus: postData.post.UserInteraction || 0
                    });
                }
                if (commentData.success) {
                    setComments(commentData.comments);
                }
            } catch (err) {
                console.error("Detay sayfası yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
    }, [id, user]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) { alert("Yorum yapabilmek için lütfen giriş yapın!"); return; }
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`${baseUrl}/api/comments/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: id,
                    username: user.username,
                    commentText: newComment
                })
            });
            const result = await res.json();

            if (result.success) {
                const newCommentObj = {
                    Id: Date.now(),
                    CommentText: newComment,
                    CreatedAt: new Date().toISOString(),
                    Username: user.username,
                    AvatarUrl: user.avatarUrl || user.AvatarUrl || "/uploads/avatars/default_avatar.png"
                };
                setComments(prev => [newCommentObj, ...prev]);
                setNewComment("");
            }
        } catch (err) {
            console.error("Yorum eklenirken hata oluştu:", err);
        }
    };

    // PostDetailPage.jsx içindeki handleAction fonksiyonunu backend beklentisine göre güncelliyoruz:
    const handleAction = async (type) => {
        try {
            // Güvenlik Duvarı: Kullanıcı giriş yapmadıysa işlem yaptırma
            if (!user) {
                alert("Beğeni/Dislike işlemi gerçekleştirebilmek için lütfen giriş yapın!");
                return;
            }

            // Orijinal bağlantıya sadık kalıyoruz: body içinde hem userId hem type gönderiyoruz
            const res = await fetch(`${baseUrl}/api/posts/${id}/interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: user.userId || user.UserId, // Backend'in beklediği parametre
                    type: type                          // Backend interactionType yerine 'type' bekliyor
                })
            });
            
            const data = await res.json();

            if (data.success) {
                // Backend'den dönen güncel istatistikleri doğrudan state'e yediriyoruz
                setStats({
                    likes: data.likes,
                    dislikes: data.dislikes,
                    myStatus: data.myStatus
                });
            }
        } catch (err) { 
            console.error("Etkileşim hatası:", err); 
        }
    };

    const handleSaveToggle = async () => {
        if (!user) { alert("İçerikleri kaydetmek için lütfen giriş yapın!"); return; }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${baseUrl}/api/posts/save-toggle`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                // Sayısal eşleşme garantisi için Number(id) yaptık
                body: JSON.stringify({ targetId: Number(id), itemType: 'POST' })
            });
            const result = await res.json();
            if (result.success) setSavedStatus(result.isSaved);
        } catch (err) { console.error("Kaydetme hatası:", err); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Bu paylaşımı silmek istediğinize emin misiniz?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${baseUrl}/api/posts/user-share/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/home');
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="no-comments-box">Yükleniyor...</div>;
    if (!post) return <div className="no-comments-box">Gönderi bulunamadı.</div>;

    const userSharingOptions = [
        { label: savedStatus ? 'Kaydedildi' : 'Kaydet', icon: '🔖', action: handleSaveToggle },
        { label: 'Paylaş', icon: '🔗', action: () => {} },
        ...(!user?.isAdmin && (user?.userId !== post.UserId && user?.UserId !== post.UserId) ? [
            { label: 'Bildir', icon: '🚩', action: () => {} }
        ] : []),
        ...(user?.isAdmin || user?.userId === post.UserId || user?.UserId === post.UserId ? [
            { label: 'Düzenle', icon: '✏️', action: () => setIsModalOpen(true) },
            { label: 'Sil', icon: '🗑️', action: handleDelete }
        ] : [])
    ];

    return (
        <div className="post-detail-container">
            {/* 1. BÖLÜM: BÜYÜTÜLMÜŞ ANA KART */}
            <div className="usersharingcard-card-container">
                <DropdownMenu options={userSharingOptions} />
                {post.ImageUrl && (
                    <div className="usersharingcard-image-wrapper">
                        <img className="usersharingcard-main-image" src={`${baseUrl}${post.ImageUrl}`} alt="Post" />
                    </div>
                )}
                <div className="usersharingcard-content-section">
                    <div className="usersharingcard-user-info-bar">
                        <div className="usersharingcard-profile-group">
                            <img className="usersharingcard-avatar" src={`${baseUrl}${post.AvatarUrl}`} alt="Avatar" />
                            <span className="usersharingcard-name-container">{post.Username}</span>
                        </div>
                        <span className="usersharingcard-date-container">📍 {post.City}</span>
                    </div>
                    <p className="usersharingcard-text-content-container">
                        {post.Caption}
                    </p>
                    <div className="usersharingcard-engagement-buttons-container">
                        <LikeButton count={stats.likes} active={stats.myStatus === 1} onClick={() => handleAction(1)} /> 
                        <DisLikeButton count={stats.dislikes} active={stats.myStatus === 2} onClick={() => handleAction(2)} />
                        <ShareButton postId={post.Id} />
                        <SaveButton active={savedStatus} onClick={handleSaveToggle} />
                    </div>
                </div>
            </div>

            {/* 2. BÖLÜM: TWITTER TARZI INPUT ALANI */}
            <div className="comment-form-container">
                <form onSubmit={handleAddComment} className="comment-form">
                    <img 
                        src={`${baseUrl}${user?.avatarUrl || user?.AvatarUrl || "/uploads/avatars/default_avatar.png"}`} 
                        alt="Profil" 
                        className="comment-form-avatar"
                    />
                    <input 
                        type="text" 
                        placeholder="Yanıtını ufak bir yorumla süsle..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="comment-input"
                    />
                    <button type="submit" className="comment-submit-btn">
                        Yanıtla
                    </button>
                </form>
            </div>

            {/* 3. BÖLÜM: YORUMLAR (YANITLAR) AKIŞI */}
            <div style={{ marginTop: '15px' }}>
                <h3 className="replies-title">Yanıtlar</h3>
                {comments.length === 0 ? (
                    <div className="no-comments-box">
                        Henüz hiç yanıt yok. İlk yanıtlayan sen ol!
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.Id} className="comment-item-card">
                            <img 
                                src={`${baseUrl}${comment.AvatarUrl}`} 
                                alt="Yorum Profil" 
                                className="comment-item-avatar"
                            />
                            <div className="comment-item-content">
                                <div className="comment-item-header">
                                    <span className="comment-item-username">{comment.Username}</span>
                                    <span className="comment-item-date">
                                        {new Date(comment.CreatedAt).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                                <p className="comment-item-text">{comment.CommentText}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={post} />
            )}
        </div>
    );
};

export default PostDetailPage;