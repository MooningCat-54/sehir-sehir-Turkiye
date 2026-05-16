import React from 'react';
import './css/Comment.css'

const Comment = ({ user, text, date }) => {

    const baseUrl = "http://localhost:5000";
    const defaultAvatar = `${baseUrl}/uploads/avatars/default_avatar.png`;

    const displayAvatar = (user.avatar && user.avatar.length > 5)
        ? `${baseUrl}${user.avatar}` 
        : defaultAvatar;

    return (
        <div className="comment-container">
            <img className="comment-avatar"
                src={displayAvatar} 
                alt={user.name} 
            />
            
            <div className="comment-content-container">
                <div className="comment-name-n-date-container">
                    <span className="comment-profile-name">{user.name}</span>
                    <span className="comment-date">{date}</span>
                </div>
                <p className="comment-content">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default Comment;