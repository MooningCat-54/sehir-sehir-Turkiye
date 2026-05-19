import React from "react";
import './css/LikeButton.css';

const SharedButton = ({ postId, itemType = 'POST' }) => {

    const HandleShareButton = (id) => {
        let shareUrl = "";

        if (itemType === 'OFFICIAL') {
            shareUrl = `${window.location.origin}/official/${id}`;
        } 
        else {
            shareUrl = `${window.location.origin}/posts/${id}`;
        }

        navigator.clipboard.writeText(shareUrl)
            .then(() => alert("Bağlantı kopyalandı!"))
            .catch(err => console.error("Kopyalama hatası:", err));
    }

    return (
        <button
            className="share-button like-button"
            onClick={(e) => {
                e.stopPropagation();
                HandleShareButton(postId);
            }}
        >
            🔗
        </button>
    )
}

export default SharedButton;