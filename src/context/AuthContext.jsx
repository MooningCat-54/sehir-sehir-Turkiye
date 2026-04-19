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
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem('name');

        if(token && storedName) {
            setUser({name: storedName});
        }

        setIsLoading(false);
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

    const login = async (email, password) => {
        console.log('adım 1 login fonksiyonu çalıştı data:', email, password);
        try {
            console.log('adım 2 backende veriler gönderiliyor')
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            console.log('adım 3 backendin cevabı bekleniyor')
            const data = await response.json();

            console.log(data);

            if (response.ok) {
                console.log('giriş başarılı data', data);

                localStorage.setItem('token', data.token);
                localStorage.setItem('name', data.name);

                setUser({name: data.name, username: data.username, email: data.email});

                return true;
            }
            else {
                console.log(data);
                alert(data.error || data.message);
                return false;
            }
        }
        catch(error) {
            console.error("giriş hatası:", error);
            alert("sunucuya ulaşılamıyor");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');

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