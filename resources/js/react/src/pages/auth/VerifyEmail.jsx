import React from "react";
import { useLocation } from "react-router-dom";

function VerifyEmail() {
    const location = useLocation();
    const { email } = location.state ?? {};
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
                                                   💎 Değerli müşterimiz {email} adresine mail gönderdik 60 dakika içinde onaylamanız gerekmektedir.
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
