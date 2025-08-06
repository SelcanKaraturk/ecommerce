import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ErrorServices } from "./ErrorServices";
import api, { getConfig } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(() =>
        localStorage.getItem("currentToken")
    );
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [miniCart, setMiniCart] = useState(false);

    useEffect(() => {
        const fetchCurrentlyLoggedInUser = async () => {
            try {
                const res = await api.get("api/me", getConfig(accessToken));
                setCurrentUser(res?.data?.user);
                //console.log(res?.data?.user);
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    localStorage.removeItem("currentToken");
                    setCurrentUser(null);
                    setAccessToken("");
                }
            }
        };

        const fetchUserCart = async () => {
            try {
                const {data} = await api.get(
                    "api/me/cart",
                    getConfig(accessToken)
                );
                setCart(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (accessToken != null) {
            fetchCurrentlyLoggedInUser();
            fetchUserCart();
        }
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
