import React, { useState } from "react";
import { Link } from "react-router-dom";

import { register } from "../../services/AuthService";

function Register() {
    const [registerFormData, setRegisterFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

     const formChange = (e) => {

        const {name, value} = e.target;
        setRegisterFormData((prev) => ({...prev,[name]:value}))

     };

    const RegisterHandleSubmit = async (e) => {
        e.preventDefault();
        try {
           const res = await register(registerFormData);
        } catch (error) {
            console.log(error.response.data)
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
                                        <div className="col-md-6 col-12 mb--20">
                                            <label>First Name</label>
                                            <input
                                                onChange={formChange}
                                                name="name"
                                                type="text"
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div className="col-md-6 col-12 mb--20">
                                            <label>Last Name</label>
                                            <input
                                                onChange={formChange}
                                                name="lastname"
                                                type="text"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label>Email Address*</label>
                                            <input
                                                onChange={formChange}
                                                name="email"
                                                type="email"
                                                placeholder="Email Address"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Password</label>
                                            <input
                                                onChange={formChange}
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Confirm Password</label>
                                            <input
                                                onChange={formChange}
                                                name="password_confirmation"
                                                type="password"
                                                placeholder="Confirm Password"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                className="hiraola-register_btn"
                                            >
                                                Kayıt
                                            </button>
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
