import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";
import "../../assets/js/plugins/jquery.elevateZoom-3.0.8.min";
import ProductDetailImages from "./ProductDetailImages";
import { getSingleProduct } from "../../services/WebService";

function ProductDetail() {
    const [count, setCount] = useState(1);
    const [product, setProduct] = useState(null);
    const {slug, category} = useParams();

    useEffect(()=>{
          async function fetchData(){
                    try {
                        const { data } = await getSingleProduct(category,slug);
                        //setProduct(data);
                        console.log(data);
                    } catch (error) {
                        console.log(error);
                        setProduct();
                    };
                };
                fetchData();
    },[]);


    //console.log(product);
    return (
        <>
            {/* <!-- Begin Hiraola's Breadcrumb Area --> */}
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <h2>Other</h2>
                        <ul>
                            <li>
                                <Link to="/tr">Ana Sayfa</Link>
                            </li>
                            <li className="">
                                <Link to="/pirlanta">Pırlanta</Link>
                            </li>
                            <li className="active"></li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Breadcrumb Area End Here --> */}

            {/* <!-- Begin Hiraola's Single Product Area --> */}
            <div className="sp-area">
                <div className="container">
                    <div className="sp-nav">
                        <div className="row">
                            <div className="col-lg-5 col-md-5">
                                <ProductDetailImages images={product?.images || []} />
                            </div>
                            <div className="col-lg-7 col-md-7">
                                <div className="sp-content">
                                    <div className="sp-heading">
                                        <h5>
                                            <a href="#">
                                                {product?.name}
                                            </a>
                                        </h5>
                                    </div>
                                    <span className="reference">
                                        {product?.content}
                                    </span>

                                    <div className="sp-essential_stuff">
                                        <ul>
                                            <li>
                                                EX Tax:{" "}
                                                <a href="javascript:void(0)">
                                                    <span>{`${product?.price.toLocaleString('tr-TR', {minimumFractionDigits: 2,})} ₺`}</span>
                                                </a>
                                            </li>
                                            <li>
                                                Brands{" "}
                                                <a href="javascript:void(0)">
                                                    Buxton
                                                </a>
                                            </li>
                                            <li>
                                                Product Code:{" "}
                                                <a href="javascript:void(0)">
                                                    Product 16
                                                </a>
                                            </li>
                                            <li>
                                                Reward Points:{" "}
                                                <a href="javascript:void(0)">
                                                    600
                                                </a>
                                            </li>
                                            <li>
                                                Availability:{" "}
                                                <a href="javascript:void(0)">
                                                    In Stock
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="product-size_box">
                                        <span>Renk</span>
                                        <select className="myniceselect nice-select">
                                            <option value="1">22 Ayar Gold</option>
                                            <option value="2">Rose Gold</option>
                                            <option value="3">Gümüş Rengi</option>
                                            <option value="4">14 Ayar Gold</option>
                                        </select>
                                    </div>
                                    <div className="quantity">
                                        <label>Miktar</label>
                                        <div className="cart-plus-minus">
                                            <input
                                                className="cart-plus-minus-box"
                                                value={count}
                                                type="text"
                                                readOnly
                                            />
                                            <div
                                                className="dec qtybutton"
                                                onClick={() => {
                                                    count === 1 ? setCount(1):
                                                    setCount(count - 1);
                                                }}
                                            >
                                                <i className="fa fa-angle-down"></i>
                                            </div>
                                            <div
                                                className="inc qtybutton"
                                                onClick={() => setCount(count + 1)}
                                            >
                                                <i className="fa fa-angle-up"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="qty-btn_area">
                                        <ul>
                                            <li>
                                                <a
                                                    className="qty-cart_btn"
                                                    href="cart.html"
                                                >
                                                    Sepete Ekle
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="qty-wishlist_btn"
                                                    href="wishlist.html"
                                                    data-bs-toggle="tooltip"
                                                    title="Add To Wishlist"
                                                >
                                                    <i className="ion-android-favorite-outline"></i>
                                                </a>
                                            </li>

                                        </ul>
                                    </div>
                                    <div className="hiraola-tag-line">
                                        <h6>Tags:</h6>
                                        <a href="javascript:void(0)">Ring</a>,
                                        <a href="javascript:void(0)">
                                            Necklaces
                                        </a>
                                        ,<a href="javascript:void(0)">Braid</a>
                                    </div>
                                    <div className="hiraola-social_link">
                                        <ul>
                                            <li className="facebook">
                                                <a
                                                    href="https://www.facebook.com"
                                                    data-bs-toggle="tooltip"
                                                    target="_blank"
                                                    title="Facebook"
                                                >
                                                    <i className="fab fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li className="instagram">
                                                <a
                                                    href="https://rss.com"
                                                    data-bs-toggle="tooltip"
                                                    target="_blank"
                                                    title="Instagram"
                                                >
                                                    <i className="fab fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Single Product Area End Here --> */}
        </>
    );
}

export default ProductDetail;
