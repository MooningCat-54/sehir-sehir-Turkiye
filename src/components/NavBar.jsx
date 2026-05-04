import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProfileButton from './ProfileButton';
import RandomSuggestionButton from './RandomSuggestion';
import { useAuth } from '../context/AuthContext';
import './css/NavBar.css'
import AuthButton from './AuthButton';



const NavBar = ({allLocations = []}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const {user, isLoading} = useAuth();

    if(location.pathname.startsWith('/auth')) {
        return(null);
    }

   

    return (
        <nav>
            <div className="logo-area" onClick={() => navigate('/')}>
                Şehir Şehir Türkiye
            </div>

            <div className="center-area">
                <SearchBar />
                {/* 3. Rastgele öneri artık veritabanındaki gerçek yerleri kullanıyor */}
                <RandomSuggestionButton locations={allLocations} />
            </div>

            <div className="rigth-area">  
                {isLoading ? (
                    <span>Yükleniyor...</span>
                ) : user ? (
                    <ProfileButton />
                ) : (
                    <AuthButton />
                )
                }
            </div>
        </nav>
    );
};

export default NavBar;