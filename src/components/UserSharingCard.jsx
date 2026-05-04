import React from 'react';
import LikeButton from './LikeButton';
import DisLikeButton from './DisLikeButton';
import ShareButton from './ShareButton';
import SaveButton from './SaveButton';
import CommentArea from './CommentArea';
import './css/UserSharingCard.css';

const UserSharingCard = ({ sharingCard }) => {

    const baseUrl = "http://localhost:5000";

    const { 
        ImageUrl, 
        Caption, 
        City, 
        Username, 
        AvatarUrl, 
        CreatedAt 
    } = sharingCard;

    const displayAvatar = AvatarUrl ? `${baseUrl}${AvatarUrl}` : `https://ui-avatars.com/api/?name=${Username}&background=random&color=fff`;

    return (
        <div className="usersharingcard-card-container">
            {ImageUrl && (
                <div className="usersharingcard-image-container">
                    <img 
                        className="usersharingcard-image-element"
                        src={`${baseUrl}${ImageUrl}`} // Tam URL oluşturuyoruz[cite: 14]
                        alt="Gezi Görseli"
                    />
                </div>
            )}

            <div className="usersharingcard-content-container">
                <div className="usersharingcard-profile-container">
                    <div className="usersharingcard-avatar-container">
                        <img 
                            className="usersharingcard-avatar-element"
                            src={displayAvatar} 
                            alt={Username} 
                        />
                        <span className="usersharingcard-name-container">
                            {Username} {/* SQL'den gelen Username[cite: 2] */}
                        </span>
                    </div>
                    
                    <span className="usersharingcard-date-container">
                        📍 {City} {/* SQL'den gelen City[cite: 4] */}
                    </span>
                </div>

                <p className="usersharingcard-text-content-container">
                    {Caption} {/* SQL'den gelen Caption[cite: 2] */}
                </p>

                <div className="usersharingcard-engagement-buttons-container">
                    {/* Beğeni sayılarını da SQL'e eklediğinde buraya bağlayabiliriz */}
                    <LikeButton initialLikes={0} /> 
                    <DisLikeButton initialDisLikes={0}/>
                    <ShareButton />
                    <SaveButton />
                </div>
                
                <div className="usersharingcard-comment-container">
                    {/* CommentArea'ya hangi posta yorum yapıldığını bildirmek için Id gönderiyoruz */}
                    <CommentArea postId={sharingCard.Id} /> 
                </div>
            </div>
        </div>
    );
};

export default UserSharingCard;