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
        nextArrow: <TabNextArrow />,
        prevArrow: <TabPrevArrow/>,
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
            <div className="sp-img_area product-detail">
                <div className="zoompro-border">
                    <InnerImageZoom
                        src={activeImage && activeImage}
                        zoomSrc={activeImage && activeImage}
                        zoomType="hover"
                        zoomScale={1.5}
                        alt="Ürün Görseli"
                    />
                </div>

                <div id="gallery" className="sp-img_slider">
                    <Slider {...settingsTabSlider}>
                        {images.length > 0 &&
                        images.map((img, idx) => (
                                <img
                                key={idx}
                                src={img}
                                onClick={() => setActiveImage(img)}
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
