import { createContext, useContext, useEffect, useState } from "react";
import { getUser, logout as apiLogout } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import { ErrorServices } from "./ErrorServices";
import api, { getConfig } from "./api";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(()=>localStorage.getItem('currentToken'));
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentlyLoggedInUser = async() => {
            try {
                        const res = await api.get('api/me', getConfig(accessToken));
                        setCurrentUser(res?.data?.user);
                        console.log(res?.data?.user);
                    } catch (error) {
                        console.log(error);
                        if(error.response.status === 401){
                            localStorage.removeItem('currentToken');
                            setCurrentUser(null);
                            setAccessToken('');
                        }

                    }
        }
        if(accessToken != null) fetchCurrentlyLoggedInUser();
    }, [accessToken]);


    const errorShow = (err) => {
        const message = ErrorServices(err);
        //setError(message);
        toast.error(message);
    };

    const registerForm = async (data) => {
        return await api.post(`/api/register`, data);
    };

    const login = async (credentials) => {
        //const deneme = await getCsrfCookie();
        //console.log(deneme);
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
       return await api.post('/api/me/logout', {}, getConfig(accessToken));
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
                setCurrentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
