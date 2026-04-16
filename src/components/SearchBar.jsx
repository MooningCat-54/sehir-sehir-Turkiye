import React, {useState} from "react";
import './css/SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState(""); //usestateler boş DB geldiğinde dolacak
    const [suggestion, setSugesstion] = useState([]);

    const Locations = ["istanbul", "ankara", "izmir", "yalova", "kayseri", "gaziantep", "eskişehir"]; //burası deneme amaçlı DB geldiğinde silinicek

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

    const fillquery = (city) => {
        setQuery(city);
        setSugesstion([]);
    }

    return (
        <div className="searchbar-wrapper"> 
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
        </div>
    );

};

export default SearchBar;