import React, { useEffect, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import Slider from "react-slick";
import "react-inner-image-zoom/lib/styles.min.css";
import { TabNextArrow, TabPrevArrow } from "../../layouts/GeneralComponents/SlickArrow";


function ProductDetailImages({ images }) {
    //console.log(images[0]);
    const [activeImage, setActiveImage] = useState(images[0]);

    // useEffect(() => {
    // if (images && images.length > 0) {
    //     setActiveImage(images[0]);
    // }
    // }, [images]);

    var settingsTabSlider = {
        dots: false,
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: true,
        centerPadding: "60px",
        vertical: true,
        verticalSwiping: true,
        prevArrow: null,
        nextArrow: <TabNextArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    //console.log(activeImage);
    return (
        <>
            <style>{`
                .sp-img_area {
                    display: flex;
                    gap: 20px;
                    flex-direction: row;
                }
                .sp-img_slider {
                    flex: 0 0 120px;
                    order: -1;
                    position: relative;
                }
                .sp-img_slider .slick-prev {
                    display: none !important;
                }
                .sp-img_slider .slick-next {
                    bottom: -50px !important;
                    left: 13px !important;
                    top: auto !important;
                    background-color: none !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                }
                .zoompro-border {
                    flex: 1;
                }
                .sp-img_slider img {
                    border: 1px solid transparent;
                    transition: border-color 0.2s ease;
                }
                .sp-img_slider img.active-thumb {
                    border-color: #D4B06A;
                }
            `}</style>
            <div className="sp-img_area product-detail">
                <div className="zoompro-border">
                    <InnerImageZoom
                        src={`/storage/${activeImage && activeImage}`}
                        zoomSrc={`/storage/${activeImage && activeImage}`}
                        zoomType="hover"
                        zoomScale={1.3}
                        alt="Ürün Görseli"
                    />
                </div>

                <div id="gallery" className="sp-img_slider">
                    <Slider {...settingsTabSlider}>
                        {images.length > 0 &&
                        images.map((i, idx) => (
                                <img
                                key={idx}
                            className={activeImage === i ? "active-thumb" : ""}
                                src={i && i.startsWith('blob:') ? i : `/storage/${i}`}
                                onClick={() => setActiveImage(i)}
                                alt="Alt görsel"
                                style={{
                                    cursor: "pointer",
                                }}
                            />
                        ))}
                    </Slider>

                </div>
            </div>
        </>
    );
}

export default ProductDetailImages;
