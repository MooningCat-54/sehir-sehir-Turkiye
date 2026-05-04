// src/components/ContentCard.jsx
import React from "react";
import LikeButton from "./LikeButton";
import './css/ContentCard.css'

const ContentCard = ({ data }) => {
    // 1. Backend sunucu adresini tanımlıyoruz[cite: 5, 14]
    const baseUrl = "http://localhost:5000";

    return (
        <div className="card-box">
            {/* 2. SQL'den gelen MainImage kolonunu kullanıyoruz. 
               Eğer veri 'http' ile başlamıyorsa başına baseUrl ekliyoruz[cite: 4, 14, 21] */}
            <img className="card-image"
                src={data.MainImage?.startsWith('http') ? data.MainImage : `${baseUrl}${data.MainImage}`}
                alt={data.Title}
            />
            
            <div className="card-content-container">
                {/* 3. SQL kolon isimleri: Title ve Description */}
                <h3 className="card-title">{data.Title}</h3>
                <p className="card-text-content">{data.Description}</p>
                
                <div className="card-date-n-like-button-container">
                    {/* Beğeni sistemi bağlandığında data.Likes buraya gelecek[cite: 4] */}
                    <LikeButton initialLikes={data.Likes || 0}/>
                    
                    {/* 4. SQL'den gelen City veya LocationDetail bilgisi */}
                    <span className="card-date">📍 {data.City} / {data.LocationDetail}</span>
                </div>
            </div>
        </div>
    );
};

export default ContentCard;