import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProfileButton from './ProfileButton';
import RandomSuggestionButton from './RandomSuggestion';
import { useAuth } from '../context/AuthContext';
import './css/NavBar.css'
import AuthButton from './AuthButton';



const NavBar = ({allLocations}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const {user, isloading} = useAuth();

    if(location.pathname.startsWith('/auth')) {
        return(null);
    }

    //mock dta
    const locationDeneme = [
        { 
            location: "Ankara", 
            user: { name: "kullanıcı1" } 
        },
        { 
            location: "İstanbul", 
            user: { name: "kullanıcı2" } 
        },
        { 
            location: "Eskişehir", 
            user: { name: "kullanıcı3" } 
        }
    ];

    return (
        <nav>
            <div className="logo-area" onClick={() => navigate('/')}>
                Şehir Şehir Türkiye
            </div>

            <div className="center-area">
                <SearchBar/>
                <RandomSuggestionButton locations={locationDeneme}/>
            </div>

            <div className="rigth-area">  
                {isloading ? (
                        <span>yükleniyor</span>
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