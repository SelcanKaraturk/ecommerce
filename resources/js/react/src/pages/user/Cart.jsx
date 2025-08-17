import React, { useState, useEffect } from "react";
import { destroyCart, updateCartQuantity } from "../../services/WebService";
import { useAuth } from "../../services/AuthContex";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../layouts/GeneralComponents/Loading";
import {CircularProgress} from "@mui/material";
import ModalShow from "../../layouts/GeneralComponents/ModalShow";

function Cart() {
    const { accessToken, setCart, cart, setMiniCart,setOpenModal } = useAuth();
    const [load, setLoad] = useState(false);
    const [deleteLoadId, setDeleteLoadId] = useState(null);
    const [cargo, setCargo] = useState(0);
    const navigate = useNavigate();


    const totalCoast = (price, quantity) => {
        const coast = price * quantity;
        return `${coast.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
        })} ₺`;
    };
    const updateQuantity = (product, type, preQuantity) => {
        console.log(product);
        if (type === "inc" && product.stock === 0) {
            setOpenModal(<>✨ Seçtiğiniz ürün şu anda stoklarımızda bulunmamaktadır, sizin için özel olarak hazırlanacaktır. <br/>
                📦 Daha fazla adet sipariş etmek isterseniz, ekibimizle WhatsApp üzerinden memnuniyetle iletişime geçebilirsiniz.</>);
        } else if (type === "inc" && preQuantity + 1 > product.stock) {
            setOpenModal(<>✨ Seçtiğiniz üründe daha fazla stok yoktur. <br/>
                📦 Daha fazla adet sipariş etmek isterseniz, ekibimizle WhatsApp üzerinden memnuniyetle iletişime geçebilirsiniz.</>);
        } else {
            const newQty =
                type === "inc"
                    ? preQuantity + 1
                    : preQuantity > 1
                    ? preQuantity - 1
                    : 1;
            setCart((prevList) =>
                prevList.map((item) =>
                    item.product_number === product.product_number &&
                    item.stock_number === product.stock_number
                        ? { ...item, quantity: newQty }
                        : item
                )
            );
            if(accessToken){
                updateUserQuantity(product, newQty)
            }
        }
    };
    const updateUserQuantity = async(cart, quantity)=>{
        try {
            const {data} = await updateCartQuantity(cart, quantity, accessToken);
            if(data.error){
                toast.error(data.message);
            }else if(data.status === 'success'){
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const subTotal = (cart) => {
        return cart.reduce((total, item) => {
            return total + item.quantity * item.product_price;
        }, 0);
    };

    const handleCheckout = () => {
        navigate("/tr/checkout");
    };

    const goBackDetail = (item) => {
        navigate(`/tr/${item.category_slug}/${item.product_slug}`, {
            state: {
                color_state: item.color,
                size: item.size,
            },
        });
    };

    const deleteCart = async (product) => {
        setDeleteLoadId(`${product.product_number}-${product.stock_number}`);

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
                setCart(
                    cart.filter(
                        (i) =>
                            !(
                                i.stock_number === product.stock_number &&
                                i.product_number === product.product_number
                            )
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
                <>
                    {/* <!-- Begin Hiraola's Cart Area --> */}
                    <div className="hiraola-cart-area">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-9">
                                    <form action="javascript:void(0)">
                                        <div className="table-content">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="total-count">
                                                            {cart?.length > 0
                                                                ? `Sepetinizde (${cart.length}) ürün var`
                                                                : "Sepetinizde ürün bulunmamaktadır"}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cart?.length > 0 &&
                                                        cart.map(
                                                            (item, index) => (
                                                                <tr
                                                                    key={`${index}-${item.product_number}`}
                                                                >
                                                                    <td className="hiraola-product-remove">
                                                                        {deleteLoadId ===
                                                                        `${item.product_number}-${item.stock_number}` ? (
                                                                            <CircularProgress size="sm" />
                                                                        ) : (
                                                                            <a
                                                                                onClick={() =>
                                                                                    deleteCart(
                                                                                        item
                                                                                    )
                                                                                }
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
                                                                            <img
                                                                                src={
                                                                                    item
                                                                                        .product_images[0]
                                                                                }
                                                                                alt={
                                                                                    item.product_name
                                                                                }
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td className="hiraola-product-name">
                                                                        <a
                                                                            className="click"
                                                                            onClick={() =>
                                                                                backDetail(
                                                                                    item
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                item.product_name
                                                                            }
                                                                        </a>
                                                                    </td>

                                                                    <td className="hiraola-product-name">
                                                                        <span>
                                                                            {
                                                                                item.color
                                                                            }
                                                                        </span>
                                                                    </td>

                                                                    <td className="hiraola-product-name">
                                                                        <span>
                                                                            {
                                                                                item.size
                                                                            }
                                                                        </span>
                                                                    </td>

                                                                    <td className="quantity">
                                                                        <label>
                                                                            Miktar
                                                                        </label>
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
                                                                        <span className="amount">
                                                                            {totalCoast(
                                                                                item.product_price,
                                                                                item.quantity
                                                                            )}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                </tbody>
                                            </table>
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
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </div>
                                {cart?.length > 0 && (
                                    <div className="col-md-3">
                                        <div className="cart-page-total">
                                            <h2>Sepet Toplamı</h2>
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
                                                        )}
                                                    </span>
                                                </li>
                                                <li>
                                                    Kargo
                                                    <span
                                                        style={{
                                                            color: "#67c36c",
                                                        }}
                                                    >
                                                        Kargo Bedava
                                                    </span>
                                                </li>
                                                <li className="d-flex justify-content-between">
                                                    <span className="fw-bolder">
                                                        Toplam
                                                    </span>
                                                    <span className="fw-bolder">
                                                        {(
                                                            subTotal(cart) +
                                                            cargo
                                                        ).toLocaleString(
                                                            "tr-TR",
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </span>
                                                </li>
                                            </ul>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCheckout();
                                                }}
                                            >
                                                Sepeti Onayla
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <!-- Hiraola's Cart Area End Here --> */}

                    <ModalShow/>

                </>
            )}
        </>
    );
}

export default Cart;
