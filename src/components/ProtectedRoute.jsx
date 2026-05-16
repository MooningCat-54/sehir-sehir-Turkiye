import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// components/ProtectedRoute.jsx
const ProtectedRoute = ({children}) => {
    // 'isloading' değil 'isLoading' olmalı!
    const { user, isLoading } = useAuth(); 

    if(isLoading) {
        return (
            <div className='protected-router-isloading' style={{textAlign:'center', padding:'50px'}}>
                <h2>Lütfen bekleyiniz, oturum doğrulanıyor...</h2>
            </div>
        );
    }
    
    if(!user) {
        return <Navigate to='/auth/login' replace />;
    }
    
    return children;
}

export default ProtectedRoute;