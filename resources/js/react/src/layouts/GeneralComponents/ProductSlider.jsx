import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { TabNextArrow, TabPrevArrow } from "./SlickArrow";
import slugify from "slugify";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import dayjs from "dayjs";

function ProductSlider({ mainName, products }) {
    const [sliderKey, setSliderKey] = useState(0);

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
    const category = slugify(mainName, {
        lower: true,
        locale: "tr",
        remove: /[*+~.()'"!:@]/g, // özel karakterleri temizle
    });
    const oneWeekAgo = dayjs().subtract(7, "day");
    return (
        <>
            <div className="hiraola-product_area hiraola-product_area-2 section-space_add">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="hiraola-section_title">
                                <h4>{mainName}</h4>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="hiraola-product_slider-3">
                                <Slider {...settingsProductSlider}>
                                    {products?.length > 0 &&
                                        products.map((i, index) => (
                                            <div
                                                className="slide-item"
                                                key={i.product_number}
                                            >
                                                <div className="single_product">
                                                    <div className="product-img">
                                                        <Link
                                                            to={`/tr/${category}/${i.product_slug}`}
                                                        >
                                                            <img
                                                                className="primary-img"
                                                                src={
                                                                    i
                                                                        .product_images[0]
                                                                }
                                                                alt="Hiraola's Product Image"
                                                            />
                                                            <img
                                                                className="secondary-img"
                                                                src={
                                                                    i
                                                                        .product_images[1]
                                                                }
                                                                alt="Hiraola's Product Image"
                                                            />
                                                        </Link>
                                                        <div className="sticker-wrapper">{i.grouped_stock_by_id ? (
                                                            i
                                                                .grouped_stock_by_id
                                                                .stock > 0 ? (
                                                                i
                                                                    .grouped_stock_by_id
                                                                    .stock <
                                                                6 ? (
                                                                    <span className="sticker-2">
                                                                        Tükeniyor
                                                                    </span>
                                                                ) : null
                                                            ) : (
                                                                <span className="sticker-3">
                                                                    Tükendi
                                                                </span>
                                                            )
                                                        ) : null}
                                                        {dayjs(
                                                            i.last_stock_update
                                                        ).isAfter(
                                                            oneWeekAgo
                                                        ) ? (
                                                            <span className="sticker">
                                                                Yeni
                                                            </span>
                                                        ) : null}</div>
                                                    </div>
                                                    <div className="hiraola-product_content">
                                                        <div className="product-desc_info">
                                                            <h6>
                                                                <a
                                                                    className="product-name"
                                                                    href="single-product.html"
                                                                >
                                                                    {
                                                                        i.product_name
                                                                    }
                                                                </a>
                                                            </h6>
                                                            <div className="price-box">
                                                                <span className="new-price">
                                                                    {`${i.product_price.toLocaleString(
                                                                        "tr-TR",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )} ₺`}
                                                                </span>
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
