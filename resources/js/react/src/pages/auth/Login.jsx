import React, { useState } from "react";
import {login, getUser} from '../../services/AuthService';
import { Link, useNavigate, Navigate } from "react-router-dom";



function Login() {
    const [loginFormData, setloginFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const loginFormSubmit = async (e) => {
        e.preventDefault();
        console.log(loginFormData);
        try {

            const res = await login(loginFormData);

            navigate('/me');

        } catch (error) {
            console.log(error.response);
        }

    };

    const loginFormChange = (e) => {
        const { name, value, checked } = e.target;
        setloginFormData((prev) => ({
            ...prev,
            [name]: value,
            'remember_me': checked
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
                               <Link to='/tr'>Ana Sayfa</Link>
                            </li>
                            <li className="active">Login</li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Breadcrumb Area End Here --> */}

            {/* <!-- Begin Hiraola's Login Register Area --> */}
            <div className="hiraola-login-register_area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6">
                            {/* <!-- Login Form s--> */}
                            <form onSubmit={loginFormSubmit}>
                                <div className="login-form">
                                    <h4 className="login-title">Login</h4>
                                    <div className="row">
                                        <div className="col-md-12 col-12">
                                            <label>Email Address*</label>
                                            <input
                                                name="email"
                                                onChange={loginFormChange}
                                                type="email"
                                                placeholder="Email Address"
                                            />
                                        </div>
                                        <div className="col-12 mb--20">
                                            <label>Password</label>
                                            <input
                                                name="password"
                                                type="password"
                                                onChange={loginFormChange}
                                                placeholder="Password"
                                            />
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
                                            <button
                                                type="submit"
                                                className="hiraola-login_btn"
                                            >
                                                Login
                                            </button>
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
