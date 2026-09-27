import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="error404-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto text-center">
                        <div className="search-error-wrapper">
                            <h1>404</h1>
                            <h2>SAYFA BULUNAMADI</h2>
                            <p className="short_desc">Üzgünüz, aradığınız sayfa mevcut değil, kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor.</p>
                           
                            <div className="hiraola-btn-ps_center"></div>
                            <Link to="/" className="hiraola-error_btn">Anasayfaya Dön</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
