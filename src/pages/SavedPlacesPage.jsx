import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentCard from '../components/ContentCard'; 
import UserSharingCard from '../components/UserSharingCard'; 
import styles from './css/SavedPlacesPage.module.css';

const SavedPlacesPage = () => {
    const { username } = useParams();
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('official');

    useEffect(() => {
        const fetchSavedPlaces = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/posts/saved/${username}`);
                const data = await response.json();
                if (data.success) {
                    setSavedItems(data.posts); 
                }
            } 
            
            catch (error) {
                console.error("Kaydedilenler yüklenirken hata:", error);
            } 
            
            finally {
                setLoading(false);
            }
        };

        fetchSavedPlaces();
    }, [username]);

    const officialSaved = savedItems.filter(item => item.ItemType === 'OFFICIAL');
    const userPostsSaved = savedItems.filter(item => item.ItemType === 'POST');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{username} Tarafından Kaydedilenler</h1>
            <div className={styles.tabsContainer}>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'official' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('official')}
                >
                    📍 Resmi Rotalar ({officialSaved.length})
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'posts' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    📸 Gezgin Paylaşımları ({userPostsSaved.length})
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Yükleniyor...</div>
            ) : (
                <div className={styles.contentArea}>
                    {activeTab === 'official' ? (
                        <div className={styles.grid}>
                            {officialSaved.length > 0 ? (
                                officialSaved.map(item => (
                                    <ContentCard 
                                        key={`official-${item.Id}`} 
                                        data={item} 
                                        onUnsave={(deletedId) => setSavedItems(prev => prev.filter(i => !(i.Id === deletedId && i.ItemType === 'OFFICIAL')))}
                                    />
                                ))
                            ) : (
                                <p className={styles.emptyText}>Henüz bir resmi rota kaydetmediniz.</p>
                            )}
                        </div>
                    ) : (
                        <div className={styles.feedColumn}>
                            {userPostsSaved.length > 0 ? (
                                userPostsSaved.map(item => (
                                    <UserSharingCard 
                                        key={`userpost-${item.Id}`} 
                                        data={item} 
                                        onUnsave={(deletedId) => setSavedItems(prev => prev.filter(i => !(i.Id === deletedId && i.ItemType === 'POST')))}
                                    />
                                ))
                            ) : (
                                <p className={styles.emptyText}>Henüz bir kullanıcı paylaşımı kaydetmediniz.</p>
                            )}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default SavedPlacesPage;