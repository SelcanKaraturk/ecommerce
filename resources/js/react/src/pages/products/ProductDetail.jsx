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
import { getSizeOptions, groupVariantsByColor, toTurkishTitleCase } from "../../services/Helper";
import NotFound from "../NotFound";

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
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                let res;

                res = await getSingleProduct(
                    category,
                    slug,
                    accessToken
                );

                const { data } = res.data;

                if (res.data.status === 'success') {
                    console.log("Fetched product-detail data:", data);
                    setProduct({ ...data, category: category });
                    setLoading(false);
                }

            } catch (error) {
                setLoading(false);
                console.log(error);
                setProduct(null);
                setNotFound(error.response?.status === 404);
            }
        }
        fetchData();
    }, [slug, category, accessToken]);

    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            // Sayfanın ilk açılışında ilk varyantı ayarla
            const firstVariant = product.variants[0];
            setSelectedVariant(firstVariant);
            setSelectedColor(firstVariant.color);
            setSelectedSize(firstVariant.size);

            // İlk renk için size'ları al
            const variantsForFirstColor = product.variants.filter(v => v.color === firstVariant.color);
            const availableSizes = getSizeOptions(variantsForFirstColor, product.allow_out_of_stock_cart);
            setSizes(availableSizes);

            const grouped = groupVariantsByColor(product.variants);
            const availableColors = Object.keys(grouped).filter(color => Array.isArray(grouped[color]) && grouped[color].length > 0);
            setColors(availableColors);
        }
        console.log("Product updated:", product);
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

    const parentCategory = product?.categories?.find(cat => cat.parent_id === 4);
    const displayedPrice = selectedVariant?.calculated_price ?? product?.calculated_price;
    const displayedPriceWithoutDiscount = selectedVariant?.calculated_price_without_discount
        ?? product?.calculated_price_without_discount;

    // selectedVariant undefined ise, selectedColor ve selectedSize ile obje oluştur
    const variantToSend = selectedVariant || { color: selectedColor, size: selectedSize };

    const selectColorChange = (val) => {
        const { value } = val;
        setSelectedColor(value);
        
        // Seçili renge göre ölçüleri filtrele
        if (product?.variants) {
            const variantsForColor = product.variants.filter(v => v.color === value);
            const sizesForColor = getSizeOptions(variantsForColor, product.allow_out_of_stock_cart);
            setSizes(sizesForColor);
            // İlk ölçüyü seç
            if (sizesForColor.length > 0) {
                setSelectedSize(sizesForColor[0]);
            }
        }
    }

    const changeWishStatue = (e) => {
        setProduct((prev) => ({
            ...prev,
            in_wishlist: e
        }));
    };

    useEffect(() => {
        const variant = product?.variants?.find(
            item => item.color === selectedColor && String(item.size ?? "") === String(selectedSize ?? "")
        );
        setSelectedVariant(variant);
    }, [product, selectedColor, selectedSize]);

    useEffect(() => {
        console.log("selected variant", selectedVariant);
    }, [selectedVariant]);

    if (notFound) {
        return <NotFound />;
    }

    const selectSizeChange = (val) => {
        const { value } = val;
        setSelectedSize(value);
        console.log("selected size", value);
    };

    return (
        <>
            {!loading ? (
                <>

                    {/* <!-- Begin Hiraola's Single Product Area --> */}
                    <div className="sp-area mb-5">
                        <div className="container-fluid">
                            <div className="sp-nav">
                                <div className="row">
                                    {product?.product_images.length > 0 && (
                                        <div className="col-lg-6 col-md-6">
                                            <ProductDetailImages
                                                images={product.product_images}
                                            />
                                        </div>
                                    )}
                                    <div className="col-lg-4 col-md-4">
                                        <div className="sp-content">
                                            {!!product?.is_new && (
                                                <div className="sp-heading mb-2">
                                                    <span className="sp-sub-heading">
                                                        YENİ
                                                    </span>
                                                </div>
                                            )}
                                            {parentCategory && (
                                                <div className="sp-heading">
                                                    <h6>
                                                        {toTurkishTitleCase(parentCategory?.name) + " KOLEKSİYONU" || ""}
                                                    </h6>
                                                </div>
                                            )}
                                            <div className="sp-heading">
                                                <h2>
                                                    {product?.product_name}
                                                </h2>
                                            </div>
                                            <div className="sp-essential_stuff mb-2">
                                                {displayedPrice != null && (
                                                    <ul>
                                                        <li>
                                                            {displayedPriceWithoutDiscount ? (<>
                                                                <span className="old-price">{displayedPriceWithoutDiscount.toLocaleString("tr-TR", {
                                                                    minimumFractionDigits: 2,
                                                                })} ₺</span>
                                                                <span>{displayedPrice.toLocaleString("tr-TR", {
                                                                    minimumFractionDigits: 2,
                                                                })} ₺</span>
                                                            </>) : (
                                                                <span>{displayedPrice.toLocaleString("tr-TR", {
                                                                    minimumFractionDigits: 2,
                                                                })} ₺</span>
                                                            )}
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                            <div></div>
                                            <span className="reference">

                                                {product?.product_content?.replace(/<[^>]+>/g, '')}
                                            </span>

                                            <div className="product-specs">
                                                <div className="product-specs__title">
                                                    ÜRÜN ÖZELLİKLERİ
                                                </div>
                                                <div className="product-specs__list">
                                                    <div className="product-specs__row">
                                                        <span className="product-specs__label">Ayar</span>
                                                        <span className="product-specs__value">
                                                            {product?.inventory_carat ? `${product.inventory_carat} Ayar` : 'Belirtilmedi'}
                                                        </span>
                                                    </div>
                                                    <div className="product-specs__row">
                                                        <span className="product-specs__label">Renk</span>
                                                        {Array.isArray(colors) && colors.length > 0 ? (
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                value={
                                                                    selectedColor && {
                                                                        value: selectedColor,
                                                                        label: selectedColor,
                                                                    }
                                                                }
                                                                isSearchable={true}
                                                                name="color"
                                                                options={colors && colors.map(color => ({ value: color, label: color }))}
                                                                onChange={selectColorChange}
                                                            />
                                                        ) : (
                                                            <span className="product-specs__value">
                                                                {selectedColor || 'Belirtilmedi'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="product-specs__row product-specs__row--divider">
                                                        <span className="product-specs__label">Ürün Ağırlığı</span>
                                                        <span className="product-specs__value">
                                                            {selectedVariant?.weight != null ? `${Number(selectedVariant.weight).toFixed(2)} gr (±3%)` : 'Stokta Yok'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {!!product?.variants[0]?.size && sizes.length > 0 && (
                                                <div className="product-size_box d-flex" style={{ marginTop: 8 }}>
                                                    <span className="fw-bold">Beden</span>
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

                                            {!!product?.allow_out_of_stock_cart && !selectedVariant && (
                                                <div className="small-text mt-2" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #b8924a' }}>
                                                    ✨ <strong>Size Özel Tasarlanır</strong><br />
                                                    Seçtiğiniz ölçü ve renkte ürününüzü sizin için özel olarak üretiyoruz. <strong>Siparişinizi oluşturun, üretim sürecini biz üstlenelim.</strong>
                                                </div>
                                            )}

                                            <div className="qty-btn_area">
                                                <ul>
                                                    <li>
                                                        {(product && displayedPrice != null) || product?.allow_out_of_stock_cart ? (
                                                            <CartButton
                                                                product={
                                                                    product
                                                                }
                                                                variant={
                                                                    variantToSend
                                                                }
                                                                setError={setError}
                                                                slug={slug}
                                                                onColorErrorChange={setColorError}
                                                            />
                                                        ) : (
                                                            <a
                                                                role="button"
                                                                className="qty-cart_btn"

                                                            >
                                                                <i className="ion-bag d-inline" />
                                                                <span style={{ marginLeft: 8 }}>WhatsApp </span>
                                                            </a>
                                                        )}
                                                    </li>
                                                    <li>
                                                        <a role="button" className="quick-buy-btn">
                                                            Hemen Satın Al
                                                        </a>
                                                    </li>
                                                </ul>
                                                <ul className="icon-btns mt-4">
                                                    <li>
                                                        {product && (
                                                            <WishlistButton
                                                                productObj={{
                                                                    product_slug: product?.product_slug,
                                                                    price: product?.product_price,
                                                                    in_wishlist: product?.in_wishlist,
                                                                }}
                                                                changeWishStatue={changeWishStatue}
                                                                btnText={product?.in_wishlist ? "Favoriden Çıkar" : "Favoriye Ekle"}
                                                            />
                                                        )}
                                                    </li>
                                                    <li>
                                                        <a role="button" className="">
                                                            <i className="ion-android-share-alt d-inline" />
                                                            Paylaş
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-2"></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="hiraola-product-tab_area-4">
                                            <div className="container-fluid">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="product-tab justify-content-start">
                                                            <div className="hiraola-tab_title">
                                                                <h5 className="">BUNLARI DA BEĞENEBİLİRSİNİZ</h5>

                                                            </div>

                                                        </div>
                                                        <div className="tab-content hiraola-tab_content">
                                                            <div>
                                                                <div className="hiraola-product-tab_slider-2 row">

                                                                    <div className="col slide-item">
                                                                        <div className="single_product h-100">
                                                                            <div className="product-img">
                                                                                <a href="single-product.html">
                                                                                    <img className="primary-img" src="assets/images/collections/special_design.png" alt="Özel Tasarım Mücevher" />
                                                                                </a>

                                                                            </div>
                                                                            <div className="hiraola-product_content">
                                                                                <div className="product-desc_info">
                                                                                    <h6>
                                                                                        <a className="product-name" href="single-product.html">
                                                                                            ÖZEL TASARIM
                                                                                        </a>
                                                                                    </h6>
                                                                                </div>
                                                                            </div>
                                                                            <a href="shop-left-sidebar.html" className="btn_collection">
                                                                                <span>
                                                                                    KEŞFET
                                                                                </span>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
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
            )
            }
        </>
    );
}

export default ProductDetail;
