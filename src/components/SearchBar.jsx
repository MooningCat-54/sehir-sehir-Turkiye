import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState(""); 
    const [suggestion, setSugesstion] = useState([]);
    const navigate = useNavigate(); 

    const Locations = ["istanbul", "ankara", "izmir", "yalova", "kayseri", "gaziantep", "eskişehir", "adana"]; 

    const HandleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if(value.length > 1) {
            const filtered = Locations.filter(item => item.toLowerCase().includes(value.toLowerCase()));
            setSugesstion(filtered);
        } else {
            setSugesstion([]);
        }
    }

    // YENİ: onKeyDown yerine Form'un onSubmit özelliğini kullanıyoruz!
    const handleSearchSubmit = (e) => {
        // e.preventDefault() formlarda sayfanın yenilenmesini KESİN OLARAK durdurur.
        e.preventDefault(); 
        
        if (query.trim() !== "") {
            // DÜZELTME BURADA: Bizi '/' yerine doğrudan '/home' adresine yolla!
            navigate(`/home?search=${query.toLowerCase()}`);
        } else {
            navigate(`/home`); 
        }
        setSugesstion([]); 
    }

    const fillquery = (city) => {
        setQuery(city);
        setSugesstion([]);
        // DÜZELTME BURADA: Listeden seçince de doğrudan '/home' adresine yolla!
        navigate(`/home?search=${city.toLowerCase()}`);
    }

    return (
        // DİKKAT: div yerine form yaptık ve onSubmit ekledik
        <form className="searchbar-wrapper" onSubmit={handleSearchSubmit}> 
            <input
                className="searchbar-input-element"
                type="text"
                value={query}
                onChange={HandleInputChange}
                // onKeyDown'a artık gerek kalmadı, form onu bizim yerimize hallediyor
                placeholder="Nereyi Gezmek İstersiniz?"
            />
            {suggestion.length > 0 && (
                <ul className="searchbar-suggestion-list">
                    {suggestion.map((item, index) => (
                        <li className="searchbar-suggestion-element" key={index}  onClick={() => fillquery(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default SearchBar;