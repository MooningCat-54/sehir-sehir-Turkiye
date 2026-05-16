import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminPlaceModal from './AdminPlaceModal';
import './css/AdminFAB.css';

const AdminFAB = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user || !user.isAdmin) return null;

    return (
        <>
            <button className="admin-fab" onClick={() => setIsOpen(true)}>
                <span>+</span>
            </button>

            {isOpen && <AdminPlaceModal onClose={() => setIsOpen(false)} />}
        </>
    );
};

export default AdminFAB;