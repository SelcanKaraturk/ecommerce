import React, { use, useEffect, useState } from "react";
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
import { getSizeOptions, groupVariantsByColor } from "../../services/Helper";

function ProductDetail() {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const { slug, category } = useParams();
    const { accessToken } = useAuth();
    const [selectedVariant, setSelectedVariant] = useState();
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState();
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");
    const [err, setErr] = useState(null);
    const [colorError, setColorError] = useState(false);

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

    useEffect(() => {
        if (product) {
            const availableSizes = getSizeOptions(product.variants);
            setSizes(availableSizes);
            setSelectedSize(availableSizes[0]);
            //console.log("Available sizes:", availableSizes);
            const grouped = groupVariantsByColor(product.variants);
            //console.log("Grouped variants by color:", grouped);
            const availableColors = Object.keys(grouped).filter(color => Array.isArray(grouped[color]) && grouped[color].length > 0);
            setColors(availableColors);
            if (availableColors.length === 1) {
                setSelectedColor(availableColors[0]);
            }
        }
    }, [product]);

    useEffect(() => {
        if (selectedColor) {
            console.log("Selected color changed:", selectedColor);
            console.log("selected size:", selectedSize);
        }
    }, [selectedColor]);

    const setError = (msg) => {
        setErr(msg);
        //     setTimeout(() => {
        //         setErr(null);
        //     }, 40000);
    };



    // console.log("ProductDetail render", product);
    // console.log("category render", category);
    // console.log("slug render", slug);
    // console.log("colors render", colors);

    const radioColorChange = (event, newValue) => {
        if (newValue !== null) {
            setSelectedColor(newValue);
        } else {
            setSelectedColor("");
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

    useEffect(() => {
        setSelectedVariant({ color: selectedColor, size: selectedSize });
    }, [selectedColor, selectedSize]);

    useEffect(() => {
        console.log(selectedVariant);
    }, [selectedVariant]);

    const selectSizeChange = (val) => {
        const { value } = val;
        setSelectedSize(value);
    };
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
                                <h2></h2>
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
                    <div className="sp-area mb-5">
                        <div className="container-fluid">
                            <div className="sp-nav">
                                <div className="row gap-5">
                                    {product?.product_images.length > 0 && (
                                        <div className="col-lg-4 col-md-4">
                                            <ProductDetailImages
                                                images={product.product_images}
                                            />
                                        </div>
                                    )}
                                    <div className="col-lg-5 col-md-5">
                                        <div className="sp-content">
                                            <div className="sp-heading">
                                                <h5>
                                                    {product?.product_name}
                                                </h5>
                                            </div>
                                            <span className="reference">

                                                {product?.product_content?.replace(/<[^>]+>/g, '')}
                                            </span>

                                            <div className="sp-essential_stuff mt-3">
                                                <ul>
                                                    <li>
                                                        {product?.product_discount ? (<>
                                                            <span className="old-price">{product?.product_price.toLocaleString("tr-TR", {
                                                                minimumFractionDigits: 2,
                                                            })}</span>
                                                            <span className="ms-2">{(product?.product_price - (product?.product_discount / 100) * product?.product_price).toLocaleString("tr-TR", {
                                                                minimumFractionDigits: 2,
                                                            })}</span>
                                                        </>) : (product?.product_price.toLocaleString("tr-TR", {
                                                            minimumFractionDigits: 2,
                                                        }))}
                                                        ₺
                                                    </li>
                                                </ul>
                                            </div>
                                            {product?.variants[0]?.size && (
                                                <div className="product-size_box d-flex">
                                                    <span className="fw-bold">Ölçü :</span>
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
                                                        options={sizes && sizes.map(size => ({ value: size, label: size }))}
                                                        onChange={selectSizeChange}
                                                    />
                                                </div>
                                            )}

                                            {err && (
                                                <div className="text-danger mt-3" style={{ fontSize: '13px' }}>
                                                    <span dangerouslySetInnerHTML={{ __html: err }} />
                                                </div>
                                            )}

                                            {Array.isArray(colors) && colors.length > 0 && (
                                                <div className="product-size_box">
                                                    <div
                                                        style={colorError ? {
                                                            border: '1px solid #ffa6a6',
                                                            width: 'fit-content',
                                                            paddingRight: '5px',
                                                        } : {}}
                                                    >
                                                        <ToggleButtonGroup
                                                            value={selectedColor}
                                                            exclusive
                                                            onChange={radioColorChange}
                                                            sx={{
                                                                display: "flex",
                                                                gap: 2,
                                                            }}
                                                        >
                                                            {colors.map((color) => (
                                                                <div className={`color-wrap pe-2 ${color}`} key={color}>
                                                                    <ToggleButton
                                                                        value={color}
                                                                        aria-label="left aligned"
                                                                    >
                                                                        <img
                                                                            src={`/assets/images/color/${color === "Beyaz Altın"
                                                                                ? "metalic.png"
                                                                                : color === "Gold"
                                                                                    ? "gold.png"
                                                                                    : "rose.png"
                                                                                }`}
                                                                            alt={color}
                                                                        />
                                                                    </ToggleButton>
                                                                    <span>{color}</span>
                                                                </div>
                                                            ))}
                                                        </ToggleButtonGroup>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="qty-btn_area">
                                                <ul>
                                                    <li>
                                                        {product && (
                                                            <CartButton
                                                                product={
                                                                    product
                                                                }
                                                                variant={
                                                                    selectedVariant
                                                                }
                                                                setError={setError}
                                                                slug={slug}
                                                                onColorErrorChange={setColorError}
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
