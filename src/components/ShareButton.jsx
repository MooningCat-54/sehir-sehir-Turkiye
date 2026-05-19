import React from "react";
import './css/LikeButton.css';

// itemType parametresini ekledik (Varsayılan olarak 'POST' atadık)
const SharedButton = ({ postId, itemType = 'POST' }) => {

    const HandleShareButton = (id) => {
        let shareUrl = "";

        // Gelen tipe göre kopyalanacak url şablonunu dinamik olarak ekiyoruz
        if (itemType === 'OFFICIAL') {
            shareUrl = `${window.location.origin}/official/${id}`;
        } else {
            shareUrl = `${window.location.origin}/posts/${id}`; // Kullanıcı paylaşımları için eski düzen aynen korunuyor
        }

        navigator.clipboard.writeText(shareUrl)
            .then(() => alert("Bağlantı kopyalandı!"))
            .catch(err => console.error("Kopyalama hatası:", err));
    }

    return (
        <button
            // DÜZELTME: CSS'te birden fazla sınıf araya virgül konulmadan, boşlukla yazılır
            className="share-button like-button"
            onClick={(e) => {
                e.stopPropagation(); // Kart tıklama olayını (ContentCard'da) tetiklemesin diye koruma
                HandleShareButton(postId);
            }}
        >
            🏹
        </button>
    )
}

export default SharedButton;