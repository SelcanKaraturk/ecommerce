import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContex";
import { useEffect } from "react";

const PrivateRoute = ({ roles }) => {
    const { user, fetchUser, loading, setLoading, accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
        }


    }, [accessToken]);

    return <Outlet />;
    // if (roles.length && !roles.includes(user.roles[0]?.name)) {
    //     return <Navigate to="/login" replace />;
    // }
};

export default PrivateRoute;
