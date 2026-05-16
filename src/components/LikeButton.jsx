import React from "react";
import './css/LikeButton.css';

// Artık state tutmuyoruz, her şeyi prop olarak Card'dan alıyoruz
const LikeButton = ({ count, active, onClick }) => (
    <button className={`like-button ${active ? 'active' : ''}`} onClick={onClick}>
        <span>{active ? '👍' : '👍🏻'}</span>
        <b>{count}</b>
    </button>
);

export default LikeButton;