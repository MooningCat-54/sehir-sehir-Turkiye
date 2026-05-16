import React from "react";
import './css/LikeButton.css'; 

const DisLikeButton = ({ count, active, onClick }) => (
    <button className={`like-button ${active ? 'active' : ''}`} onClick={onClick}>
        <span>{active ? '👎' : '👎🏻'}</span>
        <b>{count}</b>
    </button>
);

export default DisLikeButton;