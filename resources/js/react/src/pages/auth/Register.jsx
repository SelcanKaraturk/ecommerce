import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";
import { useAuth } from "../../services/AuthContex";
import { toast } from "react-toastify";
import ValidateError from "./ValidateError";

function Register() {
    const [registerFormData, setRegisterFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, SetLoading] = useState(false);
    const [errors, SetErrors] = useState(null);
    const { registerForm, errorShow, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate("/me");
        }
    }, [currentUser]);

    const formChange = (e) => {
        const { name, value } = e.target;
        setRegisterFormData((prev) => ({ ...prev, [name]: value }));
    };

    const RegisterHandleSubmit = async (e) => {
        e.preventDefault();
        SetLoading(true);
        try {
            const res = await registerForm(registerFormData);
            SetLoading(false);
            toast.success(res?.data?.message);
            navigate("/login");
        } catch (error) {
            console.log(error.response.data.errors);
            if (error.response.status !== 422) {
                errorShow(error);
            } else {
                SetErrors(error.response.data.errors);
            }
            SetLoading(false);
        }
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
                            <li className="active">Kullanıcı Kayıt</li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Breadcrumb Area End Here --> */}

            {/* <!-- Begin Hiraola's Login Register Area --> */}
            <div className="hiraola-login-register_area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-12 col-lg-6 col-xs-12">
                            <form onSubmit={RegisterHandleSubmit}>
                                <div className="login-form">
                                    <h4 className="login-title">Register</h4>
                                    <div className="row">
                                        <div className="col-md-6 col-12 mb--20 mb-3">
                                            <label>First Name</label>
                                            <input
                                                onChange={formChange}
                                                name="name"
                                                value={registerFormData.name}
                                                type="text"
                                                placeholder="First Name"
                                                className="mb-0"
                                            />
                                            {ValidateError(errors, "name")}
                                        </div>
                                        <div className="col-md-6 col-12 mb--20 mb-3">
                                            <label>Last Name</label>
                                            <input
                                                onChange={formChange}
                                                name="lastname"
                                                value={
                                                    registerFormData.lastname
                                                }
                                                type="text"
                                                placeholder="Last Name"
                                                className="mb-0"
                                            />
                                            {ValidateError(errors, "lastname")}
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label>Email Address*</label>
                                            <input
                                                onChange={formChange}
                                                name="email"
                                                value={registerFormData.email}
                                                type="email"
                                                placeholder="Email Address"
                                                className="mb-0"
                                            />
                                            {ValidateError(errors, "email")}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label>Password</label>
                                            <input
                                                onChange={formChange}
                                                name="password"
                                                value={
                                                    registerFormData.password
                                                }
                                                type="password"
                                                placeholder="Password"
                                                className="mb-0"
                                            />
                                            {ValidateError(errors, "password")}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label>Confirm Password</label>
                                            <input
                                                onChange={formChange}
                                                name="password_confirmation"
                                                type="password"
                                                placeholder="Confirm Password"
                                                className="mb-0"
                                            />
                                            {ValidateError(
                                                errors,
                                                "password_confirmation"
                                            )}
                                        </div>
                                        <div className="col-12">
                                            {loading ? (
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
                                                    className="hiraola-register_btn"
                                                >
                                                    Kayıt
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
            {/* <!-- Hiraola's Login Register Area  End Here --></> */}
        </>
    );
}

export default Register;
