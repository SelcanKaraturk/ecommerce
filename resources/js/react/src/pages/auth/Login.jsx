import React, { useState, useEffect } from "react";
import { login, getUser } from "../../services/AuthService";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../services/AuthContex";
import { toast } from "react-toastify";
import ValidateError from "./ValidateError";

function Login() {
    const { hash } = useLocation();
    const navigate = useNavigate();
    const [logging, setlogging] = useState(false);
    const [errors, setErrors] = useState(null);
    const { login, errorShow, setAccessToken, setCurrentUser, currentUser, accessToken } = useAuth();
    const [loginFormData, setloginFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(()=>{
        if(currentUser){
            navigate('/me');
        }
    },[currentUser]);
    useEffect(() => {
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [hash]);

    const loginFormSubmit = async (e) => {
        e.preventDefault();
        setlogging(true);
        
        try {
            const res = await login(loginFormData);
            if (res?.data?.error) {
                toast.error(res?.data?.error);
                setlogging(false);
            } else {
                localStorage.setItem('currentToken',res?.data?.currentToken);
                setAccessToken(res?.data?.currentToken);
                setCurrentUser(res.data.user);
                toast.success(res?.data?.message);
                setlogging(false);
                navigate("/me");
            }
        } catch (error) {
            console.log(error)
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
            {/* <!-- Begin Hiraola's Breadcrumb Area --> */}
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <h2>Other</h2>
                        <ul>
                            <li>
                                <Link to="/tr">Ana Sayfa</Link>
                            </li>
                            <li className="active">Login</li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Breadcrumb Area End Here --> */}

            {/* <!-- Begin Hiraola's Login Register Area --> */}
            <div className="hiraola-login-register_area" id={"signIn"}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6">
                            {/* <!-- Login Form s--> */}
                            <form onSubmit={loginFormSubmit}>
                                <div className="login-form">
                                    <h4 className="login-title">Login</h4>
                                    <div className="row">
                                        <div className="col-md-12 col-12 mb-3">
                                            <label>Email Address*</label>
                                            <input
                                            className="mb-0"
                                                name="email"
                                                value={loginFormData.email}
                                                onChange={loginFormChange}
                                                type="email"
                                                placeholder=
                                                "Email Address"
                                            />
                                            {ValidateError(errors,'email')}
                                        </div>
                                        <div className="col-12 mb--20 mb-3">
                                            <label>Password</label>
                                            <input
                                                className="mb-0"
                                                name="password"
                                                value={loginFormData.password}
                                                type="password"
                                                onChange={loginFormChange}
                                                placeholder="Password"
                                            />
                                            {ValidateError(errors,'password')}
                                        </div>
                                        <div className="col-md-8">
                                            <div className="check-box">
                                                <input
                                                    type="checkbox"
                                                    id="remember_me"
                                                    name="remember_me"
                                                    onChange={loginFormChange}
                                                />

                                                <label htmlFor="remember_me">
                                                    Remember me
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
                                                <div className="mt-3">
                                                    <div
                                                        className="spinner-border text-dark"
                                                        role="status"
                                                    >
                                                        <span className="sr-only">
                                                            Loading...
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="hiraola-login_btn"
                                                >
                                                    Login
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Login Register Area  End Here --> */}
        </>
    );
}

export default Login;
