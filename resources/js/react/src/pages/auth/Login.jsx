import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../services/AuthContex";
import { toast } from "react-toastify";
import ValidateError from "./ValidateError";
import { Box, Tabs, Tab, TextField } from "@mui/material";
import Register from "./Register";
import Loading from "../../layouts/GeneralComponents/Loading";


function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}
function Login() {
    const { hash } = useLocation();
    const navigate = useNavigate();
    const [logging, setlogging] = useState(false);
    const [errors, setErrors] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const { login, errorShow, setAccessToken, setCurrentUser, accessToken, cart, setCart } =
        useAuth();
    const [loginFormData, setloginFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (accessToken) {
            navigate("/me");
        }
    }, [accessToken]);
    useEffect(() => {
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [hash]);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };
    const loginFormSubmit = async (e) => {
        e.preventDefault();
        setlogging(true);
        try {
            const res = await login(loginFormData);
            if (res?.data?.error) {
                toast.error(res?.data?.error);
                setlogging(false);
            } else {
                localStorage.setItem("currentToken", res?.data?.currentToken);
                setAccessToken(res?.data?.currentToken);
                setCurrentUser(res.data.user);
                setCart([]);
                toast.success(res?.data?.message);
                setlogging(false);
                navigate("/me");
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
        const { name, value, checked } = e.target;
        setloginFormData((prev) => ({
            ...prev,
            [name]: value,
            remember_me: checked,
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
                                <Tabs
                                    value={tabIndex}
                                    TabIndicatorProps={{
                                        style: {
                                            backgroundColor: "#bfa133",
                                            height: "2px",
                                        },
                                    }}
                                    textColor="inherit"
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    centered
                                >
                                    <Tab label="GİRİŞ YAP" />
                                    <Tab label="HESAP OLUŞTUR" />
                                </Tabs>
                                <TabPanel value={tabIndex} index={0}>
                                    {/* <!-- Login Form s--> */}
                                    <form
                                        onSubmit={loginFormSubmit}
                                        tabIndex={0}
                                    >
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
                                                        onChange={
                                                            loginFormChange
                                                        }
                                                    />
                                                    {ValidateError(
                                                        errors,
                                                        "email"
                                                    )}
                                                </div>
                                                <div className="col-12 mb--20 mb-3">
                                                    <TextField
                                                        error={
                                                            !!errors?.password
                                                        }
                                                        name="password"
                                                        label="Şifre*"
                                                        variant="outlined"
                                                        type="password"
                                                        defaultValue={
                                                            loginFormData.password
                                                        }
                                                        onChange={
                                                            loginFormChange
                                                        }
                                                    />
                                                    {ValidateError(
                                                        errors,
                                                        "password"
                                                    )}
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="check-box">
                                                        <input
                                                            type="checkbox"
                                                            id="remember_me"
                                                            name="remember_me"
                                                            onChange={
                                                                loginFormChange
                                                            }
                                                        />

                                                        <label htmlFor="remember_me">
                                                            Beni Hatırla
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="forgotton-password_info">
                                                        <a href="#">
                                                            Forgotten pasward?
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
                                </TabPanel>
                                <TabPanel value={tabIndex} index={1}>
                                    <Register />
                                </TabPanel>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Login Register Area  End Here --> */}
        </>
    );
}

export default Login;
