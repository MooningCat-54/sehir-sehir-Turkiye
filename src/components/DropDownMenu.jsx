import React, { useState, useEffect, useRef } from 'react';
import './css/DropDownMenu.css'; // Dosya yolunun doğruluğundan emin ol

const DropdownMenu = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="dropdownmenu-wrapper" ref={menuRef}>
            <button className="dropdownmenu-trigger-btn" onClick={() => setIsOpen(!isOpen)}>
                ⋮
            </button>
            {isOpen && (
                <div className="dropdownmenu-content-list">
                    {options.map((opt, index) => (
                        <button 
                            key={index} 
                            className={`dropdownmenu-item-btn ${opt.label === 'Sil' ? 'is-danger' : ''}`}
                            onClick={() => { opt.action(); setIsOpen(false); }}
                        >
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;