import React, { useState, useEffect } from "react";
import { homeData } from "../services/WebService";
import "slick-carousel";
import { useAuth } from "../services/AuthContex";
import Slider from "react-slick";
import {
    TabNextArrow,
    TabPrevArrow,
} from "../layouts/GeneralComponents/SlickArrow";
import ProductSlider from "../layouts/GeneralComponents/ProductSlider";
import ProductSliderWithTab from "../layouts/GeneralComponents/ProductSliderWithTab";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import GridGoldenratioOutlinedIcon from '@mui/icons-material/GridGoldenratioOutlined';
import { Link } from "react-router-dom";
import Instagram from "../layouts/GeneralComponents/Instagram";
function Home() {
    const [productsDi, setProducts] = useState([]);
    const [productsGold, setProductsGold] = useState([]);
    const [categoryDi, setCategoryDi] = useState([]);
    const { currentUser, accessToken } = useAuth();
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        //Verileri Getir
        const fetchData = async () => {
            try {
                const { data } = await homeData();
                console.log(data);
                setProducts(data.productsDi);
                setProductsGold(data.productsGold);
                setCategoryDi(data.categoryDi);
                setMenu(data.menu);
            } catch (error) {
                console.log(error);
                setProducts([]);
                setProductsGold([]);
                setCategoryDi([]);
                setMenu([]);

            }
        };
        fetchData();
    }, []);

    const settingsMainSlider = {
        autoplay: false,
        fade: true,
        dots: true,
        autoplaySpeed: 5000,
        speed: 1000,
        adaptiveHeight: true,
        easing: "ease-in-out",
        pauseOnHover: false,
        pauseOnFocus: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <TabNextArrow />,
        prevArrow: <TabPrevArrow />,
    };
    useEffect(() => {
        console.log(productsDi)
    }, [productsDi])
    //console.log(productsDi);

    return (
        <>
            <div className="hiraola-slider_area-2">
                <div className="main-slider" style={{ height: 'calc(100vh - 337px)' }}>
                    <Slider {...settingsMainSlider}>
                        <div className="single-slide animation-style-01 bg-4">
                            <div className="container-fluid">
                                <div className="slider-content text-center">
                                    {/* <h5>
                                        <span>Black Friday</span> This Week
                                    </h5> */}
                                    <h3>
                                        ZAMANSIZ IŞILTININ <br /> EN DEĞERLİ HALİ
                                    </h3>
                                    {/* <h2>Zarafet</h2> */}
                                    <h4>
                                        Eşsiz
                                        Pırlanta ve
                                        Altın Tasarımlar
                                    </h4>
                                    <div className="hiraola-btn-ps_center slide-btn mt-4">
                                        <a
                                            className="hiraola-btn home-slider-btn"
                                            href="shop-left-sidebar.html"
                                        >
                                            KEŞFET
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="single-slide animation-style-01 bg-4">
                            <div className="container-fluid">
                                <div className="slider-content text-center">
                                    {/* <h5>
                                        <span>Black Friday</span> This Week
                                    </h5> */}
                                    <h3>
                                        ZAMANSIZ IŞILTININ <br /> EN DEĞERLİ HALİ
                                    </h3>
                                    {/* <h2>Zarafet</h2> */}
                                    <img src="/assets/images/valor_logo.png" alt="" style={{ width: '250px', margin: '0px auto 10px auto' }} />
                                    <div className="hiraola-btn-ps_center slide-btn mt-4">
                                        <a
                                            className="hiraola-btn home-slider-btn"
                                            href="shop-left-sidebar.html"
                                        >
                                            KEŞFET
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
                <div className="container-fluid" style={{ backgroundColor: '#F7F4EF' }}>
                    <div className="row">
                        <div className="col">
                            <div className="text-center" style={{ padding: '2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#b8924a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>
                                <h6 className="mt-2" style={{ fontSize: 14 }}>ÜCRETSİZ KARGO</h6>
                                <p className="m-0" style={{ fontSize: 14, lineHeight: '18px' }}>Tüm siparişlerde <br /> ücretsiz ve sigortalı kargo</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="text-center" style={{ padding: '2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#b8924a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shield-lock">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
                                    <path d="M11 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                    <path d="M12 12l0 2.5" />
                                </svg>
                                <h6 className="mt-2" style={{ fontSize: 14 }}>GÜVENLİ ÖDEME</h6>
                                <p className="m-0" style={{ fontSize: 14, lineHeight: '18px' }}>256 BIT SSL <br /> güvenli ödeme alt yapısı</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="text-center" style={{ padding: '2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#b8924a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" /><path d="M9 12l2 2l4 -4" /></svg>
                                <h6 className="mt-2" style={{ fontSize: 14 }}>18 AY GARANTİ</h6>
                                <p className="m-0" style={{ fontSize: 14, lineHeight: '18px' }}>Tüm ürünlerde <br /> 18 ay garanti</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="text-center" style={{ padding: '2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#b8924a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-gift"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" /><path d="M12 8l0 13" /><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" /></svg>
                                <h6 className="mt-2" style={{ fontSize: 14 }}>ÖZEL PAKETLEME</h6>
                                <p className="m-0" style={{ fontSize: 14, lineHeight: '18px' }}> Premium kutu ve <br /> özel hediye paketi </p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="text-center" style={{ padding: '2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#b8924a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-diamond"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" /><path d="M10 12l-2 -2.2l.6 -1" /></svg>
                                <h6 className="mt-2" style={{ fontSize: 14 }}>KİŞİYE ÖZEL ÜRETİM</h6>
                                <p className="m-0" style={{ fontSize: 14, lineHeight: '18px' }}> Hayalindeki tasarımı <br /> gerçeğe dönüştür</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="hiraola-product-tab_area-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-tab">
                                <div className="hiraola-tab_title">
                                    <h3>KOLEKSİYONLAR</h3>
                                    <div className="section-divider">
                                        <span></span>
                                    </div>
                                    {/* <h4>KOLEKSİYONLAR</h4> */}
                                </div>

                            </div>
                            <div className="tab-content hiraola-tab_content">
                                <div>
                                    <div className="hiraola-product-tab_slider-2 row">

                                        <div className="col slide-item">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/special_design.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a className="product-name" href="single-product.html">
                                                                ÖZEL TASARIM
                                                            </a>
                                                            <div className="section-divider">
                                                                <span></span>
                                                            </div>
                                                        </h6>
                                                        <p>
                                                            Hayalindeki tasarımı senin için gerçeğe dönüştürüyoruz. <br /> Sana özel, Sana ait.
                                                        </p>

                                                    </div>
                                                </div>
                                                <a href="shop-left-sidebar.html" className="btn_collection">
                                                    <span>
                                                        KEŞFET
                                                    </span>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="col slide-item">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/limited_production.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a className="product-name" href="single-product.html">
                                                                SINIRLI ÜRETİM
                                                            </a>
                                                            <div className="section-divider">
                                                                <span></span>
                                                            </div>
                                                        </h6>
                                                        <p>
                                                            Zamana meydan okuyan tasarımlar, sınırlı sayıda üretimle hayat buluyor. <br />
                                                            Her parça, eşşizliğin ve ayrıcalığın bir simgesi.
                                                        </p>

                                                    </div>
                                                </div>
                                                <a href="shop-left-sidebar.html" className="btn_collection">
                                                    <span>
                                                        KEŞFET
                                                    </span>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="col slide-item ">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/diamond_ring.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a className="product-name" href="single-product.html">
                                                                PIRLANTA SERİMİZ
                                                            </a>
                                                            <div className="section-divider">
                                                                <span></span>
                                                            </div>
                                                        </h6>
                                                        <p>
                                                            Işıltısıyla zamana meydan okuyan tasarımlar. <br />
                                                            Gerçek pırlantanın büyüsü, özel tasarım dokunuşlarıyla. <br />
                                                        </p>

                                                    </div>
                                                </div>
                                                <a href="shop-left-sidebar.html" className="btn_collection">
                                                    <span>
                                                        KEŞFET
                                                    </span>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="col slide-item">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/lale.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a className="product-name" href="single-product.html">
                                                                LALE KOLEKSİYONU
                                                            </a>
                                                            <div className="section-divider">
                                                                <span></span>
                                                            </div>
                                                        </h6>
                                                        <p>
                                                            Selçuklu sanatının zarif lale motifinden ilham alan tasarımlar,
                                                            zarafet ve anlamı buluşturuyor.
                                                        </p>

                                                    </div>
                                                </div>
                                                <a href="shop-left-sidebar.html" className="btn_collection">
                                                    <span>
                                                        KEŞFET
                                                    </span>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="col slide-item">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/minimal.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a className="product-name" href="single-product.html">
                                                                MİNİMAL KOLEKSİYONU
                                                            </a>
                                                            <div className="section-divider">
                                                                <span></span>
                                                            </div>
                                                        </h6>
                                                        <p>
                                                            Sadeliğin gücünü yansıtan tasarımlar, günlük şıklığa sofistike bir dokunuş katıyor.
                                                            <br /> Zarafetin en saf hali.
                                                        </p>

                                                    </div>
                                                </div>
                                                <a href="shop-left-sidebar.html" className="btn_collection">
                                                    <span>
                                                        KEŞFET
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="about-us-area">
                <div className="container-fluid">
                    <div className="row" style={{ backgroundColor: '#f4efe9' }}>
                        <div className="col-lg-1"></div>
                        <div className="col-lg-3 col-md-5 d-flex align-items-center">
                            <div className="overview-content">
                                {/* <h2>Welcome To <span>Hiraola's</span> Store!</h2> */}
                                <h2>HAYALİNİZDEKİ TASARIMI <br /> SİZİN İÇİN ÜRETİYORUZ</h2>
                                <p className="short_desc">
                                    Kişiye özel tasarım hizmetimizle, hayalinizdeki takıyı gerçeğe dönüştürüyoruz. Size özel, sadece size ait tasarımlar için bizimle iletişime geçin.
                                </p>
                                <div className="overview-list">
                                    <div className="overview-item">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-icons"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 6.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" /><path d="M2.5 21h8l-4 -7l-4 7" /><path d="M14 3l7 7" /><path d="M14 10l7 -7" /><path d="M14 14h7v7h-7l0 -7" /></svg>
                                        </span>
                                        <div className="mt-2">
                                            <h6 className="m-0">Tasarımınızı Paylaşın</h6>
                                            <p className="m-0">Hayalinizdeki tasarımı bizimle paylaşın.</p>
                                        </div>
                                    </div>
                                    <div className="overview-item">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-gift-card"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8" /><path d="M7 16l3 -3l3 3" /><path d="M8 13c-.789 0 -2 -.672 -2 -1.5s.711 -1.5 1.5 -1.5c1.128 -.02 2.077 1.17 2.5 3c.423 -1.83 1.372 -3.02 2.5 -3c.789 0 1.5 .672 1.5 1.5s-1.211 1.5 -2 1.5h-4" /></svg>
                                        </span>
                                        <div className="mt-2">
                                            <h6 className="m-0">Sizin İçin Üretelim</h6>
                                            <p className="m-0">Özenle üretilen tasarımınız özenle size ulaşsın.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="hiraola-about-us_btn-area">
                                    <a className="about-us_btn " href="shop-left-sidebar.html">ÖZEL TASARIM YAPTIR</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-lg-7 col-md-7 p-0">
                            <div className="overview-img text-center img-hover_effect">
                                <a href="#">
                                    <img className="img-full" src="assets/images/about_us.png" alt="Hiraola's About Us Image" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* “Her parça, nesiller boyu sürecek bir
                                    hikâyedir. El işçiliği, nadir taşlar ve
                                    kusursuz tasarım… */}

            <div className="hiraola-product-tab_area-4 mt-2">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-tab">
                                <div className="hiraola-tab_title">
                                    <h3>YENİ GELENLER</h3>
                                    <div className="section-divider">
                                        <span></span>
                                    </div>
                                    {/* <h4>KOLEKSİYONLAR</h4> */}
                                </div>

                            </div>
                            <div className="tab-content hiraola-tab_content new-arrivals">
                                <div>
                                    <div className="hiraola-product-tab_slider-2 row">

                                        <div className="col-lg-2 slide-item cart_collection">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/special_design.png" alt="Özel Tasarım Mücevher" />
                                                        <img className="secondary-img" src="assets/images/collections/limited_production.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <p>
                                                            Pırlanta Baget Yüzük
                                                        </p>
                                                        <h6>
                                                            <a className="product-name">
                                                                23850 ₺
                                                            </a>
                                                        </h6>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-2 slide-item cart_collection">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/special_design.png" alt="Özel Tasarım Mücevher" />
                                                        <img className="secondary-img" src="assets/images/collections/limited_production.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <p>
                                                            Pırlanta Baget Yüzük
                                                        </p>
                                                        <h6>
                                                            <a className="product-name">
                                                                23850 ₺
                                                            </a>
                                                        </h6>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-2 slide-item cart_collection">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/special_design.png" alt="Özel Tasarım Mücevher" />
                                                        <img className="secondary-img" src="assets/images/collections/limited_production.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <p>
                                                            Pırlanta Baget Yüzük
                                                        </p>
                                                        <h6>
                                                            <a className="product-name">
                                                                23850 ₺
                                                            </a>
                                                        </h6>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-2 slide-item cart_collection">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/special_design.png" alt="Özel Tasarım Mücevher" />
                                                        <img className="secondary-img" src="assets/images/collections/limited_production.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <p>
                                                            Pırlanta Baget Yüzük
                                                        </p>
                                                        <h6>
                                                            <a className="product-name">
                                                                23850 ₺
                                                            </a>
                                                        </h6>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-2 slide-item cart_collection">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/special_design.png" alt="Özel Tasarım Mücevher" />
                                                        <img className="secondary-img" src="assets/images/collections/limited_production.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <p>
                                                            Pırlanta Baget Yüzük
                                                        </p>
                                                        <h6>
                                                            <a className="product-name">
                                                                23850 ₺
                                                            </a>
                                                        </h6>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-2 slide-item cart_collection">
                                            <div className="single_product h-100">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img className="primary-img" src="assets/images/collections/special_design.png" alt="Özel Tasarım Mücevher" />
                                                        <img className="secondary-img" src="assets/images/collections/limited_production.png" alt="Özel Tasarım Mücevher" />
                                                    </a>

                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <p>
                                                            Pırlanta Baget Yüzük
                                                        </p>
                                                        <h6>
                                                            <a className="product-name">
                                                                23850 ₺
                                                            </a>
                                                        </h6>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <a className="hiraola-btn home-slider-btn" href="#">TÜM ÜRÜNLERİ GÖR</a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="static-banner_area">
                <div className="container-fluid">
                    <div className="row static-banner-image custimize justify-center">
                        <div className="col-md-2">
                            <h2>NEDEN VALOR?</h2>
                            <h6 className="">Çünkü siz, en iyisine değersiniz.</h6>
                            {/* <p className="schedule">
                                        Valor’da her pırlanta, sizin hikâyenize göre
                                        şekillenir. <br /> El işçiliği, özel ölçüler ve
                                        tamamen size özel tasarım süreciyle, <br />{" "}
                                        hayallerinizdeki takı gerçeğe dönüşür.
                                    </p> */}
                            <div className="hiraola-btn-ps_left">
                                <Link
                                    to="shop-left-sidebar.html"
                                    className="hiraola-btn bulur-btn"
                                >
                                    <span>
                                        HAKKIMIZDA
                                    </span>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-2 banner-item text-center">
                            <div className="icon"> <HandymanOutlinedIcon /> </div>
                            <h6 className="mt-3">
                                USTA İŞÇİLİK
                            </h6>
                            <p>
                                Her parça usta ellerde <br /> özenle şekillenir.
                            </p>
                            {/* <p>
                                <WorkspacePremiumIcon /> Size Özel, Eşsiz Bir Parça
                            </p> */}

                        </div>

                        <div className="col-md-2 banner-item text-center">
                            <div className="icon"> <DiamondOutlinedIcon /> </div>
                            <h6 className="mt-3">
                                DOĞAL TAŞLAR
                            </h6>
                            <p>
                                Sertifikalı doğal taşlar ve <br /> değerli taşlar kullanılır.
                            </p>
                        </div>
                        <div className="col-md-2 banner-item text-center">
                            <div className="icon"> <GridGoldenratioOutlinedIcon /> </div>
                            <h6 className="mt-3">
                                14K - 18K ALTIN
                            </h6>
                            <p>
                                Tüm ürünler 14 ayar veya <br /> 18 ayar altındır.
                            </p>
                        </div>
                        <div className="col-md-2 banner-item text-center">
                            <div className="icon"> <AllInclusiveOutlinedIcon /> </div>
                            <h6 className="mt-3">
                                ZAMANSIZ TASARIM
                            </h6>
                            <p>
                                Modası geçmeyen <br /> kalıcı tasarımlar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <Instagram />



            {/* <ProductSlider
                mainName={"Sınırlı ÜRETİM"}
                products={productsDi ?? productsDi}
            />

            <ProductSliderWithTab
                mainName={"EŞSİZ PIRLANTA SERİMİZ"}
                categoryProducts={categoryDi ?? categoryDi}
            /> */}
        </>
    );
}

export default Home;
