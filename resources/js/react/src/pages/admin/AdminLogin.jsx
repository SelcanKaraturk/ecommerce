import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../services/AuthContex";
import { toast } from "react-toastify";
import ValidateError from "../auth/ValidateError";
import { Box, TextField } from "@mui/material";
import Loading from "../../layouts/GeneralComponents/Loading";

ValidateError;
useAuth;
function AdminLogin() {
    const navigate = useNavigate();
    const [logging, setlogging] = useState(false);
    const [errors, setErrors] = useState(null);

    const {
        adminLogin,
        errorShow,
        setAccessToken,
        setCurrentUser,
        accessToken,
    } = useAuth();
    const [loginFormData, setloginFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (accessToken) {
            navigate("/admin");
        }
    }, [accessToken]);

    const loginFormSubmit = async (e) => {
        e.preventDefault();
        setlogging(true);
        try {
            const res = await adminLogin(loginFormData);
            if (res?.data?.error) {
                console.log(res.data);
                toast.error(res?.data?.error);
                setlogging(false);
            } else {
                localStorage.setItem("currentToken", res?.data?.currentToken);
                setAccessToken(res?.data?.currentToken);
                setCurrentUser(res.data.user);
                toast.success(res?.data?.message);
                setlogging(false);
                navigate("/admin");
            }
        } catch (error) {
            console.log(error);
            if (error?.response?.status !== 422) {
                errorShow(error);
            } else {
                setErrors(error.response.data.errors);
            }
            setlogging(false);
        }
    };

    const loginFormChange = (e) => {
        const { name, value } = e.target;
        setloginFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            {/* <!-- Begin Hiraola's Login Register Area --> */}
            <div className="hiraola-login-register_area" id={"signIn"}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6">
                            <Box sx={{}}>
                                <form onSubmit={loginFormSubmit}>
                                    <div className="login-form">
                                        <h4 className="login-title">
                                            Giriş Yap
                                        </h4>
                                        <div className="row">
                                            <div className="col-md-12 col-12 mb-3">
                                                <TextField
                                                    error={!!errors?.email}
                                                    name="email"
                                                    label="Email*"
                                                    variant="outlined"
                                                    type="email"
                                                    defaultValue={
                                                        loginFormData.email
                                                    }
                                                    onChange={loginFormChange}
                                                />
                                                {ValidateError(errors, "email")}
                                            </div>
                                            <div className="col-12 mb--20 mb-3">
                                                <TextField
                                                    error={!!errors?.password}
                                                    name="password"
                                                    label="Şifre*"
                                                    variant="outlined"
                                                    type="password"
                                                    defaultValue={
                                                        loginFormData.password
                                                    }
                                                    onChange={loginFormChange}
                                                />
                                                {ValidateError(
                                                    errors,
                                                    "password"
                                                )}
                                            </div>
                                            <div className="col-md-8"></div>
                                            <div className="col-md-4">
                                                <div className="forgotton-password_info">
                                                    <a href="#">
                                                        Forgotten password?
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                {logging ? (
                                                    <Loading
                                                        style={"m-height"}
                                                    />
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        className="hiraola-login_btn"
                                                    >
                                                        Giriş Yap
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Login Register Area  End Here --> */}
        </>
    );
}

export default AdminLogin;
