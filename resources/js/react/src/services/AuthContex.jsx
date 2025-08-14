import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ErrorServices } from "./ErrorServices";
import api, { getConfig } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem("currentToken") || null
    );
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [miniCart, setMiniCart] = useState(false);
    const [openModal, setOpenModal] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Başta loading hep true
            setLoading(true);

            if (!accessToken) {
                // Token yok → API çağrısı yok → direkt loading bitir
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("api/me", getConfig(accessToken));
                setCurrentUser(res?.data?.user);

                const { data } = await api.get(
                    "api/me/cart",
                    getConfig(accessToken)
                );
                setCart(data);
            } catch (error) {
                console.log("Auth fetch error:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("currentToken");
                    setCurrentUser(null);
                    setAccessToken("");
                }
            } finally {
                setLoading(false); // sadece tüm işlemler bitince
            }
        };

        fetchData();
    }, [accessToken]);

    useEffect(() => {
        console.log(cart);
    }, [cart]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await api.get("api/cart");
                setCart(data);
            } catch (error) {
                console.log(error);
            }
        };
        if (accessToken == null) {
            fetchCart();
        }
    }, []);

    const errorShow = (err) => {
        const message = ErrorServices(err);
        //setError(message);
        toast.error(message);
    };

    const registerForm = async (data) => {
        return await api.post(`/api/register`, data);
    };

    const login = async (credentials) => {
        return await api.post("/api/login", credentials); // withCredentials zaten global ayarda var
    };

    //     try {
    //         const { data } = await getAuth();

    //         if (data.auth === true) {
    //             setUser(data.user);
    //             setHasUser(true);
    //         } else {
    //             setHasUser(false);
    //         }
    //     } catch (error) {
    //         console.error("auth kontrolü başarısız:", error);
    //         setHasUser(false);
    //     } finally {
    //         setLoading(false); // 🔐 Her durumda çalışır
    //     }
    // };

    const logout = async () => {
        return await api.post("/api/me/logout", {}, getConfig(accessToken));
    };

    return (
        <AuthContext.Provider
            value={{
                loading,
                setLoading,
                logout,
                errorShow,
                registerForm,
                login,
                accessToken,
                setAccessToken,
                currentUser,
                setCurrentUser,
                cart,
                setCart,
                miniCart,
                setMiniCart,
                openModal,
                setOpenModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
