import React, { useState, useEffect } from "react";
import { homeData } from "../services/WebService";

import "slick-carousel";

function Home() {
    const [activeTab, setActiveTab] = useState("necklaces");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        $(".main-slider").slick({
            infinite: true,
            arrows: true,
            autoplay: true,
            fade: true,
            dots: true,
            autoplaySpeed: 5000,
            speed: 1000,
            adaptiveHeight: true,
            easing: "ease-in-out",
            pauseOnHover: false,
            pauseOnFocus: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow:
                '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
            nextArrow:
                '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
        });
        $(".hiraola-product-tab_slider-2.necklaces").slick({
            infinite: true,
            arrows: true,
            dots: false,
            speed: 1000,
            slidesToShow: 5,
            slidesToScroll: 4,
            prevArrow:
                '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
            nextArrow:
                '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
            responsive: [
                {
                    breakpoint: 1501,
                    settings: {
                        slidesToShow: 4,
                    },
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                    },
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                    },
                },
                {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 1,
                    },
                },
            ],
        });
        return () => {
            $(".main-slider").slick("unslick");
        };
    }, []);
    useEffect(() => {
        // Tab değiştiğinde ilgili slider'ı başa al
        if (activeTab === "necklaces") {
            $(".hiraola-product-tab_slider-2.necklaces").slick("slickGoTo", 0);
        } else if (activeTab === "earrings") {
            $(".hiraola-product-tab_slider-2.earrings").slick("slickGoTo", 0);
        }
        // $(".hiraola-product-tab_slider-2").slick("slickGoTo", 0);
    }, [activeTab]);

    useEffect(() => { //Verileri Getir
        const fetchData = async () => {
            try {
                const { data } = await homeData();
                setProducts(data);
            } catch (error) {
                console.log(error);
                setProducts([]);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
      if(products && products.length>0){
        $(".hiraola-product-tab_slider-2.slide").slick({
            infinite: true,
            arrows: true,
            dots: false,
            speed: 1000,
            slidesToShow: 5,
            slidesToScroll: 4,
            prevArrow:
                '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
            nextArrow:
                '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
            responsive: [
                {
                    breakpoint: 1501,
                    settings: {
                        slidesToShow: 4,
                    },
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                    },
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                    },
                },
                {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 1,
                    },
                },
            ],
        });
      }
    }, [products])


    console.log(products);
    return (
        <>
            <div className="hiraola-slider_area-2">
                <div className="main-slider">
                    {/* <!-- Begin Single Slide Area --> */}
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
                    {/* <!-- Single Slide Area End Here -->
                <!-- Begin Single Slide Area --> */}
                    <div className="single-slide animation-style-02 bg-5">
                        <div className="container">
                            <div className="slider-content">
                                <h5>
                                    <span>-10% Off</span> This Week
                                </h5>
                                <h2>Phantom4</h2>
                                <h3>Pro+ Obsidian</h3>
                                <h4>
                                    Starting at <span>£809.00</span>
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
                    {/* <!-- Single Slide Area End Here --> */}
                </div>
            </div>

            <div className="hiraola-product-tab_area-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-tab">
                                <div className="hiraola-section_title">
                                    <h4>Pırlanta</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div
                                className="tab-pane active show"
                                role="tabpanel"
                            >
                                <div className="hiraola-product-tab_slider-2 slide">
                                    {Array.isArray(products) &&
                                        products.map((e, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className="slide-item"
                                                >
                                                    <div className="single_product">
                                                        <div className="product-img">
                                                            <a href="single-product.html">
                                                                <img
                                                                    className="primary-img"
                                                                    src={e.images[0] ?? null}
                                                                    alt={e.name}
                                                                />
                                                                <img
                                                                    className="secondary-img"
                                                                    src={e.images[1] ?? null}
                                                                    alt={e.name}
                                                                />
                                                            </a>
                                                            <div className="add-actions">
                                                                <ul>
                                                                    <li>
                                                                        <a
                                                                            className="hiraola-add_cart"
                                                                            href="cart.html"
                                                                            data-bs-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Add To Cart"
                                                                        >
                                                                            <i className="ion-bag"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="hiraola-add_compare"
                                                                            href="compare.html"
                                                                            data-bs-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Compare This Product"
                                                                        >
                                                                            <i className="ion-ios-shuffle-strong"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li
                                                                        className="quick-view-btn"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#exampleModalCenter"
                                                                    >
                                                                        <a
                                                                            href="javascript:void(0)"
                                                                            data-bs-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Quick View"
                                                                        >
                                                                            <i className="ion-eye"></i>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="hiraola-product_content">
                                                            <div className="product-desc_info">
                                                                <h6>
                                                                    <a
                                                                        className="product-name"
                                                                        href="single-product.html"
                                                                    >
                                                                        {e.name}
                                                                    </a>
                                                                </h6>
                                                                <div className="price-box">
                                                                    <span className="new-price">
                                                                        {e.price}
                                                                    </span>
                                                                </div>
                                                                <div className="additional-add_action">
                                                                    <ul>
                                                                        <li>
                                                                            <a
                                                                                className="hiraola-add_compare"
                                                                                href="wishlist.html"
                                                                                data-bs-toggle="tooltip"
                                                                                data-placement="top"
                                                                                title="Add To Wishlist"
                                                                            >
                                                                                <i className="ion-android-favorite-outline"></i>
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="rating-box">
                                                                    <ul>
                                                                        <li>
                                                                            <i className="fa fa-star-of-david"></i>
                                                                        </li>
                                                                        <li>
                                                                            <i className="fa fa-star-of-david"></i>
                                                                        </li>
                                                                        <li>
                                                                            <i className="fa fa-star-of-david"></i>
                                                                        </li>
                                                                        <li>
                                                                            <i className="fa fa-star-of-david"></i>
                                                                        </li>
                                                                        <li className="silver-color">
                                                                            <i className="fa fa-star-of-david"></i>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            {/* <!-- Begin Hiraola's Product Tab Area --> */}
            <div className="hiraola-product-tab_area-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-tab">
                                <div className="hiraola-tab_title">
                                    <h4>New Products</h4>
                                </div>
                                <ul className="nav product-menu">
                                    <li>
                                        <a
                                            onClick={() =>
                                                setActiveTab("necklaces")
                                            }
                                            className={` ${
                                                activeTab === "necklaces"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            data-bs-toggle="tab"
                                            href="#necklaces"
                                        >
                                            <span>Necklaces</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className={` ${
                                                activeTab === "earrings"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveTab("earrings")
                                            }
                                            data-bs-toggle="tab"
                                            href="#earrings"
                                        >
                                            <span>Earrings</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content hiraola-tab_content">
                                <div
                                    id="necklaces"
                                    className={`tab-pane ${
                                        activeTab === "necklaces"
                                            ? "active show"
                                            : ""
                                    }`}
                                    role="tabpanel"
                                >
                                    <div className="hiraola-product-tab_slider-2 necklaces">
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.webp"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.webp"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="earrings"
                                    className={`tab-pane ${
                                        activeTab === "earrings"
                                            ? "active show"
                                            : ""
                                    }`}
                                    role="tabpanel"
                                >
                                    <div className="hiraola-product-tab_slider-2 earrings">
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.webp"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.webp"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Deneme Küpeler
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-item">
                                            <div className="single_product">
                                                <div className="product-img">
                                                    <a href="single-product.html">
                                                        <img
                                                            className="primary-img"
                                                            src="/src/assets/images/product/medium-size/1-9.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                        <img
                                                            className="secondary-img"
                                                            src="/src/assets/images/product/medium-size/1-8.jpg"
                                                            alt="Hiraola's Product Image"
                                                        />
                                                    </a>
                                                    <div className="add-actions">
                                                        <ul>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_cart"
                                                                    href="cart.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Add To Cart"
                                                                >
                                                                    <i className="ion-bag"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="hiraola-add_compare"
                                                                    href="compare.html"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Compare This Product"
                                                                >
                                                                    <i className="ion-ios-shuffle-strong"></i>
                                                                </a>
                                                            </li>
                                                            <li
                                                                className="quick-view-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModalCenter"
                                                            >
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    data-bs-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Quick View"
                                                                >
                                                                    <i className="ion-eye"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="hiraola-product_content">
                                                    <div className="product-desc_info">
                                                        <h6>
                                                            <a
                                                                className="product-name"
                                                                href="single-product.html"
                                                            >
                                                                Flash Furniture
                                                                Alonza Se...
                                                            </a>
                                                        </h6>
                                                        <div className="price-box">
                                                            <span className="new-price">
                                                                £90.36
                                                            </span>
                                                        </div>
                                                        <div className="additional-add_action">
                                                            <ul>
                                                                <li>
                                                                    <a
                                                                        className="hiraola-add_compare"
                                                                        href="wishlist.html"
                                                                        data-bs-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Add To Wishlist"
                                                                    >
                                                                        <i className="ion-android-favorite-outline"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="rating-box">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li>
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
                                                                <li className="silver-color">
                                                                    <i className="fa fa-star-of-david"></i>
                                                                </li>
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
                    </div>
                </div>
            </div>

            <div className="hiraola-banner_area-2 mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="banner-item img-hover_effect">
                                <a href="shop-left-sidebar.html">
                                    <img
                                        className="img-full"
                                        src="/src/assets/images/banner/1_5.jpg"
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
                                        src="/src/assets/images/banner/1_6.jpg"
                                        alt="Hiraola's Banner"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
