import React, { useState, useEffect } from "react";
import { destroyCart, matchCart, updateCartQuantityService, updateCartCookieQuantityService, matchCartForUser } from "../../services/WebService";
import { useAuth } from "../../services/AuthContex";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../layouts/GeneralComponents/Loading";
import { CircularProgress } from "@mui/material";
import ModalShow from "../../layouts/GeneralComponents/ModalShow";
import useForm from "../../services/hooks/useForm";
import { KeyboardBackspace, KeyboardArrowRightRounded, WhatsApp } from "@mui/icons-material";

const StockAlert = ({ item }) => {
    let icon, text;
    if (item.stock_status === "in_stock") {
        icon = "fa-check-circle";
        text = "Bu ürün stokta! Hızlı teslimat ile kapınızda.";
    } else if (item.stock === 0 && item.allow_out_of_stock_cart) {
        icon = "fa-gem";
        text = <>Bu ürün stoklarımızda tükenmiştir ancak siparişiniz üzerine <strong>size özel üretilecektir</strong>. Tahmini teslimat süresi: <strong>{item.delivery_days || 10} gün</strong>.</>;
    } else if (item.allow_out_of_stock_cart) {
        icon = "fa-exclamation-circle";
        text = <>Bu ürünün stok dışı üretimi mevcuttur. Sipariş oluşturarak size özel üretim talebinde bulunabilirsiniz. Tahmini teslimat süresi: <strong>{item.delivery_days || 10} gün</strong>.</>;
    } else {
        icon = "fa-exclamation-triangle";
        text = "Ürün Tükenmiştir. Toptan alımlar için WhatsApp üzerinden bizimle iletişime geçebilirsiniz.";
    }
    return (
        <div className="alert d-flex align-items-center mb-0" role="alert" style={{ fontSize: '13px', padding: '8px 12px' }}>
            <i className={`fa ${icon} me-2`}></i>
            <span>{text}</span>
        </div>
    );
};

function Cart() {
    const { accessToken, setCart, cart, setMiniCart, setOpenModal } = useAuth();
    const { totalCost, subTotal } = useForm();
    const [load, setLoad] = useState(true);
    const [deleteLoadId, setDeleteLoadId] = useState(null);
    const [cargo, setCargo] = useState(0);
    const [cartMatched, setCartMatched] = useState(null);
    const navigate = useNavigate();

    // Localdeki cart verisinin güncellenmesi için böylece tükenmiş ürünler sepetten çıkarılır
    useEffect(() => {
        if (!cartMatched && cart && cart.length > 0) {
            const matchCartData = async () => {
                try {
                    let data;
                    if (accessToken) {
                        // Login olan kullanıcılar için yeni fonksiyon
                        const response = await matchCartForUser(accessToken);
                        console.log("matchCartForUser run:", response);
                        data = response.data;
                    } else {
                        // Login olmayanlar için eski fonksiyon
                        const response = await matchCart(cart);
                        console.log("matchCart for guest run:");
                        data = response.data;
                        console.log("Matched cart for guest:", data);
                    }
                    if (data && data.items) {
                        console.log("Matched cart data:", data);
                        setCart(data.items);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setCartMatched(true);
                    setLoad(false);
                }
            };
            matchCartData();
        } else if (Array.isArray(cart) && cart.length === 0) {
            setCartMatched(false);
            //setLoad(false);
        }
    }, [cart, accessToken]);

    useEffect(() => {
        if (cartMatched) {
            setLoad(false);
            console.log("Cart matched, loading set to false");
        } else {
            if (cart && cart.length > 0) {
                setLoad(true);
            } else {
                setLoad(false);
            }
        }
    }, [cartMatched]);

    const updateQuantity = (product, type, preQuantity) => {
        console.log(product);
        if (product.stock_status === "no_stock" && !product.allow_out_of_stock_cart) {
            setOpenModal(<>✨Seçtiğiniz ürün stoklarımızda bulunmamakta ve tekli alımlarda özel üretim yapılamamaktadır. Toptan siparişiniz için lütfen <b> WhatsApp </b> üzerinden bizimle iletişime geçiniz.</>);
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 1.5 saniye sonra sayfa yenile
            return;
        }

        const newQty =
            type === "inc"
                ? preQuantity + 1
                : preQuantity > 1
                    ? preQuantity - 1
                    : 1;
        console.log("New quantity:", newQty, "Previous quantity:", preQuantity, accessToken);
        if (newQty === preQuantity) {
            return;
        }
        if (product.stock && product.stock < newQty && !product.allow_out_of_stock_cart) {
            setOpenModal(<>Seçtiğiniz ürün için mevcut stok adedinden daha fazla sipariş verilememektedir. Toptan alımlarınız için lütfen <b> WhatsApp </b> üzerinden bizimle iletişime geçiniz.</>);
            return;
        }
        if (product.stock_status === "no_stock" && product.allow_out_of_stock_cart && newQty > 5) {
            setOpenModal(<>✨Seçtiğiniz üründen 5 adetten fazla sipariş verilememektedir. Toptan siparişiniz ve avantajlı fiyatlardan yararlanmak için lütfen <b> WhatsApp </b> üzerinden bizimle iletişime geçiniz.</>);
            return;
        }
        if (product.stock_status === "in_stock" && product.allow_out_of_stock_cart && (newQty - product.stock) > 5) {
            setOpenModal(<>✨Seçtiğiniz üründen {(product.stock)} adet vardır. Stok dışı üretebileceğiniz adet en fazla 5 tir. Toptan siparişiniz ve avantajlı fiyatlardan yararlanmak için lütfen <b> WhatsApp </b> üzerinden bizimle iletişime geçiniz.</>);
            return;
        }
        if (accessToken) {
            updateCartQuantity(product, newQty);
        } else {
            updateCartCookieQuantity(product, newQty);
        }
    };

    // useEffect(() => {
    //     console.log("Cart updated new:", cart);
    // }, [cart]);

    const updateCartQuantity = async (product, quantity) => {
        try {
            const { data } = await updateCartQuantityService(product, quantity, accessToken);
            if (data.status === 'error') {
                toast.error(data.message);
            } else if (data.status === 'success') {
                setCart((prevList) =>
                    prevList.map((item) =>
                            item.product_slug === product.product_slug &&
                            item.color === product.color &&
                            item.size === product.size
                            ? { ...item, quantity: quantity }
                            : item
                    )
                );
                // toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateCartCookieQuantity = async (product, quantity) => {
        try {
            const { data } = await updateCartCookieQuantityService(product, quantity);
            console.log("updateCartCookieQuantity response:");
            console.log(data);
            if (data.status === 'error') {
                toast.error(data.message);
            } else if (data.status === 'success') {
                setCart((prevList) =>
                    prevList.map((item) =>
                        item.product_slug === data.cartItem.product_slug &&
                            item.color === data.cartItem.color &&
                            item.size === data.cartItem.size
                            ? { ...item, quantity: data.cartItem.quantity }
                            : item
                    )
                );
                //toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const totalGain = (cart) => {
        return cart
            .filter((item) => !((item.stock === 0 || item.stock === null) && !item.allow_out_of_stock_cart))
            .reduce((total, item) => {
                return item.calculated_price_without_discount ? total + ((item.calculated_price_without_discount - item.calculated_price) * item.quantity) : total;
            }, 0);
    };


    const goBackDetail = (item) => {
        navigate(`/tr/${item.product_slug}`, {
            state: {
                color_state: item.color,
                size: item.size,
            },
        });
    };

    const deleteCart = async (product) => {
        setDeleteLoadId(`${product.product_slug}-${product.color}-${product.size}`);

        try {
            const { data } = await destroyCart(
                product,
                accessToken || undefined
            );

            if (data.status === "error") {
                toast.error(data.message);
                return;
            }

            if (data.status === "success") {
                setCart((prevList) =>
                    prevList.filter(
                        (item) => !(item.product_slug === product.product_slug && item.color === product.color && item.size === product.size)
                    )
                );
                toast.success(data.message);
            }
        } catch (error) {
            console.error(error);
        }
        setDeleteLoadId(null);
    };

    return (
        <>
            {load ? (
                <Loading />
            ) : (

                cartMatched === true ? (<>
                    <div className="hiraola-cart-area">
                        <div className="container-fluid">
                            <div className="row mb-3">
                                <div className="col-6">
                                    <h1 className="cart-page-title">SEPETİM</h1>
                                    <div className="section-divider">
                                        <span></span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-end" style={{ marginTop: '8px' }}>
                                        <Link to="/" className="continue-shopping" style={{
                                            fontSize: '16px',
                                            textDecoration: 'none'
                                        }}>
                                            <KeyboardBackspace sx={{ color: '#b8924a' }} /> Alışverişe Devam Et
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-8">
                                    <form action="javascript:void(0)">
                                        <div className="table-content">
                                            <div className="total-count">
                                                {cart?.length > 0
                                                    && `Sepetinizde (${cart.length}) ürün var`
                                                }
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '40px' }}></th>
                                                            <th style={{ width: '120px' }}>ÜRÜN</th>
                                                            <th>ÜRÜN ADI</th>
                                                            <th style={{ width: '100px' }}>RENK</th>
                                                            <th style={{ width: '100px' }}>BEDEN</th>
                                                            <th style={{ width: '130px' }}>MİKTAR</th>
                                                            <th style={{ width: '120px' }}>FİYAT</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cart?.length > 0 &&
                                                            cart.map(
                                                                (item, index) => (
                                                                    <React.Fragment key={`${item.product_slug}-${item.color}-${item.size || index}`}>
                                                                        <tr
                                                                        >
                                                                            <td className="hiraola-product-remove">
                                                                                {deleteLoadId ===
                                                                                    `${item.product_slug}-${item.color}-${item.size}` ? (
                                                                                    <CircularProgress size={20} />
                                                                                ) : (
                                                                                    <a
                                                                                        onClick={() =>
                                                                                            deleteCart(
                                                                                                item
                                                                                            )
                                                                                        }
                                                                                        alt="Sil"
                                                                                    >
                                                                                        <i
                                                                                            className="fa fa-trash"
                                                                                            title="Remove"
                                                                                        ></i>
                                                                                    </a>
                                                                                )}
                                                                            </td>
                                                                            <td className="hiraola-product-thumbnail">
                                                                                <a
                                                                                    className="click"
                                                                                    onClick={() =>
                                                                                        goBackDetail(
                                                                                            item
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {Array.isArray(item?.product_images) && item.product_images[0] ? (
                                                                                        <img
                                                                                            src={`/storage/${item.product_images[0]}`}
                                                                                            alt={item.product_name}
                                                                                        />
                                                                                    ) : ''}
                                                                                </a>
                                                                            </td>
                                                                            <td className="hiraola-product-name">
                                                                                <a
                                                                                    className="click"
                                                                                    onClick={() =>
                                                                                        goBackDetail(
                                                                                            item
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {item.product_name}
                                                                                </a>
                                                                            </td>

                                                                            <td className="product-color">
                                                                                <span>
                                                                                    {
                                                                                        item.color
                                                                                    }
                                                                                </span>
                                                                            </td>

                                                                            <td className="product-size">
                                                                                <span>
                                                                                    {
                                                                                        item.size
                                                                                    }
                                                                                </span>
                                                                            </td>

                                                                            <td className="quantity">
                                                                                <div className="cart-plus-minus">
                                                                                    <input
                                                                                        className="cart-plus-minus-box"
                                                                                        type="text"
                                                                                        value={
                                                                                            item.quantity
                                                                                        }
                                                                                        readOnly
                                                                                    />
                                                                                    <div
                                                                                        className="dec qtybutton"
                                                                                        onClick={() =>
                                                                                            updateQuantity(
                                                                                                item,
                                                                                                "dec",
                                                                                                item.quantity
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <i className="ion-minus-round"></i>
                                                                                    </div>
                                                                                    <div
                                                                                        className="inc qtybutton"
                                                                                        onClick={() =>
                                                                                            updateQuantity(
                                                                                                item,
                                                                                                "inc",
                                                                                                item.quantity
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <i className="ion-plus-round"></i>
                                                                                    </div>
                                                                                </div>

                                                                            </td>
                                                                            <td className="product-subtotal">
                                                                                {!((item.stock === 0 || item.stock === null) && !item.allow_out_of_stock_cart) && (<>
                                                                                    <p>
                                                                                        {item.calculated_price_without_discount && (
                                                                                            <span className="amount old">
                                                                                                {(item.calculated_price_without_discount * item.quantity).toLocaleString(
                                                                                                    "tr-TR",
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                    }
                                                                                                )} ₺
                                                                                            </span>
                                                                                        )}
                                                                                    </p>
                                                                                    <span className="amount">
                                                                                        {(item.calculated_price * item.quantity).toLocaleString(
                                                                                            "tr-TR",
                                                                                            {
                                                                                                minimumFractionDigits: 2,
                                                                                            }
                                                                                        )} ₺
                                                                                    </span>
                                                                                </>)}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="stock-status-row">
                                                                            <td colSpan="7" style={{ borderBottom: '1px solid #e8e1d9', paddingTop: '10px', paddingBottom: '10px' }}>
                                                                                <StockAlert item={item} />
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>)
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {cart?.length > 0 && (
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="coupon-all">
                                                        <div className="coupon">
                                                            <input
                                                                id="coupon_code"
                                                                className="input-text"
                                                                name="coupon_code"
                                                                placeholder="İndirim Kodu"
                                                                type="text"
                                                            />
                                                            <input
                                                                className="button"
                                                                name="apply_coupon"
                                                                type="submit"
                                                                value="UYGULA"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </div>
                                {cart?.length > 0 && (
                                    <div className="col-lg-4">
                                        <div className="cart-page-total">
                                            <h2>SEPET ÖZETİ</h2>
                                            <ul>
                                                <li>
                                                    Ara Toplam{" "}
                                                    <span>
                                                        {subTotal(
                                                            cart
                                                        ).toLocaleString(
                                                            "tr-TR",
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )} ₺
                                                    </span>
                                                </li>
                                                <li>
                                                    Kargo
                                                    <span>
                                                        <span style={{
                                                            color: '#999',
                                                            textDecoration: 'line-through',
                                                            fontSize: '13px',
                                                            marginRight: '8px'
                                                        }}>
                                                            59,90 ₺
                                                        </span>
                                                        <span style={{ color: '#67c36c', fontWeight: '600' }}>
                                                            Ücretsiz
                                                        </span>
                                                    </span>
                                                </li>
                                                <li className="total-gain">
                                                    <span>Toplam Kazancınız</span>
                                                    <span>
                                                        {(
                                                            totalGain(cart)
                                                        ).toLocaleString(
                                                            "tr-TR",
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )} ₺
                                                    </span>
                                                </li>
                                                <li className="final-total">
                                                    <span>Toplam</span>
                                                    <span>
                                                        {(
                                                            subTotal(cart) +
                                                            cargo
                                                        ).toLocaleString(
                                                            "tr-TR",
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )} ₺
                                                    </span>
                                                </li>
                                            </ul>
                                            {cart[0].product_price > 0 ? (
                                                <Link
                                                    to="/tr/odeme"
                                                    className="checkout-btn"
                                                >
                                                    SEPETİ ONAYLA <KeyboardArrowRightRounded />
                                                </Link>
                                            ) : (<a
                                                role="button"
                                                className="qty-cart_btn"
                                                href="https://wa.me/1234567890"
                                                target="_blank"

                                            >
                                                <i className="ion-bag d-inline" />
                                                <span style={{ marginLeft: 8 }}>WhatsApp </span>
                                            </a>)}

                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Features Section */}
                            {cart?.length > 0 && (
                                <div className="row mt-5">
                                    <div className="col-12">
                                        <div className="features-section">
                                            <div className="feature-item">
                                                <div className="feature-icon">
                                                    <i className="fa fa-gem"></i>
                                                </div>
                                                <h4>ÖZEL ÜRETİM</h4>
                                                <p>Size özel tasarım<br />ve üretim</p>
                                            </div>
                                            <div className="feature-item">
                                                <div className="feature-icon">
                                                    <i className="fa fa-undo"></i>
                                                </div>
                                                <h4>KOLAY İADE</h4>
                                                <p>14 gün içinde<br />koşulsuz iade</p>
                                            </div>
                                            <div className="feature-item">
                                                <div className="feature-icon">
                                                    <i className="fa fa-shield-alt"></i>
                                                </div>
                                                <h4>GÜVENLİ ALIŞVERİŞ</h4>
                                                <p>256 bit SSL sertifikası ile<br />güvenli alışveriş</p>
                                            </div>
                                            <div className="feature-item">
                                                <div className="feature-icon">
                                                    <WhatsApp sx={{ width: 32, height: 33 }} />
                                                </div>
                                                <h4>WHATSAPP HATTI</h4>
                                                <p><a href="https://wa.me/yourwhatsapplink" target="_blank" rel="noopener noreferrer">WhatsApp üzerinden bize ulaşın</a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <ModalShow /></>
                ) : cartMatched === false ? (
                    <div className="checkout-area">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="text-center">
                                        <p className="fw-bold" style={{ fontSize: '18px', marginBottom: '20px' }}>
                                            Sepetiniz boş, ama fırsatlar dolu! <br /> Özel fırsatları kaçırmamak için alışverişe devam edin.
                                        </p>

                                        <button
                                            style={{
                                                background: '#b8924a',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '12px 32px',
                                                fontSize: '16px',
                                                cursor: 'pointer',
                                                marginTop: '0',
                                                fontWeight: '600'
                                            }}
                                            onClick={() => window.location.href = '/'}
                                        >
                                            Alışverişe Devam Et
                                        </button> <br />
                                        <img className="empty-card" src="/assets/images/fullCart.png" alt="Empty Cart" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>) : <Loading />
            )}
        </>
    );
}

export default Cart;
