import React from 'react';
import './css/Profile.css';
import GalleryArea from '../components/GalleryArea';
import { useAuth } from '../context/AuthContext';

const Profile = () => {

    const { user } = useAuth();

    // 3. Sayfa yenilenme süresi
    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Yükleniyor...</div>;
    }

    const userProfile = {
        username: user.username, // db den gelen data
        fullName: user.name,    
        
        avatar: `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&size=128`, 
        
        // mock data
        bio: "Biyografini ekle",
        stats: { posts: 12, saved: 150 }
    };
    // gallery componenty için
    const userPosts = [
        { id: 1, image: "https://picsum.photos/id/1021/800/800" },
        { id: 2, image: "https://picsum.photos/id/1021/800/800" },
        { id: 3, image: "https://picsum.photos/id/1021/800/800" },
        { id: 4, image: "https://picsum.photos/id/1021/800/800" },
        { id: 5, image: "https://picsum.photos/id/1021/800/800" },
        { id: 6, image: "https://picsum.photos/id/1021/800/800" },
        { id: 7, image: "https://picsum.photos/id/1021/800/800" },
        { id: 8, image: "https://picsum.photos/id/1021/800/800" },
        { id: 9, image: "https://picsum.photos/id/1021/800/800" }

    ];

    return (
        <div className="profile-page">
            
            <header className="profile-header">
                
                <div className="profile-avatar-container">
                    <img src={userProfile.avatar} alt={`${userProfile.username} avatar`} className="profile-avatar" />
                </div>

                <div className="profile-info">
                    <div className="profile-title-row">
                        <h2 className="profile-username">{userProfile.username}</h2>
                        <button className="edit-profile-btn">Profili Düzenle</button>
                    </div>

                    <div className="profile-stats">
                        <div><span>{userProfile.stats.posts}</span> gönderi</div>
                        <div style={{ cursor: 'pointer' }}><span>{userProfile.stats.saved}</span> kaydedilen</div>
                    </div>

                    <div className="profile-bio">
                        <div className="profile-fullname">{userProfile.fullName}</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{userProfile.bio}</div>
                    </div>
                </div>
            </header>

            <div className="profile-divider"></div>

            <div className="profile-gallery-container">
                <GalleryArea images={userPosts} />
            </div>

        </div>
    );
};

export default Profile;