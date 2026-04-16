import React, {useState} from "react";
import './css/LikeButton.css'

const SharedButton = () => {

    const HandleShareButton = () => {

    }

    return (
        <button
            className="share-button, like-button"
            onClick={HandleShareButton}
        >
            🏹
        </button>
    )
}

export default SharedButton;