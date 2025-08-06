import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useAuth } from "../../services/AuthContex";
import { toast } from "react-toastify";
import ValidateError from "./ValidateError";
import Loading from "../../layouts/GeneralComponents/Loading";

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
    const { registerForm, errorShow, accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken) {
            navigate("/me");
        }
    }, [accessToken]);

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
            <form onSubmit={RegisterHandleSubmit}>
                <div className="login-form">
                    <h4 className="login-title">Hesap Oluştur</h4>
                    <div className="row">
                        <div className="col-md-6 col-12 mb--20 mb-3">
                            <TextField
                                error={!!errors?.name}
                                name="name"
                                label="Ad*"
                                variant="outlined"
                                type="text"
                                defaultValue={registerFormData.name}
                                onChange={formChange}
                            />
                            {ValidateError(errors, "name")}
                        </div>
                        <div className="col-md-6 col-12 mb--20 mb-3">
                            <TextField
                                error={!!errors?.lastname}
                                name="lastname"
                                label="Soyad*"
                                variant="outlined"
                                type="text"
                                defaultValue={registerFormData.lastname}
                                onChange={formChange}
                            />
                            {ValidateError(errors, "lastname")}
                        </div>
                        <div className="col-md-12 mb-3">
                            <TextField
                                error={!!errors?.email}
                                name="email"
                                label="Email*"
                                variant="outlined"
                                type="email"
                                defaultValue={registerFormData.email}
                                onChange={formChange}
                            />
                            {ValidateError(errors, "email")}
                        </div>
                        <div className="col-md-6 mb-3">
                             <TextField
                                error={!!errors?.password}
                                name="password"
                                label="Password*"
                                variant="outlined"
                                type="password"
                                defaultValue={registerFormData.password}
                                onChange={formChange}
                            />
                            {ValidateError(errors, "password")}
                        </div>
                        <div className="col-md-6 mb-3">
                            <TextField
                                error={!!errors?.password_confirmation}
                                name="password_confirmation"
                                label="Şifre Tekrar*"
                                variant="outlined"
                                type="password"
                                onChange={formChange}
                            />
                            {ValidateError(errors, "password_confirmation")}
                        </div>
                        <div className="col-12">
                            {loading ? (
                                 <Loading style={"m-height"}/>
                            ) : (
                                <button
                                    type="submit"
                                    className="hiraola-register_btn"
                                >
                                    Oluştur
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Register;
