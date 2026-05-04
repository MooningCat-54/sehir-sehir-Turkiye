import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { useAuth } from '../context/AuthContext'; // Giriş yapan kullanıcıyı kontrol etmek için
import './css/CommentArea.css'

const CommentArea = ({ postId }) => {
    const { user } = useAuth(); // Kullanıcı oturum bilgisini çek[cite: 16]
    const [comments, setComments] = useState([]); // Mock data temizlendi
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const baseUrl = "http://localhost:5000";

    // 1. Veritabanından (MSSQL) yorumları çek[cite: 4, 13]
    useEffect(() => {
        const fetchComments = async () => {
            try {
                // DÜZELTME: GET isteği kullanılır, body gönderilmez
                const response = await fetch(`${baseUrl}/api/comments/${postId}`); 
                const data = await response.json();
                
                if (data.success) {
                    setComments(data.comments);
                }
            } catch (error) {
                console.error("Yorumlar çekilemedi:", error);
            }
        };

        if (postId) fetchComments();
    }, [postId]);

    // 2. Yeni yorum gönder[cite: 4, 20]
    const handleSend = async () => {
        if (!user || newComment.trim() === '') return;
        
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/comments/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: postId,
                    username: user.username,
                    commentText: newComment
                })
            });

            const data = await response.json();

            if (data.success) {
                setNewComment(''); // Input'u temizle
                
                // BEYAZ EKRANI ÖNLEYEN ÇÖZÜM: 
                // Manuel ekleme yapmak yerine mevcut fetch fonksiyonunu tekrar çağırıyoruz
                const refreshRes = await fetch(`${baseUrl}/api/comments/${postId}`);
                const refreshData = await refreshRes.json();
                if (refreshData.success) {
                    setComments(refreshData.comments);
                }
            }
        } catch (error) {
            console.error("Yorum gönderim hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comment-area-container">
            {/* 1. Giriş kontrolü aynı kalıyor */}
            {user ? (
                <div className="comment-area-writing-container">
                    <img 
                        className="comment-area-avatar"
                        src={user.avatarUrl ? `${baseUrl}${user.avatarUrl}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt="Profil"
                    />
                    <div className="comment-area-input-container">
                        <input
                            className="comment-area-input-element"
                            type="text"
                            placeholder="Yorum yaz..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={loading}
                        />
                        <button 
                            className="comment-area-send-button-element"
                            onClick={handleSend}
                            disabled={loading}
                        >
                            {loading ? '...' : '🔷'}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="login-to-comment-msg">Yorum yapmak için giriş yapmalısınız.</p>
            )}

            <div>
                {/* 2. DÜZELTME: 'comments' dizisinin varlığını ve uzunluğunu kontrol ediyoruz */}
                {Array.isArray(comments) && comments.length > 0 ? (
                    comments.map(c => (
                        <Comment 
                            key={c.Id} // SQL'den gelen büyük harf 'Id'
                            user={{ 
                                name: c.Username, 
                                avatar: c.AvatarUrl ? `${baseUrl}${c.AvatarUrl}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                            }} 
                            text={c.CommentText} // SQL kolon ismi
                            date={new Date(c.CreatedAt).toLocaleDateString('tr-TR')} 
                        />
                    ))
                ) : (
                    /* 3. Veri yoksa veya yükleniyorsa kullanıcıya mesaj gösteriyoruz */
                    <p style={{ textAlign: 'center', color: '#888', padding: '10px' }}>
                        Henüz yorum yapılmamış. İlk yorumu sen yap!
                    </p>
                )}
            </div>
        </div>
    );         
};

export default CommentArea;