import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/AuthContex";
import { useEffect } from "react";

const PrivateRoute = ({ roles }) => {
    const { user, fetchUser, loading, setLoading } = useAuth();

    useEffect(() => {
        if (!user) {

             async function fetchData() {
                 await fetchUser();
             }
             fetchData();
        }
    }, []);

    if  (!user && loading) return <div>Kontrol ediliyor...</div>;

    if (!user && !loading) return <Navigate to="/login" replace />;

    if (roles.length && !roles.includes(user.roles[0]?.name)) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
