import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const ProtectedRoute = ({children}) => {

    const {user, isloading} = useAuth();

    if(isloading) {
        return (
            <div className='protected-router-isloading'>
                <h2>lütfen bekleyiniz</h2>
            </div>
        );
    }
    if(!user) {
        return <Navigate to='/auth/login' replace />;
    }
    return children;
}

export default ProtectedRoute;