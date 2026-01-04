import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./ProductDetail.css";
import "../../assets/js/plugins/jquery.elevateZoom-3.0.8.min";
import ProductDetailImages from "./ProductDetailImages";
import { getSingleProduct } from "../../services/WebService";
import { useAuth } from "../../services/AuthContex";
import WishlistButton from "../../layouts/GeneralComponents/WishlistButton";
import CartButton from "../../layouts/GeneralComponents/CartButton";
import Loading from "../../layouts/GeneralComponents/Loading";
import Select from "react-select";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { orderedOptions } from "../../services/Helper";

function ProductDetail() {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const { slug, category } = useParams();
    const { accessToken } = useAuth();
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedVariant, setSelectedVariant] = useState();
    const [selectedSize, setSelectedSize] = useState();
    const [options, setOptions] = useState(null);
    const location = useLocation();
    const { color_state, size } = location.state ?? {};

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                let res;
                if (category) {
                    res = await getSingleProduct(
                        category,
                        slug,
                        accessToken
                    );
                } else {
                    res = await getSingleProduct(
                        null,
                        slug,
                        accessToken
                    );
                }

                const { data } = res.data;
                console.log("Fetched product data:", data);
                setProduct({ ...data, category: category });
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
                setProduct();
            }
        }
        fetchData();
    }, []);
    console.log("ProductDetail render");
    console.log("category render", category);
    console.log("slug render", slug);

    // useEffect(() => {
    //     if (product && !selectedColor) {
    //         color_state
    //             ? setSelectedColor(color_state)
    //             : setSelectedColor(
    //                 product.grouped_stock_by_color?.[0]?.color ?? ""
    //             ); //product verisi gelince ilk başta gelen ilk rengi seç
    //     }
    //     if (product && !options) {
    //         //product verisi gelince ilk başta stock daki sizeları options olarak ekle
    //         const sizes = product.product_stock?.[0].color;
    //         const variant = product.product_stock.filter(
    //             (i) => i.color == sizes
    //         );
    //         const newOptions = variant.map((e) => ({
    //             value: e.size,
    //             label: e.size,
    //         }));
    //         setOptions(orderedOptions(newOptions)); //veriyi küçükten büyüğe sırala
    //     }
    //     console.log(product)
    // }, [product]);

    // useEffect(() => {
    //     if (options && !selectedSize) {
    //         size ? setSelectedSize(size) : setSelectedSize(options[3].value); //başlangıçta options dizisinin 3. öğesini ekle
    //     }
    // }, [options]);

    // const handleCartClick = (val) => {
    //     //sepete ekle tıklanınca product objesini güncelle
    //     setProduct((prev) => ({ ...prev, in_carts_exists: val.inCart }));
    // };

    const radioColorChange = (event, newValue) => {
        if (newValue !== null) {
            setSelectedColor(newValue);
        }
    };

    const changeWishStatue = (e) => {
        console.log(e);
        setProduct((prev) => ({
            ...prev,
            product_stock:
                prev.product_stock?.map((i) =>
                    i == selectedStock
                        ? { ...i, in_wishlist: e }
                        : i
                ) || [],
        }));
    };

    const color = ["Beyaz Altın", "Sarı", "Rose"];
    // useEffect(() => {
    //     if (product) {
    //         const variant =
    //             product.product_stock.find(
    //                 (i) => i.color === selectedColor && i.size == selectedSize
    //             ) ?? null;
    //         setSelectedVariant(variant);
    //         // console.log(product);
    //     }
    // }, [product, selectedColor, selectedSize]);

    // useEffect(() => {
    //     console.log(selectedVariant);
    // }, [selectedVariant]);

    // const selectSizeChange = (val) => {
    //     const { value } = val;
    //     setSelectedSize(value);
    // };
    // const selectedStock = product?.product_stock.find(
    //     (i) => i.color === selectedColor && i.size == 12
    // );
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
                                                images={product.product_images}
                                            />
                                        )}
                                    </div>
                                    <div className="col-lg-7 col-md-7">
                                        <div className="sp-content">
                                            <div className="sp-heading">
                                                <h5>
                                                    <a href="#">
                                                        {product?.product_name}
                                                    </a>
                                                </h5>
                                            </div>
                                            <span className="reference">

                                                {product?.product_content?.replace(/<[^>]+>/g, '')}
                                            </span>

                                            <div className="sp-essential_stuff mt-3">
                                                <ul>
                                                    <li>
                                                        {product?.product_price.toLocaleString(
                                                            "tr-TR",
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )}{" "}
                                                        ₺
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="product-size_box d-flex">
                                                <span>Ölçü :</span>
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    value={
                                                        selectedSize && {
                                                            value: selectedSize,
                                                            label: selectedSize,
                                                        }
                                                    }
                                                    isSearchable={true}
                                                    name="size"
                                                    options={options && options}
                                                // onChange={selectSizeChange}
                                                />
                                            </div>
                                            {/* {(!selectedVariant ||
                                                selectedVariant.stock == 0) && (
                                                    <div className="text-small">
                                                        *İstediğiniz ölçüde ürün
                                                        stoklarımızda mevcut
                                                        değildir. Sipariş vermeniz
                                                        halinde 1-7 iş günü
                                                        içerisinde size özel
                                                        üretilip tarafınıza gönderim
                                                        sağlanır.
                                                    </div>
                                                )} */}

                                            <div className="product-size_box">
                                                <div>
                                                    <ToggleButtonGroup
                                                        value={selectedColor}
                                                        exclusive
                                                        onChange={
                                                            radioColorChange
                                                        }
                                                        sx={{
                                                            display: "flex",
                                                            gap: 2,
                                                        }}
                                                    >
                                                        {product?.variants.map(
                                                            (item) => (
                                                                <div>
                                                                    <ToggleButton
                                                                        value={
                                                                            item.color
                                                                        }
                                                                        aria-label="left aligned"
                                                                    >
                                                                        <img
                                                                            src={`/src/assets/images/color/${item.color ==
                                                                                color[0]
                                                                                ? "metalic.png"
                                                                                : item.color ==
                                                                                    color[1]
                                                                                    ? "gold.png"
                                                                                    : "rose.png"
                                                                                }`}
                                                                            alt=""
                                                                        />
                                                                    </ToggleButton>
                                                                    <span>
                                                                        {
                                                                            item.color
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </ToggleButtonGroup>
                                                </div>
                                            </div>

                                            <div className="qty-btn_area">
                                                <ul>
                                                    <li>
                                                        {product && (
                                                            <CartButton
                                                                product={
                                                                    product
                                                                }
                                                                productVarient={
                                                                    selectedVariant
                                                                }
                                                            />
                                                        )}
                                                    </li>
                                                    <li>
                                                        {product && (
                                                            <WishlistButton
                                                                productObj={{
                                                                    product_number: product?.product_number,
                                                                    price: product?.product_price,
                                                                    // product_stock_id: selectedStock?.stock_number,
                                                                    // myWish: selectedStock?.in_wishlist,
                                                                }}
                                                                changeWishStatue={changeWishStatue}
                                                            />
                                                        )}
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
                <Loading />
            )}
        </>
    );
}

export default ProductDetail;
