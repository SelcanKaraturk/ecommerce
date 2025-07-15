import React, { useEffect } from "react";
import Slider from "react-slick";
import { TabNextArrow, TabPrevArrow } from "./SlickArrow";
import slugify from "slugify";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";


function ProductSlider({ mainName, products, user }) {
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
    //console.log(user);
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
                                                        <Link to={`/tr/${category}/${i.slug}`}>
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
                                                        </Link>
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
                                                                    {`${i.price.toLocaleString('tr-TR', {minimumFractionDigits: 2,})} ₺`}
                                                                </span>
                                                            </div>
                                                            <div className="additional-add_action">
                                                                <ul>
                                                                    <li>
                                                                        <WishlistButton productObj={{'product_slug':i.slug, 'price':i.price}} user={user}/>
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
