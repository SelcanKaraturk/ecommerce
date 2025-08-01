import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContex";
import { useEffect } from "react";

const PrivateRoute = ({ roles }) => {
    const { loading, setLoading, accessToken, errorShow } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
            const error = { response: {data:'',status:401} };
            errorShow(error);
        }
    }, [accessToken]);

    return <Outlet />;
    // if (roles.length && !roles.includes(user.roles[0]?.name)) {
    //     return <Navigate to="/login" replace />;
    // }
};

export default PrivateRoute;
