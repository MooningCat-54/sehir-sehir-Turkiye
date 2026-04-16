import React, {useState} from "react";
import './css/LikeButton.css'

const SaveButton = () => {

    const HandleSaveButton = () => {

    }

    return (
        <button
            className="save-button, like-button"
            onClick={HandleSaveButton}
        >
            💾
        </button>
    )
}

export default SaveButton;