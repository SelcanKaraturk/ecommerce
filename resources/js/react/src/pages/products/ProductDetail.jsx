import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";
import "../../assets/js/plugins/jquery.elevateZoom-3.0.8.min";
import ProductDetailImages from "./ProductDetailImages";
import { getSingleProduct } from "../../services/WebService";
import { useAuth } from "../../services/AuthContex";
import WishlistButton from "../../layouts/GeneralComponents/WishlistButton";
import CartButton from "../../layouts/GeneralComponents/CartButton";

function ProductDetail() {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const { slug, category } = useParams();
    const { accessToken } = useAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const { data } = await getSingleProduct(
                    category,
                    slug,
                    accessToken
                );
                setProduct(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                //console.log(error);
                setProduct();
            }
        }
        fetchData();
    }, []);
 useEffect(() => {
        console.log(product);
    }, [product]);
    const handleCartClick = (val) => {
        setProduct((prev) => ({ ...prev, in_carts_exists: val.inCart }));
    };

    return (
        <>
            {!loading ? (
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
                                        {product && (
                                            <ProductDetailImages
                                                images={product.images}
                                            />
                                        )}
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
                                                            <span>{`${product?.price.toLocaleString(
                                                                "tr-TR",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )} ₺`}</span>
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
                                                    <option value="1">
                                                        22 Ayar Gold
                                                    </option>
                                                    <option value="2">
                                                        Rose Gold
                                                    </option>
                                                    <option value="3">
                                                        Gümüş Rengi
                                                    </option>
                                                    <option value="4">
                                                        14 Ayar Gold
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="qty-btn_area">
                                                <ul>
                                                    <li>
                                                        {product && (
                                                            <CartButton
                                                                product={
                                                                    product
                                                                }
                                                                handleCartClick={
                                                                    handleCartClick
                                                                }
                                                            />
                                                        )}
                                                    </li>
                                                    <li>
                                                        {product && (
                                                            <WishlistButton
                                                                productObj={{
                                                                    product_slug:
                                                                        product.slug,
                                                                    price: product.price,
                                                                    myWish: product.wishlisted_by_exists,
                                                                }}
                                                            />
                                                        )}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="hiraola-tag-line">
                                                <h6>Tags:</h6>
                                                <a href="javascript:void(0)">
                                                    Ring
                                                </a>
                                                ,
                                                <a href="javascript:void(0)">
                                                    Necklaces
                                                </a>
                                                ,
                                                <a href="javascript:void(0)">
                                                    Braid
                                                </a>
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
            ) : (
                <div className="loading-spinner">
                    <div className="spinner-border text-dark" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetail;
