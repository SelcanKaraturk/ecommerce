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
import HandymanIcon from "@mui/icons-material/Handyman";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

function Home() {
    const [productsDi, setProducts] = useState([]);
    const [productsGold, setProductsGold] = useState([]);
    const [categoryDi, setCategoryDi] = useState([]);
    const { currentUser, accessToken } = useAuth();

    useEffect(() => {
        //Verileri Getir
        const fetchData = async () => {
            try {
                const { data } = await homeData();
                setProducts(data.productsDi);
                setProductsGold(data.productsGold);
                setCategoryDi(data.categoryDi);
            } catch (error) {
                console.log(error);
                setProducts([]);
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
    useEffect(()=>{
        console.log(productsDi)
    },[productsDi])
    //console.log(productsDi);

    return (
        <>
            <div className="hiraola-slider_area-2">
                <div className="main-slider">
                    <Slider {...settingsMainSlider}>
                        <div className="single-slide animation-style-01 bg-4">
                            <div className="container-fluid">
                                <div className="slider-content">
                                    {/* <h5>
                                        <span>Black Friday</span> This Week
                                    </h5> */}
                                    <h3>
                                        Zamanı Aşan <br /> Zarafet
                                    </h3>
                                    {/* <h2>Zarafet</h2> */}
                                    <h5>
                                        Eşsiz{" "}
                                        <span className="di">Pırlanta</span> ve{" "}
                                        <span>Altın</span> Tasarımlar
                                    </h5>
                                    <div className="hiraola-btn-ps_center slide-btn mt-4">
                                        <a
                                            className="hiraola-btn"
                                            href="shop-left-sidebar.html"
                                        >
                                            Koleksiyonu Keşfet
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="single-slide animation-style-01 bg-4">
                            <div className="container">
                                <div className="slider-content">
                                    <h5>
                                        <span>Black Friday</span> This Week
                                    </h5>
                                    <h2>Work Desk</h2>
                                    <h3>Surface Studio 2022</h3>
                                    <h4>
                                        Starting at <span>£1599.00</span>
                                    </h4>
                                    <div className="hiraola-btn-ps_center slide-btn">
                                        <a
                                            className="hiraola-btn"
                                            href="shop-left-sidebar.html"
                                        >
                                            Shopping Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>

            <div className="about-us-area mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <img
                                src="/src/assets/images/valorHomePage.png"
                                height={"200px"}
                                alt=""
                            />
                        </div>
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <div className="overview-content ">
                                <p className="short_desc">
                                    “Her parça, nesiller boyu sürecek bir
                                    hikâyedir. El işçiliği, nadir taşlar ve
                                    kusursuz tasarım…
                                </p>
                                <div className="hiraola-about-us_btn-area d-flex justify-content-center">
                                    <a
                                        className="about-us_btn"
                                        href="shop-left-sidebar.html"
                                    >
                                        Marka Hikayemiz
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hiraola-banner_area-3 categories">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4 position-relative">
                            <div className="banner-item img-hover_effect">
                                <a href="shop-left-sidebar.html">
                                    <img
                                        className="img-full"
                                        src={
                                            "/src/assets/images/categories/dimond.webp"
                                        }
                                        alt="Hiraola's Banner"
                                    />
                                </a>
                            </div>
                            <div className="text-wrap">
                                <p>Pırlanta</p>
                            </div>
                            <div className="hiraola-btn-ps_center slide-btn mt-4">
                                <a
                                    className="hiraola-btn"
                                    href="shop-left-sidebar.html"
                                >
                                    Hemen Keşfet
                                </a>
                            </div>
                        </div>
                        <div className="col-md-4 position-relative">
                            <div className="banner-item img-hover_effect">
                                <a href="shop-left-sidebar.html">
                                    <img
                                        className="img-full"
                                        src={
                                            "/src/assets/images/categories/gold.webp"
                                        }
                                        alt="Hiraola's Banner"
                                    />
                                </a>
                            </div>
                            <div className="text-wrap">
                                <p>Altın</p>
                            </div>

                            <div className="hiraola-btn-ps_center slide-btn mt-4">
                                <a
                                    className="hiraola-btn"
                                    href="shop-left-sidebar.html"
                                >
                                    Hemen Keşfet
                                </a>
                            </div>
                        </div>
                        <div className="col-md-4 position-relative">
                            <div className="banner-item img-hover_effect">
                                <a href="shop-left-sidebar.html">
                                    <img
                                        className="img-full"
                                        src={
                                            "/src/assets/images/categories/bilezik.webp"
                                        }
                                        alt="Hiraola's Banner"
                                    />
                                </a>
                            </div>
                            <div className="text-wrap">
                                <p>Bilezik</p>
                            </div>
                            <div className="hiraola-btn-ps_center slide-btn mt-4">
                                <a
                                    className="hiraola-btn"
                                    href="shop-left-sidebar.html"
                                >
                                    Hemen Keşfet
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <ProductSlider
                mainName={"Pırlanta"}
                products={productsDi ?? productsDi}

            /> */}

            <div className="static-banner_area">
                <div className="container-fluid">
                    <div className="row static-banner-image custimize justify-center">
                        <div className="col-md-5">
                            <h2>“Sadece Size Özel,</h2>
                            <h3>Eşi Olmayan Tasarımlar”</h3>
                            <p className="schedule">
                                Valor’da her pırlanta, sizin hikâyenize göre
                                şekillenir. <br /> El işçiliği, özel ölçüler ve
                                tamamen size özel tasarım süreciyle, <br />{" "}
                                hayallerinizdeki takı gerçeğe dönüşür.
                            </p>
                            <div className="hiraola-btn-ps_left">
                                <a
                                    href="shop-left-sidebar.html"
                                    className="hiraola-btn"
                                >
                                    Kendi Tasarımınızı Başlatın
                                </a>
                            </div>
                        </div>
                        <div className="col-md-5">

                                <p>
                                    <DesignServicesIcon /> İhtiyacınıza Göre
                                    Çizim ve Modelleme
                                </p>
                                <p>
                                    <HandymanIcon /> En Kaliteli Taşlar ve Altının Birlikteliği
                                </p>
                                <p>
                                    <WorkspacePremiumIcon /> Size Özel, Eşsiz Bir Parça
                                </p>

                        </div>
                    </div>
                </div>
            </div>

            <ProductSlider
                mainName={"Sınırlı ÜRETİM"}
                products={productsDi ?? productsDi}
            />

            {/* <div className="hiraola-banner_area-2 mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="banner-item img-hover_effect">
                                <a href="shop-left-sidebar.html">
                                    <img
                                        className="img-full"
                                        src="/src/assets/images/small-banner.webp"
                                        alt="Hiraola's Banner"
                                    />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="banner-item img-hover_effect">
                                <a href="shop-left-sidebar.html">
                                    <img
                                        className="img-full"
                                        src="/src/assets/images/small-banner.webp"
                                        alt="Hiraola's Banner"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <ProductSliderWithTab
                mainName={"EŞSİZ PIRLANTA SERİMİZ"}
                categoryProducts={categoryDi ?? categoryDi}
            />
        </>
    );
}

export default Home;
