import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(); //bu yapı sayesinde diğer compoentler/sayfalar iletişime geçebilecek

/*
    bu altındaki yani childlara veri leri göndericek, sarmalıcı yapı.
    use effect reacta özgü bir fonskiyoon türü yada öyle birşey, ikinci propsu array yaptığımızda en sonda onu belirtiriz.
    ve yaptığı şey ise sardece f5 atıldığında kodu birkere çalıştır içindeki kodda yani tek sefer çalışan kod ise localstorage bakıp 
    giriş varmı yok mu onu kontrol ediyor sonrasında ise username değişkenini state yardımı ile kaydediyor
*/
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            const storedName = localStorage.getItem('name');
            const storedUserName = localStorage.getItem('username');

            if(token && storedName) {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/verify', {
                        method: 'GET',
                        headers: {'Authorization': `Bearer ${token}`}
                    });
                    if(response.ok) {
                        setUser({
                            name: storedName,
                            username: storedUserName,
                            token: token
                        });
                    }
                    else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('name');
                        localStorage.removeItem('username');
                        setUser(null);
                    }
                }
                catch(error) {
                    setUser(null);
                }
            }

            setIsLoading(false);
        };

        checkAuthStatus();

    }, []);


    const register = async (name, username, email, password) => {
        console.log("adım 1 register fonksiyonu çalıştı data:", name, username, email, password);
        try {
            console.log("adım 2 veriler gönderiliyor data:", name, username, email, password);

            //verileri backende iletiyor
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, username, email, password}) 
            });

            console.log("adım 3 veriler gönderildi yanıt bekleniyor data", name, username, email, password);

            //backendin cevabı bekleniyor
            const data = await response.json();

            console.log("adım 4 yanıt geldi data", name, username, email, password);

            if(response.ok) {
                return true;
            }
            else {
                alert(data.error || data.message);
                return false;
            }
        }
        catch(error) {
            console.error("kayıt hatası:", error);
            alert('sunucu yok');
            return false;
        }

    }

    // src/context/AuthContext.jsx içindeki login fonksiyonu
    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            const data = await response.json();

            if (response.ok) {
                // 1. Backend'den gelen tüm önemli verileri localStorage'a yazıyoruz[cite: 16]
                localStorage.setItem('token', data.token);
                localStorage.setItem('name', data.name);
                localStorage.setItem('username', data.username);
                
                // 2. State içine sadece isim değil, avatar bilgisini de ekliyoruz
                // Bu sayede giriş yapınca NavBar'daki resim anında güncellenir.
                setUser({
                    name: data.name, 
                    username: data.username, 
                    email: data.email,
                    avatarUrl: data.avatarUrl // Backend login cevabına bunu ekledik[cite: 2]
                });

                return true;
            } else {
                alert(data.message || "Giriş başarısız.");
                return false;
            }
        } catch(error) {
            console.error("Giriş hatası:", error);
            alert("Sunucuya ulaşılamıyor.");
            return false;
        }
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('username');

        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, isLoading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    return useContext(AuthContext);
};