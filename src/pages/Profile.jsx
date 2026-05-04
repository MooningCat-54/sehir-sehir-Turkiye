// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GalleryArea from '../components/GalleryArea';
import { useAuth } from '../context/AuthContext';
import './css/Profile.css';

const Profile = () => {
    const { username } = useParams(); // URL'den hangi profile bakıldığını al
    const { user } = useAuth(); // Giriş yapan kullanıcı bilgisi[cite: 16]
    const navigate = useNavigate();
    const baseUrl = "http://localhost:5000";

    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState([]); // Mock resimler yerine boş state[cite: 14]
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileAndPosts = async () => {
            setLoading(true);
            try {
                // 1. Profil Bilgilerini Çek (Bio, FullName, Avatar)[cite: 2, 14]
                const profileRes = await fetch(`${baseUrl}/api/auth/profile/${username}`);
                const profileJson = await profileRes.json();

                if (profileJson.success) {
                    setProfileData(profileJson.profile);
                }

                // 2. Kullanıcının Kendi Paylaşımlarını Çek
                // Backend'de "/api/posts/user/:username" şeklinde bir route olduğunu varsayıyoruz
                const postsRes = await fetch(`${baseUrl}/api/posts/user/${username}`);
                const postsJson = await postsRes.json();

                if (postsJson.success) {
                    // SQL'den gelen ImageUrl'leri başına baseUrl ekleyerek map'liyoruz
                    const formattedPosts = postsJson.posts.map(post => ({
                        id: post.Id,
                        image: `${baseUrl}${post.ImageUrl}`
                    }));
                    setUserPosts(formattedPosts);
                }
            } catch (error) {
                console.error("Profil verileri çekilemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndPosts();
    }, [username]);

    if (loading) return <div className="loading">Yükleniyor...</div>;
    if (!profileData) return <div className="error">Kullanıcı bulunamadı!</div>;

    const isOwnProfile = user && user.username === profileData.Username;
    const displayAvatar = profileData.AvatarUrl 
        ? `${baseUrl}${profileData.AvatarUrl}` 
        : `https://ui-avatars.com/api/?name=${profileData.FullName}&background=random&color=fff&size=128`;

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="profile-avatar-container">
                    <img src={displayAvatar} alt="Profil" className="profile-avatar" />
                </div>

                <div className="profile-info">
                    <div className="profile-title-row">
                        <h2 className="profile-username">{profileData.Username}</h2>
                        {isOwnProfile && (
                            <button className="edit-profile-btn" onClick={() => navigate(`/${profileData.Username}/profile/edit`)}>
                                Profili Düzenle
                            </button>
                        )}
                    </div>

                    <div className="profile-stats">
                        <div><span>{userPosts.length}</span> gönderi</div>
                        {/* İleride 'Saved' tablosu bağlandığında burası da dinamikleşecek */}
                        <div><span>0</span> kaydedilen</div>
                    </div>

                    <div className="profile-bio">
                        <div className="profile-fullname">{profileData.FullName}</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {profileData.Bio || "Henüz bir biyografi eklenmemiş."}
                        </div>
                    </div>
                </div>
            </header>

            <div className="profile-divider"></div>

            <div className="profile-gallery-container">
                {/* 3. Gerçek postları GalleryArea'ya gönderiyoruz[cite: 14, 24] */}
                <GalleryArea images={userPosts} />
            </div>
        </div>
    );
};

export default Profile;