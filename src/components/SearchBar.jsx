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
        } 
        else {
            setSugesstion([]);
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        
        if (query.trim() !== "") {
            navigate(`/home?search=${query.toLowerCase()}`);
        } 
        else {
            navigate(`/home`); 
        }
        setSugesstion([]); 
    }

    const fillquery = (city) => {
        setQuery(city);
        setSugesstion([]);
        navigate(`/home?search=${city.toLowerCase()}`);
    }

    return (
        <form className="searchbar-wrapper" onSubmit={handleSearchSubmit}> 
            <input
                className="searchbar-input-element"
                type="text"
                value={query}
                onChange={HandleInputChange}
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