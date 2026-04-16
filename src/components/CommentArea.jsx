import React, { useState } from 'react';
import Comment from './Comment';
import './css/CommentArea.css'

const CommentArea = () => {
    //mock data
    const [comments, setComments] = useState([
        { id: 1, user: { name: 'kullanıcı1', avatar: '' }, text: 'gev gev geegvevev', date: '2sa' },
        { id: 2, user: { name: 'kullanıcı2', avatar: '' }, text: 'gevgvgevgeeggevgve', date: '5sa' }
    ]);

    const [newComment, setNewComment] = useState('');

    const handleSend = () => {
        if (newComment.trim() === '') return;
        
        const commentObj = {
            id: Date.now(),
            user: { name: 'dürüm_cehenemi', avatar: '' },
            text: newComment,
            date: 'Şimdi'
        };
        
        setComments([commentObj, ...comments]);
        setNewComment('');
    };

    return (
        <div className="comment-area-container">
            <div className="comment-area-writing-container">
                <img 
                    className="comment-area-avatar"
                    src="benim avatarım"
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
                    />
                    <button 
                        className="comment-area-send-button-element"
                        onClick={handleSend}
                    >
                        🔷
                    </button>
                </div>
            </div>

            <div>
                {comments.map(c => (
                    <Comment key={c.id} user={c.user} text={c.text} date={c.date} />
                ))}
            </div>
        </div>
    );
};

export default CommentArea;