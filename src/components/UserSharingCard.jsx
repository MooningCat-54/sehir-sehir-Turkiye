import React from 'react';
import LikeButton from './LikeButton';
import DisLikeButton from './DisLikeButton';
import ShareButton from './ShareButton';
import SaveButton from './SaveButton';
import CommentArea from './CommentArea';
import './css/UserSharingCard.css';

const UserSharingCard = ({ sharingCard }) => {


    const data = sharingCard;

    return (
        <div className="usersharingcard-card-container">
            {data.image && (
                <div className="usersharingcard-image-container">
                    <img 
                        className="usersharingcard-image-element"
                        src={data.image} 
                        alt="Gezi Görseli"
                    />
                </div>
            )}

            <div className="usersharingcard-content-container">
                
                <div className="usersharingcard-profile-container">
                    <div className="usersharingcard-avatar-container">
                        <img 
                            className="usersharingcard-avatar-element"
                            src={data.user.avatar} 
                            alt={data.user.name} 
                        />
                        <span className="usersharingcard-name-container">
                            {data.user.name}
                        </span>
                    </div>
                    
                    <span className="usersharingcard-date-container">
                        📍 {data.location}
                    </span>
                </div>

                <p className="usersharingcard-text-content-container">
                    {data.content}
                </p>

                <div className="usersharingcard-engagement-buttons-container">
                    <LikeButton initialLikes={data.likes} />
                    <DisLikeButton initialDisLikes={data.disLikes}/>
                    <ShareButton />
                    <SaveButton />
                </div>
                <div className="usersharingcard-comment-container">
                    <CommentArea />
                </div>
            </div>
        </div>
    );
};

export default UserSharingCard;