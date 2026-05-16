import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GalleryArea from '../components/GalleryArea';
import UserSharingCard from '../components/UserSharingCard'; // Yeni ekledik
import { useAuth } from '../context/AuthContext';
import './css/Profile.css';

const Profile = () => {
    const { username } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const baseUrl = "http://localhost:5000";
    const defaultAvatar = `${baseUrl}/uploads/avatars/default_avatar.png`;

    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState([]); 
    const [loading, setLoading] = useState(true);
    // 1. Sekme yönetimi için state
    const [activeTab, setActiveTab] = useState('posts'); 

    useEffect(() => {
        const fetchProfileAndPosts = async () => {
            setLoading(true);
            try {
                const profileRes = await fetch(`${baseUrl}/api/auth/profile/${username}`);
                const profileJson = await profileRes.json();
                if (profileJson.success) setProfileData(profileJson.profile);

                const postsRes = await fetch(`${baseUrl}/api/posts/user/${username}`);
                const postsJson = await postsRes.json();

                if (postsJson.success) {
                    // 2. Verileri ham haliyle saklıyoruz ki UserSharingCard içinde kullanabilelim
                    setUserPosts(postsJson.posts);
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
        : `${defaultAvatar}`;

    // 3. Galeri sekmesi için sadece resimli olanları filtreleyip GalleryArea formatına sokuyoruz
    const galleryImages = userPosts
        .filter(post => post.ImageUrl)
        .map(post => ({
            id: post.Id,
            image: `${baseUrl}${post.ImageUrl}`
        }));

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

            {/* 4. Sekme Butonları */}
            <div className="profile-tabs-container">
                <button 
                    className={`profile-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    📝 Paylaşımlar
                </button>
                <button 
                    className={`profile-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    🖼️ Galeri
                </button>
            </div>

            <div className="profile-content-display">
                {activeTab === 'posts' ? (
                    // SEKME 1: Tüm Postlar (Resimli veya Resimsiz)
                    <div className="profile-posts-stream">
                        {userPosts.length > 0 ? (
                            userPosts.map(post => (
                                <UserSharingCard key={post.Id} sharingCard={post} />
                            ))
                        ) : (
                            <div className="empty-state">Henüz bir paylaşım yok.</div>
                        )}
                    </div>
                ) : (
                    // SEKME 2: Sadece Galeri (Sadece resimli olanlar)
                    <div className="profile-gallery-wrapper">
                        {galleryImages.length > 0 ? (
                            <GalleryArea images={galleryImages} />
                        ) : (
                            <div className="empty-state">Henüz hiç fotoğraf paylaşılmamış.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;