import React from "react";
import LikeButton from "./LikeButton";
import './css/ContentCard.css'

const ContentCard = ({data}) => {
    return (
        <div className="card-box">
            <img className="card-image"
                src = {data.image}
                alt = {data.title}
            />
            <div className="card-content-container">
                <h3 className="card-title">{data.title}</h3>
                <p className="card-text-content">{data.description}</p>
                <div className="card-date-n-like-button-container">
                    <LikeButton initialLikes={data.likes}/>
                    <span className="card-date">{data.location}</span>
                </div>
            </div>
        </div>
    );
};

export default ContentCard;