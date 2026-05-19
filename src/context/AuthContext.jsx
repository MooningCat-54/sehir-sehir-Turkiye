import { createContext, useState, useEffect, useContext } from "react";
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            const storedUserId = localStorage.getItem('userId');

            if (token && storedUserId) {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/verify', {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const data = await response.json(); 

                    if (response.ok && data.success) {
                        setUser({
                            userId: data.userId,
                            username: data.username,
                            isAdmin: data.isAdmin === true || data.isAdmin === 1 || data.isAdmin === 'true',
                            token: token
                        });
                    } 
                    else {
                        logout();
                    }
                } 
                catch (error) {
                    console.error("Verify Hatası:", error);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        checkAuthStatus();
    }, []);


    const register = async (name, username, email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, username, email, password}) 
            });
            const data = await response.json();

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
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('username', data.username);
                
                setUser({
                    userId: data.userId,
                    username: data.username,
                    isAdmin: data.isAdmin,
                    token: data.token
                });
                return true;
            } 
            else {
                alert(data.message || "Giriş başarısız.");
                return false;
            }
        } 
        catch (error) {
            console.error("Login Hatası:", error);
            alert("Sunucuya ulaşılamıyor. Lütfen backend'in çalıştığından emin ol!");
            return false;
        }
    };
        
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');

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