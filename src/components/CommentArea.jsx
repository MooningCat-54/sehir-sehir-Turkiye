import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { useAuth } from '../context/AuthContext';
import './css/CommentArea.css'

const CommentArea = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const baseUrl = "http://localhost:5000";
    const defaultAvatar = `${baseUrl}/uploads/avatars/default_avatar.png`;

    const displayAvatar = user?.avatar 
        ? `${baseUrl}${user.avatar}` 
        : defaultAvatar;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/comments/${postId}`); 
                const data = await response.json();
                
                if (data.success) {
                    setComments(data.comments);
                }
            } 
            catch (error) {
                console.error("Yorumlar çekilemedi:", error);
            }
        };

        if (postId) fetchComments();
    }, [postId]);

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
                
                const refreshRes = await fetch(`${baseUrl}/api/comments/${postId}`);
                const refreshData = await refreshRes.json();
                if (refreshData.success) {
                    setComments(refreshData.comments);
                }
            }
        } 
        catch (error) {
            console.error("Yorum gönderim hatası:", error);
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="comment-area-container">
            {user ? (
                <div className="comment-area-writing-container">
                    <img 
                        className="comment-area-avatar"
                        src={displayAvatar}
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
                {Array.isArray(comments) && comments.length > 0 ? (
                    comments.map(c => (
                        <Comment 
                            key={c.Id}
                            user={{ 
                                name: c.Username, 
                                avatar: c.AvatarUrl 
                            }} 
                            text={c.CommentText}
                            date={new Date(c.CreatedAt).toLocaleDateString('tr-TR')} 
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#888', padding: '10px' }}>
                        Henüz yorum yapılmamış. İlk yorumu sen yap!
                    </p>
                )}
            </div>
        </div>
    );         
};

export default CommentArea;