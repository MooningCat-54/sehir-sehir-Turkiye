import React, {useState} from "react";
import './css/LikeButton.css'

const DisLikeButton = ({initialDisLikes = 0}) => {

    const [disLikes, setDisLikes] = useState(initialDisLikes);
    const [isDisLiked, setIsDisLiked] = useState(false);

    const HandleDisLike = () => {
        if(!isDisLiked) {
            setDisLikes(disLikes + 1)
        }
        else {
            setDisLikes(disLikes - 1);
        }
        setIsDisLiked(!isDisLiked);
    }
    return (
        <button
            className="like-button"
            onClick={HandleDisLike}
            style={{
                backgroundColor: isDisLiked ? '#ed4c8a' : 'white', 
                color: isDisLiked ? '#2b1f24' : '#65676b',     
            }}
        >
            <span style={{ fontSize: '1.2rem' }}>
                {isDisLiked ? '👎' : '👎🏻'}
            </span>

            <span style={{ fontWeight: 'bold' }}>
                {disLikes}
            </span>
        </button>
    );
};

export default DisLikeButton;