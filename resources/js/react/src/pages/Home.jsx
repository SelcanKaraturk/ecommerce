import React, { useState, useEffect } from "react";
import { homeData } from "../services/WebService";
import "slick-carousel";
import { useAuth } from "../services/AuthContex";
import Slider from "react-slick";
import { TabNextArrow, TabPrevArrow } from "../layouts/GeneralComponents/SlickArrow";
import ProductSlider from "../layouts/GeneralComponents/ProductSlider";
import ProductSliderWithTab from "../layouts/GeneralComponents/ProductSliderWithTab";


function Home() {
    const [productsDi, setProducts] = useState([]);
    const [productsGold, setProductsGold] = useState([]);
    const [categoryDiamon, setCategoryDiamon] = useState([]);
    const { currentUser, accessToken } = useAuth();

    useEffect(() => {
        //Verileri Getir
        const fetchData = async () => {
            try {
                const { data } = await homeData();
                console.log(data);
                setProducts(data.productsDi);
                setProductsGold(data.productsGold);
                setCategoryDiamon(data.categoryDi);
            } catch (error) {
                console.log(error);
                setProducts([]);
                setProductsGold([]);
                setCategoryDiamon([]);
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
    //console.log(categoryDiamon);

    return (
        <>
            <div className="hiraola-slider_area-2">
                <div className="main-slider">
                    <Slider {...settingsMainSlider}>
                        <div className="single-slide animation-style-01 bg-4">
                            <div className="container">
                                <div className="slider-content">
                                    <h5>
                                        <span>Black Friday</span> This Week
                                    </h5>
                                    <h2>Pırlanta</h2>
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

            <ProductSlider mainName={'Pırlanta'} products={productsDi} user={currentUser}/>

            <div className="static-banner_area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="static-banner-image">
                                <div className="static-banner-content">
                                    <p>
                                        <span>-25% Off</span>This Week
                                    </p>
                                    <h2>Featured Product</h2>
                                    <h3>Meito Accessories 2022</h3>
                                    <p className="schedule">
                                        Starting at
                                        <span> £1209.00</span>
                                    </p>
                                    <div className="hiraola-btn-ps_left">
                                        <a
                                            href="shop-left-sidebar.html"
                                            className="hiraola-btn"
                                        >
                                            Shopping Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductSlider mainName={'Altın'} products={productsGold} user={currentUser}/>

            <div className="hiraola-banner_area-2 mb-5">
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
            </div>

            <ProductSliderWithTab mainName={"EŞSİZ PIRLANTA SERİMİZ"} categoryProducts={categoryDiamon}/>


        </>
    );
}

export default Home;
