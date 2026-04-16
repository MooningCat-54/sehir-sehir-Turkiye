import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProfileButton from './ProfileButton';
import RandomSuggestionButton from './RandomSuggestion';
import './css/NavBar.css'



const NavBar = ({allLocations}) => {

    const navigate = useNavigate();

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
                <ProfileButton/>
            </div>
        </nav>
    );
};

export default NavBar;