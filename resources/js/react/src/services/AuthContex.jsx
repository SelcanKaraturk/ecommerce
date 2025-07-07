import { createContext, useContext, useEffect, useState } from "react";
import { getUser, logout as apiLogout } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchUser = async () => {
        //debugger;

        try {
            const { data } = await getUser();
            //console.log(data);
            setUser(data);

        } catch (err) {
            console.log(err)
            setUser(null);
        } finally {
            setLoading(false);
        }
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
        await apiLogout();
        setUser(null);

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                fetchUser,
                loading,
                setLoading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
