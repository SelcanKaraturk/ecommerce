import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../../layouts/GeneralComponents/Loading";
import { useAuth } from "../../services/AuthContex";

function VerifyEmail() {
    const { accessToken, currentUser, loading } = useAuth();
    const location = useLocation();
    const { email } = location.state ?? {};

    if (loading && accessToken) {
        return <Loading />;
    }

    if (accessToken && currentUser?.email_verified_at) {
        return <Navigate to="/tr/hesabim" replace />;
    }

    return (
        <>
            <div className="hiraola-login-register_area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6">
                            {/* <!-- Login Form s--> */}
                            <form>
                                <div className="login-form">
                                    <h4 className="login-title">
                                        Email Doğrulama
                                    </h4>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="forgotton-password_info">
                                                <a href="#">
                                                   💎 Değerli müşterimiz, {email} adresine doğrulama e-postası gönderilmiştir. Hesabınızı etkinleştirmek için lütfen 60 dakika içinde doğrulama işlemini tamamlayınız.
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VerifyEmail;
