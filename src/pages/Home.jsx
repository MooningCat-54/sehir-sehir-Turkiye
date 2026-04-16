import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import CategoryBar from '../components/CategoryBar';
import ContentCard from '../components/ContentCard';
import UserSharingCard from '../components/UserSharingCard';
import './css/Home.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('official');

    const navigate = useNavigate();

    const resmiRotalar = [
        { id: 1, title: "isim", image: "https://picsum.photos/id/1015/800/600", likes: 150, location: "yer" },
    ];

    const kullaniciPaylasimlari = [
        { id: 101, user: { name: "kullanıcı1", avatar: "zzz" }, content: "blablabla balablabl bla bla", image: "https://picsum.photos/id/1020/800/600", likes: 85, location: "yer" },
    ];

    //giriş/kayıt buttonu kaldırılıp component olacak

    return (
        <div className="home-main-inclusive">
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px 20px' }}>
                <button 
                    onClick={() => navigate('/auth/login')} // Tıklanınca /auth adresine git
                    style={{
                        padding: '10px 20px', 
                        backgroundColor: '#1877f2', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    🚪 Giriş / Kayıt Sayfasına Git
                </button>
            </div>


            <div className="home-dividing-line">
                <CategoryBar />
            </div>

            <div className="home-tabs">
                <button className="home-content-button"
                    onClick={() => setActiveTab('official')}
                    style={{
                        fontSize: '1rem', color: activeTab === 'official' ? '#1877f2' : '#666',
                        fontWeight: activeTab === 'official' ? 'bold' : '500',
                        borderBottom: activeTab === 'official' ? '3px solid #1877f2' : '3px solid transparent',
                    }}
                >
                    Öne Çıkan Rotalar
                </button>
                <button className="home-content-button"
                    onClick={() => setActiveTab('socialFeed')}
                    style={{
                        fontSize: '1rem', color: activeTab === 'socialFeed' ? '#1877f2' : '#666',
                        fontWeight: activeTab === 'socialFeed' ? 'bold' : '500',
                        borderBottom: activeTab === 'socialFeed' ? '3px solid #1877f2' : '3px solid transparent',
                    }}
                >
                    Gezgin Paylaşımları
                </button>
            </div>

            <div className="home-grid-area">
                
                {activeTab === 'official' ? (
                    <div className="home-on-site-content-grid">
                        {resmiRotalar.map(rota => (
                            <ContentCard key={rota.id} data={rota} /> // mock data verisi data prop'uyla gidiyor
                        ))}
                    </div>
                ) : (
                    <div className="home-sharing-content-grid">
                        {kullaniciPaylasimlari.map(post => (
                            <UserSharingCard key={post.id} sharingCard={post} /> //aynı şekilde mock data için 
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
};

export default Home;