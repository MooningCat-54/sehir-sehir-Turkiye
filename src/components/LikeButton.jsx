import React, {useState} from "react";
import './css/LikeButton.css'

const LikeButton = ({initialLikes = 0}) => {

    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);

    const HandleLike = () => {
        if(!isLiked) {
            setLikes(likes + 1)
        }
        else {
            setLikes(likes - 1);
        }
        setIsLiked(!isLiked);
    }
    return (
        <button
            className="like-button"
            onClick={HandleLike}
            style={{
                backgroundColor: isLiked ? '#e7f3ff' : 'white', 
                color: isLiked ? '#1877f2' : '#65676b',     
            }}
        >
            <span style={{ fontSize: '1.2rem' }}>
                {isLiked ? '👍' : '👍🏻'}
            </span>
            
            <span style={{ fontWeight: 'bold' }}>
                {likes}
            </span>
        </button>
    );
};

export default LikeButton;