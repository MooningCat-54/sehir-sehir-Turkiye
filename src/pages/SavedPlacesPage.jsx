import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentCard from '../components/ContentCard'; // Mevcut kart bileşenin
import styles from './css/SavedPlacesPage.module.css';

const SavedPlacesPage = () => {
    const { username } = useParams();
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedPlaces = async () => {
            try {
                // Backend'de henüz bu endpoint yoksa birazdan ekleyeceğiz
                const response = await fetch(`http://localhost:5000/api/posts/saved/${username}`);
                const data = await response.json();
                if (data.success) {
                    setSavedItems(data.posts);
                }
            } catch (error) {
                console.error("Kaydedilenler yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPlaces();
    }, [username]);

    return (
        <div className={styles.container}>
            <h1>{username} tarafından kaydedilenler</h1>
            {loading ? (
                <p>Yükleniyor...</p>
            ) : savedItems.length > 0 ? (
                <div className={styles.grid}>
                    {savedItems.map(item => (
                        <ContentCard key={item.Id} data={item} />
                    ))}
                </div>
            ) : (
                <p>Henüz hiçbir yer kaydetmediniz.</p>
            )}
        </div>
    );
};

export default SavedPlacesPage;