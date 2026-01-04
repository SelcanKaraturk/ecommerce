import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContex";
import { useEffect } from "react";
import Loading from "../layouts/GeneralComponents/Loading";
import { styled } from "@mui/material";

const PrivateRoute = ({ roles }) => {
    const { loading, accessToken } = useAuth();
    if (loading) return <Loading />;
    if (!accessToken) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;
