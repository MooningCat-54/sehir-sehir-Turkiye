import React from 'react';
import './css/Comment.css'

const Comment = ({ user, text, date }) => {
    return (
        <div className="comment-container">
            <img className="comment-avatar"
                src={user.avatar} 
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