import React, { useState } from "react";
import Slider from "react-slick";
import { TabNextArrow, TabPrevArrow } from "./SlickArrow";

function ProductSliderWithTab({ mainName, categoryProducts }) {
    const [activeTab, setActiveTab] = useState("evlilik-teklifi-yuzukleri");

    const settingsProductSlider = {
        infinite: false,
        arrows: true,
        dots: false,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 4,
        nextArrow: <TabNextArrow />,
        prevArrow: <TabPrevArrow />,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <>
            <div className="hiraola-product-tab_area-2 tabs">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-tab">
                                <div className="hiraola-tab_title">
                                    <h4>{mainName}</h4>
                                </div>
                                <ul className="nav product-menu">
                                    {categoryProducts.length > 0 &&
                                        categoryProducts.map((i) => (
                                            <li key={i.slug}>
                                                <a
                                                    onClick={() =>
                                                        setActiveTab(i.slug)
                                                    }
                                                    className={` ${
                                                        activeTab === i.slug
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    data-bs-toggle="tab"
                                                    href={`#${i.slug}`}
                                                >
                                                    <span>{i.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            <div className="tab-content hiraola-tab_content">
                                {categoryProducts.length > 0 &&
                                    categoryProducts.map((i) => (
                                        <div
                                            key={i.slug}
                                            id={i.slug}
                                            className={`tab-pane ${
                                                activeTab === i.slug
                                                    ? "active show"
                                                    : ""
                                            }`}
                                            role="tabpanel"
                                        >
                                            <div
                                                className={`hiraola-product-tab_slider-2 ${i.slug}`}
                                            >
                                                <Slider
                                                    {...settingsProductSlider}
                                                >
                                                    {i.products.map(
                                                        (e, key) => (
                                                            <div
                                                                className="slide-item"
                                                                key={key}
                                                            >
                                                                <div className="single_product">
                                                                    <div className="product-img">
                                                                        <a href="single-product.html">
                                                                            <img
                                                                                className="primary-img"
                                                                                src={
                                                                                    e
                                                                                        .images[0]
                                                                                }
                                                                                alt="Hiraola's Product Image"
                                                                            />
                                                                            <img
                                                                                className="secondary-img"
                                                                                src={
                                                                                    e
                                                                                        .images[1]
                                                                                }
                                                                                alt="Hiraola's Product Image"
                                                                            />
                                                                        </a>
                                                                    </div>
                                                                    <div className="hiraola-product_content">
                                                                        <div className="product-desc_info">
                                                                            <h6>
                                                                                <a
                                                                                    className="product-name"
                                                                                    href="single-product.html"
                                                                                >
                                                                                    {
                                                                                        e.name
                                                                                    }
                                                                                </a>
                                                                            </h6>
                                                                            <div className="price-box">
                                                                                <span className="new-price">
                                                                                    {
                                                                                        `${e.price.toLocaleString('tr-TR', {minimumFractionDigits: 2,})} ₺`
                                                                                    }
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
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </Slider>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductSliderWithTab;
