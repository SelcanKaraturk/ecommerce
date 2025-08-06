import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../services/AuthContex";

function Checkout() {
    const {setMiniCart} = useAuth();
    const location = useLocation();
    const { cartList, totalPrice } = location.state ?? {};
    const [showCoupon, setShowCoupon] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const options = [{ value: "Türkiye", label: "Türkiye" }];

    useEffect(()=>{setMiniCart(false)},[])
    return (
        <>
            {/* <!-- Begin Hiraola's Checkout Area --> */}
            <div className="checkout-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="coupon-accordion">
                                <h3>
                                    <span id="showlogin">
                                        Login olmak için <em>tıklayın</em>
                                    </span>
                                </h3>
                                <div
                                    id="checkout-login"
                                    className="coupon-content"
                                >
                                    <div className="coupon-info">
                                        <p className="coupon-text">
                                            Quisque gravida turpis sit amet
                                            nulla posuere lacinia. Cras sed est
                                            sit amet ipsum luctus.
                                        </p>
                                        <form action="javascript:void(0)">
                                            <p className="form-row-first">
                                                <label>
                                                    Username or email{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input type="text" />
                                            </p>
                                            <p className="form-row-last">
                                                <label>
                                                    Password{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input type="text" />
                                            </p>
                                            <p className="form-row">
                                                <input
                                                    value="Login"
                                                    type="submit"
                                                />
                                                <label>
                                                    <input type="checkbox" />
                                                    Remember me
                                                </label>
                                            </p>
                                            <p className="lost-password">
                                                <a href="javascript:void(0)">
                                                    Lost your password?
                                                </a>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                                <h3>
                                    <span
                                        id="showcoupon"
                                        onClick={() =>
                                            setShowCoupon(!showCoupon)
                                        }
                                    >
                                        Kupon girmek için <em>tıklayın</em>
                                    </span>
                                </h3>
                                <div
                                    id="checkout_coupon"
                                    className={`coupon-checkout-content ${
                                        showCoupon ? "active" : ""
                                    }`}
                                >
                                    <div className="coupon-info">
                                        <form action="javascript:void(0)">
                                            <p className="checkout-coupon">
                                                <input
                                                    placeholder="Coupon code"
                                                    type="text"
                                                />
                                                <input
                                                    className="coupon-inner_btn"
                                                    value="Apply Coupon"
                                                    type="submit"
                                                />
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-12">
                            <form action="javascript:void(0)">
                                <div className="checkbox-form">
                                    <h3>Adresiniz</h3>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="country-select clearfix">
                                                <label>
                                                    Ülke{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    defaultValue={options[0]}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="wide"
                                                    options={options}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Ad{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    placeholder=""
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Soyad{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    placeholder=""
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label>Şirket</label>
                                                <input
                                                    placeholder="İsteğe Bağlı"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Adres{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    placeholder="Street address"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <input
                                                    placeholder="Apartman, daire vb."
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    İl{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    İlçe{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    placeholder=""
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Mahalle{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    placeholder=""
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Posta Kodu
                                                    {" (isteğe bağlı) "}
                                                </label>
                                                <input
                                                    placeholder=""
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Email{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    placeholder=""
                                                    type="email"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Phone{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list create-acc">
                                                <input
                                                    id="cbox"
                                                    type="checkbox"
                                                    onChange={(e) =>
                                                        setIsChecked(
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <label>
                                                    Create an account?
                                                </label>
                                            </div>
                                            <div
                                                id="cbox-info"
                                                className={`checkout-form-list create-account ${
                                                    isChecked ? "active" : ""
                                                }`}
                                            >
                                                <p>
                                                    Create an account by
                                                    entering the information
                                                    below. If you are a
                                                    returning customer please
                                                    login at the top of the
                                                    page.
                                                </p>
                                                <label>
                                                    Şifre Oluşturunuz{" "}
                                                    <span className="required">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    placeholder="password"
                                                    type="password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="different-address">
                                        <div className="ship-different-title">
                                            <h3>
                                                <label>
                                                    Ship to a different address?
                                                </label>
                                                <input
                                                    id="ship-box"
                                                    type="checkbox"
                                                />
                                            </h3>
                                        </div>
                                        <div id="ship-box-info" className="row">
                                            <div className="col-md-12">
                                                <div className="myniceselect country-select clearfix">
                                                    <label>
                                                        Country{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select className="nice-select wide">
                                                        <option data-display="Bangladesh">
                                                            Bangladesh
                                                        </option>
                                                        <option value="uk">
                                                            London
                                                        </option>
                                                        <option value="rou">
                                                            Romania
                                                        </option>
                                                        <option value="fr">
                                                            French
                                                        </option>
                                                        <option value="de">
                                                            Germany
                                                        </option>
                                                        <option value="aus">
                                                            Australia
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>
                                                        First Name{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>
                                                        Last Name{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>Company Name</label>
                                                    <input
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>
                                                        Address{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        placeholder="Street address"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <input
                                                        placeholder="Apartment, suite, unit etc. (optional)"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>
                                                        Town / City{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input type="text" />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>
                                                        State / County{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>
                                                        Postcode / Zip{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>
                                                        Email Address{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        placeholder=""
                                                        type="email"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="checkout-form-list">
                                                    <label>
                                                        Phone{" "}
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input type="text" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="order-notes">
                                            <div className="checkout-form-list checkout-form-list-2">
                                                <label>Order Notes</label>
                                                <textarea
                                                    id="checkout-mess"
                                                    cols="30"
                                                    rows="10"
                                                    placeholder="Notes about your order, e.g. special notes for delivery."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="your-order">
                                <h3>Sipariş Detayı</h3>
                                <div className="your-order-table table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="cart-product-name">
                                                    {cartList?.length > 1
                                                        ? "Ürünler"
                                                        : "Ürün"}
                                                </th>
                                                <th className="cart-product-total">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartList?.map((item, index) => (
                                                <tr
                                                    className="cart_item"
                                                    key={`${item.id}-${index}`}
                                                >
                                                    <td className="cart-product-name">
                                                        {item.product.name}{" "}
                                                        <strong className="product-quantity">
                                                            × {item.quantity}
                                                        </strong>
                                                    </td>
                                                    <td className="cart-product-total">
                                                        <span className="amount">
                                                            {(
                                                                item.product
                                                                    .price *
                                                                item.quantity
                                                            ).toLocaleString(
                                                                "tr-TR",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}{" "}
                                                            ₺
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="cart-subtotal">
                                                <th>Ara Toplam</th>
                                                <td>
                                                    <span className="amount">
                                                        {totalPrice.toLocaleString(
                                                            "tr-TR",
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )}{" "}
                                                        ₺
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="cart-subtotal">
                                                <th>Kargo</th>
                                                <td>
                                                    <span className="amount">
                                                        Kargo Bedava
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="order-total">
                                                <th>Ödenecek Tutar</th>
                                                <td>
                                                    <strong>
                                                        <span className="amount">
                                                            {totalPrice.toLocaleString(
                                                                "tr-TR",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}{" "}
                                                            ₺
                                                        </span>
                                                    </strong>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="payment-method">
                                    <div className="payment-accordion">
                                        <div id="accordion">
                                            <div className="card">
                                                <div
                                                    className="card-header"
                                                    id="#payment-1"
                                                >
                                                    <h5 className="panel-title">
                                                        <a
                                                            href="javascript:void(0)"
                                                            className=""
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapseOne"
                                                            aria-expanded="true"
                                                            aria-controls="collapseOne"
                                                        >
                                                            Direct Bank
                                                            Transfer.
                                                        </a>
                                                    </h5>
                                                </div>
                                                <div
                                                    id="collapseOne"
                                                    className="collapse show"
                                                    data-bs-parent="#accordion"
                                                >
                                                    <div className="card-body">
                                                        <p>
                                                            Make your payment
                                                            directly into our
                                                            bank account. Please
                                                            use your Order ID as
                                                            the payment
                                                            reference. Your
                                                            order won’t be
                                                            shipped until the
                                                            funds have cleared
                                                            in our account.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div
                                                    className="card-header"
                                                    id="#payment-2"
                                                >
                                                    <h5 className="panel-title">
                                                        <a
                                                            href="javascript:void(0)"
                                                            className="collapsed"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapseTwo"
                                                            aria-expanded="false"
                                                            aria-controls="collapseTwo"
                                                        >
                                                            Cheque Payment
                                                        </a>
                                                    </h5>
                                                </div>
                                                <div
                                                    id="collapseTwo"
                                                    className="collapse"
                                                    data-bs-parent="#accordion"
                                                >
                                                    <div className="card-body">
                                                        <p>
                                                            Make your payment
                                                            directly into our
                                                            bank account. Please
                                                            use your Order ID as
                                                            the payment
                                                            reference. Your
                                                            order won’t be
                                                            shipped until the
                                                            funds have cleared
                                                            in our account.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div
                                                    className="card-header"
                                                    id="#payment-3"
                                                >
                                                    <h5 className="panel-title">
                                                        <a
                                                            href="javascript:void(0)"
                                                            className="collapsed"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapseThree"
                                                            aria-expanded="false"
                                                            aria-controls="collapseThree"
                                                        >
                                                            PayPal
                                                        </a>
                                                    </h5>
                                                </div>
                                                <div
                                                    id="collapseThree"
                                                    className="collapse"
                                                    data-bs-parent="#accordion"
                                                >
                                                    <div className="card-body">
                                                        <p>
                                                            Make your payment
                                                            directly into our
                                                            bank account. Please
                                                            use your Order ID as
                                                            the payment
                                                            reference. Your
                                                            order won’t be
                                                            shipped until the
                                                            funds have cleared
                                                            in our account.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="order-button-payment">
                                            <input
                                                value="Siparişi Tamamla"
                                                type="submit"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Checkout Area End Here --> */}
        </>
    );
}

export default Checkout;
