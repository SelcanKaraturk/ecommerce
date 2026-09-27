import React from 'react'
import './css/Footer.css'
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';
function Footer() {
    return (
        <>
            {/* <!-- Begin Hiraola's Footer Area --> */}
            <div className="hiraola-footer_area" style={{backgroundImage: 'url(/assets/images/footerBackground.png)'}}>

                <div className="footer-top_area">

                    <div className="footer_newslatter mb-5 pb-3">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-4">
                                    <div className="instagram-container footer-widgets_area">
                                        <div className="mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#d4b06a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-mail"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" /><path d="M3 7l9 6l9 -6" /></svg>
                                        </div>
                                        <div>
                                            <div className="footer-widgets_title">
                                                <h6 className="pb-2">YENİLİKLERDEN HABERDAR OLUN</h6>
                                            </div>
                                            <div className="widget-short_desc">
                                                <p>Kampanyalar, yeni koleksiyonlar ve özel fırsatlar için <br /> bültenimize abone olun.</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-3 d-flex align-items-center">
                                    <div className="newsletter-form_wrap w-100">
                                        <form className="subscribe-form" id="mc-form" action="#">
                                            <input className="newsletter-input" id="mc-email" type="email"
                                                autoComplete="off" name="E-posta Adresiniz" placeholder="E-posta Adresiniz"
                                                onBlur={(e) => e.target.value == '' ? e.target.value = 'E-posta Adresiniz' : ''}
                                                onFocus={(e) => e.target.value == 'E-posta Adresiniz' ? e.target.value = '' : ''} />
                                            <button className="newsletter-btn" id="mc-submit">
                                                <span>ABONE OL</span>
                                            </button>
                                        </form>
                                        {/* <!-- Mailchimp Alerts --> */}
                                        <div className="mailchimp-alerts mt-3">
                                            <div className="mailchimp-submitting"></div>
                                            <div className="mailchimp-success"></div>
                                            <div className="mailchimp-error"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="row">
                                        <div className="col-4 text-center">
                                            <svg style={{ marginTop: '-9px' }} xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#d4b06a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>
                                            <h6 className="pt-2">ÜCRETSİZ KARGO</h6>
                                            <p>Tüm şiparişlerde</p>
                                        </div>
                                        <div className="col-4 text-center">
                                            <svg style={{ marginTop: '-9px' }} xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#d4b06a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-lock-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v.5" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /><path d="M15 19l2 2l4 -4" /></svg>
                                            <h6 className="pt-2">GÜVENLİ ÖDEME</h6>
                                            <p>Güvenli ödeme altyapısı</p>
                                        </div>
                                        <div className="col-4 text-center">
                                            <svg style={{ marginTop: '-9px' }} xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#d4b06a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shield-star"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.143 20.743a12 12 0 0 1 -7.643 -14.743a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3c.504 1.716 .614 3.505 .343 5.237" /><path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138" /></svg>
                                            <h6 className="pt-2">18 AY GARANTİ</h6>
                                            <p>Tüm ürünlerde</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="footer-widgets_info">

                                    <div className="footer-widgets_logo">
                                        <a className='d-inline-block' href="#">
                                            <img className="d-block mb-2 mx-auto" src="/assets/images/valor_monogram.png" width={'70px'} alt="Valor Monogram" />
                                            <img src="/assets/images/valor_logo.png" width={'225px'} alt="Valor Footer Logo" />
                                        </a>
                                    </div>

                                    <div className="widget-short_desc">
                                        <p>
                                            Geniş koleksiyonumuz ve kişiye özel üretim ayrıcalığımızla, her parçada zamansız zarafet sunuyoruz. Sınırlı sayıda üretilen tasarımlarımızla, size özel ihtişamı keşfedin.
                                        </p>
                                    </div>
                                    <div className="hiraola-social_link">
                                        <ul>
                                            <li className="facebook">
                                                <a href="https://www.facebook.com" data-bs-toggle="tooltip" target="_blank" title="Facebook">
                                                    <i className="fab fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li className="instagram">
                                                <a href="https://www.instagram.com/valor.jewelry.tr" data-bs-toggle="tooltip" target="_blank" title="Instagram">
                                                    <i className="fab fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-1"></div>
                            <div className="col-lg-8">
                                <div className="footer-widgets_area">
                                    <div className="row">
                                        <div className="col-lg-2">
                                            <div className="footer-widgets_title">
                                                <h6>KATEGORİLER</h6>
                                            </div>
                                            <div className="footer-widgets">
                                                <ul>
                                                    <li><a href="#">Yeni Gelenler</a></li>
                                                    <li><a href="#">Koleksiyonlar</a></li>
                                                    <li><a href="#">Pırlanta</a></li>
                                                    <li><a href="#">Altın</a></li>
                                                    <li><a href="#">Bilezik</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="footer-widgets_title">
                                                <h6>KURUMSAL</h6>
                                            </div>
                                            <div className="footer-widgets">
                                                <ul>
                                                    <li><a href="#">Hakkımızda</a></li>
                                                    <li><a href="#">Vizyonumuz</a></li>
                                                    <li><a href="#">Misyonumuz</a></li>
                                                    <li><a href="#">Toptan Satış</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="footer-widgets_title">
                                                <h6>MÜŞTERİ HİZMETLERİ</h6>
                                            </div>
                                            <div className="footer-widgets">
                                                <ul>
                                                    <li><a href="#">Sıkça Sorulan Sorular</a></li>
                                                    <li><a href="#">İade ve Değişim</a></li>
                                                    <li><a href="#">Kargo ve Teslimat</a></li>
                                                    <li><a href="#">Garanti</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-lg-5">
                                            <div className="footer-widgets_info">
                                                <div className="footer-widgets_title">
                                                    <h6>İLETİŞİM</h6>
                                                </div>
                                                <div className="widgets-essential_stuff">
                                                    <ul>
                                                        <li className="hiraola-address"><i
                                                            className="ion-ios-location"></i><span>Adres:</span> The Barn,
                                                            Ullenhall, Henley
                                                            in
                                                            Arden B578 5CC, England</li>
                                                        <li className="hiraola-phone"><i className="ion-ios-telephone"></i><span>Telefon:</span> <a href="tel://+123123321345">+123 321 345</a>
                                                        </li>
                                                        <li className="hiraola-email"><i
                                                            className="ion-android-mail"></i><span>Email:</span> <a href="mailto://info@yourdomain.com">info@yourdomain.com</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom_area">
                    <div className="container-fluid">
                        <div className="footer-bottom_nav">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="copyright">
                                        <span>Copyright &copy; {dayjs().year()} <Link to="/">Valor.</Link> Tüm Hakları Saklıdır.</span>
                                        <span>Web Tasarım <a href="https://www.instagram.com/selcankaraturk" target="_blank" rel="noopener noreferrer"> Selcan Yılmaz </a></span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Footer Area End Here --> */}
        </>
    )
}

export default Footer
