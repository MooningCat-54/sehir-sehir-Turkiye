//home.jsx
import React, {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom'
import CategoryBar from '../components/CategoryBar';
import ContentCard from '../components/ContentCard';
import UserSharingCard from '../components/UserSharingCard';
import AuthButton from '../components/AuthButton';
import CreatePostModal from '../components/CreatePostModal';
import { useAuth } from '../context/AuthContext';
import './css/Home.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('official');
    const [resmiRotalar, setResmiRotalar] = useState([]); // 2. Boş state olarak başlat[cite: 13]
    const [kullaniciPaylasimlari, setKullaniciPaylasimlari] = useState([]); // 3. Boş state olarak başlat[cite: 13]
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const [searchParams] = useSearchParams();
    const searchCity = searchParams.get('search') || "";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Backend'deki yeni route'larımızı çağırıyoruz
                const [officialRes, socialRes] = await Promise.all([
                    fetch('http://localhost:5000/api/posts/official'),
                    fetch('http://localhost:5000/api/posts/all')
                ]);

                const officialData = await officialRes.json();
                const socialData = await socialRes.json();

                if (officialData.success) setResmiRotalar(officialData.places);
                if (socialData.success) setKullaniciPaylasimlari(socialData.posts);
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleCategoryToggle = (categoryName) => {
        // Eğer tıklanan buton "Hepsi" ise, seçili kategorileri tamamen temizle!
        if (categoryName === 'Hepsi') {
            setSelectedCategories([]); 
            return; // Fonksiyonu burada bitir
        }

        // Değilse normal ekleme/çıkarma (Toggle) işlemine devam et
        setSelectedCategories((prevSelected) => {
            if(prevSelected.includes(categoryName)) {
                return prevSelected.filter((cat) => cat !== categoryName);
            } 
            else {
                return [...prevSelected, categoryName];
            }
        });
    };

    //filtreleme algoritması

    // FİLTRELEME MANTIĞI: ÇİFT SÜZGEÇ (Türkçe Karakter Uyumlu)
    const filteredPlaces = resmiRotalar.filter(place => {
        // SQL'den Category kolonu string veya array olarak gelebilir, ona göre kontrol et
        const categoryMatch = selectedCategories.length === 0 || 
            (place.Category && selectedCategories.every(cat => place.Category.includes(cat)));

        const searchSafe = searchCity.toLocaleLowerCase('tr-TR');
        const cityMatch = searchCity === "" || 
            (place.City && place.City.toLocaleLowerCase('tr-TR').includes(searchSafe)) ||
            (place.LocationDetail && place.LocationDetail.toLocaleLowerCase('tr-TR').includes(searchSafe));

        return categoryMatch && cityMatch;
    });

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Veriler Yükleniyor...</div>;

    return (
        <div className="home-main-inclusive">

            <div className="home-dividing-line">
                <CategoryBar selectedCategories={selectedCategories} onSelectCategory={handleCategoryToggle} />
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

            {/* --- SEKMELERDEN SONRAKİ KISIM --- */}
            <div className="home-grid-area">
                {activeTab === 'official' ? (
                    <div className="home-on-site-content-grid">
                        {/* ... Official Rotalar döngüsü ... */}
                    </div>
                ) : (
                    <div className="home-sharing-content-layout">
                        <div className="feed-column">
                            {kullaniciPaylasimlari.map(post => (
                                <UserSharingCard key={post.Id} sharingCard={post} /> 
                            ))}
                        </div>

                        {/* 3. ADIM: Sidebar Sütununda kısıtlama mantığı */}
                        <div className="sidebar-column">
                            {user ? (
                                // Giriş yapılmışsa paylaşım paneli[cite: 16]
                                <div className="create-post-panel">
                                    <h3>Deneyimlerini Paylaş</h3>
                                    <p>Gezdiğin yerleri diğer gezginlerle paylaş!</p>
                                    <button className="create-post-btn" onClick={() => setIsModalOpen(true)}>
                                        ➕ Yeni Paylaşım Oluştur
                                    </button>
                                </div>
                            ) : (
                                // Giriş yapılmamışsa giriş yap butonu[cite: 11]
                                <div className="create-post-panel login-prompt-panel">
                                    <h3>Keşfetmeye Hazır mısın?</h3>
                                    <p>Paylaşım yapmak için topluluğumuza katıl.</p>
                                    <button 
                                        className="create-post-btn" 
                                        onClick={() => navigate('/auth/login')}
                                    >
                                        🔑 Giriş Yap / Kayıt Ol
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
            </div>

            <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        </div>
    );
};

export default Home;