import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ContentCard from './ContentCard';
import './css/RandomSuggestion.css';

const RandomSuggestionButton = () => {
    const { user } = useAuth();
    const baseUrl = "http://localhost:5000";
    const [randomPlace, setRandomPlace] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRandomClick = async () => {
        setLoading(true);
        try {
            const randomId = Math.floor(Math.random() * 30) + 10;
            const userIdParam = user?.userId || user?.UserId || 0;
            const res = await fetch(`${baseUrl}/api/posts/official/detail/${randomId}?userId=${userIdParam}`);
            const data = await res.json();

            if (data.success) {
                setRandomPlace(data.place);
                setIsModalOpen(true);
            } 
            else {
                alert("Rota seçilirken bir uyuşmazlık oldu, lütfen tekrar deneyin!");
            }
        } 
        catch (err) {
            console.error("Rastgele rota getirme hatası:", err);
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="random-suggestion-button"
                onClick={handleRandomClick}
                disabled={loading}
                title="Rastgele bir rota öner!"
                onMouseOver={(e) => e.target.style.backgroundColor = '#1917f1'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#166fe5'}
            >
                {loading ? "Şansın aranıyor..." : "Rastgele Rota Öner"}
            </button>

            {isModalOpen && randomPlace && (
                <div className="random-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="random-modal-content" onClick={(e) => e.stopPropagation()}>
                        
                        <button className="random-modal-close-btn" onClick={() => setIsModalOpen(false)}>
                            ✕
                        </button>
                        
                        <div className="random-modal-header">
                            <h2>✨ Bugünün Şanslı Rotası!</h2>
                            <p>Sistem senin için harika bir yer seçti.</p>
                        </div>

                        <ContentCard data={randomPlace} />

                        <button className="random-modal-retry-btn" onClick={handleRandomClick}>
                            🔄 Başka Bir Yer Öner
                        </button>

                    </div>
                </div>
            )}
        </>
    );
};

export default RandomSuggestionButton;