import React, { useEffect } from "react";
import Slider from "react-slick";
import { TabNextArrow, TabPrevArrow } from "./SlickArrow";

function ProductSlider({ mainName, products }) {
    const settingsProductSlider = {
        infinite: true,
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

    //console.log(products);
    return (
        <>
            <div className="hiraola-product_area hiraola-product_area-2 section-space_add">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="hiraola-section_title">
                                <h4>{mainName}</h4>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="hiraola-product_slider-3">
                                <Slider {...settingsProductSlider}>
                                    {products.length > 0 &&
                                        products.map((i, key) => (
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
                                                                    i.images[0]
                                                                }
                                                                alt="Hiraola's Product Image"
                                                            />
                                                            <img
                                                                className="secondary-img"
                                                                src={
                                                                    i.images[1]
                                                                }
                                                                alt="Hiraola's Product Image"
                                                            />
                                                        </a>
                                                        {/* <span className="sticker-2">
                                                        Sale
                                                    </span> */}
                                                    </div>
                                                    <div className="hiraola-product_content">
                                                        <div className="product-desc_info">
                                                            <h6>
                                                                <a
                                                                    className="product-name"
                                                                    href="single-product.html"
                                                                >
                                                                    {i.name}
                                                                </a>
                                                            </h6>
                                                            <div className="price-box">
                                                                <span className="new-price">
                                                                    {i.price} ₺
                                                                </span>
                                                            </div>
                                                            <div class="additional-add_action">
                                                                <ul>
                                                                    <li>
                                                                        <a
                                                                            class="hiraola-add_compare"
                                                                            href="wishlist.html"
                                                                            data-bs-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Add To Wishlist"
                                                                        >
                                                                            <i class="ion-android-favorite-outline"></i>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductSlider;
