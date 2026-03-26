import React, { use, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../services/AuthContex";
import Loading from "../layouts/GeneralComponents/Loading";
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import useForm from "../services/hooks/useForm";
import { Dialog, DialogTitle } from "@mui/material";
import { DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Link } from "react-router-dom";
import UpdateAddress from "./user/UserInfo/Address/UpdateAddress";
import AddAddress from "./user/UserInfo/Address/AddAddress";
import { updateSelectedAddress, matchCartForUser, matchCart, pay } from "../services/WebService";

function Checkout() {
    const { setMiniCart, cart, currentUser, accessToken, setCurrentUser, setCart } = useAuth();
    const { totalCost, subTotal } = useForm();
    const location = useLocation();
    const [showCoupon, setShowCoupon] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const options = [{ value: "Türkiye", label: "Türkiye" }];
    const [cartMatched, setCartMatched] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDifferent, setIsDifferent] = useState(false);
    const [mode, setMode] = useState("bireysel"); // "bireysel" veya "kurumsal"
    const { open, setOpen, handleCancel } = useForm();
    const [selectedAddressId, setSelectedAddressId] = useState(currentUser?.addresses?.find(addr => addr.is_selected === 1)?.id || null);
    const [cargo, setCargo] = useState(0);
    const [checkoutFormContent, setCheckoutFormContent] = useState("");
    const formRef = useRef();
    useEffect(() => { setMiniCart(false) }, []);

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
                    }
                    if (data && data.items) {
                        setCart(data.items);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setCartMatched(true);
                    setLoading(false);
                }
            };
            matchCartData();
        } else if (Array.isArray(cart) && cart.length === 0) {
            setCartMatched(false);
            //setLoad(false);
        }
    }, [cart, accessToken]);

    useEffect(() => {
        if (!cartMatched && cart && cart.length > 0) {
            setCartMatched(true);
        }
    }, [cart]);

    useEffect(() => {
        if (cartMatched) {
            setLoading(false);
        } else {
            if (cart && cart.length > 0) {
                setLoading(true);
            } else {
                setLoading(false);
            }
        }
    }, [cartMatched]);

    const handleChangeAddressSubmit = async () => {

        if (currentUser?.addresses?.find(addr => addr.id === selectedAddressId)?.is_selected === 1) {
            setOpen(false);
            return;
        }

        const { data } = await updateSelectedAddress(selectedAddressId, accessToken);
        if (data.status === 'success') {
            console.log("Adres başarıyla güncellendi:", data);
            setCurrentUser(prev => ({
                ...prev,
                addresses: prev.addresses.map(addr => ({
                    ...addr,
                    is_selected: addr.id === selectedAddressId ? 1 : 0
                }))
            }));
        }

        setOpen(false);

    }

    useEffect(() => {
        setSelectedAddressId(currentUser?.addresses?.find(addr => addr.is_selected === 1)?.id || null);
    }, [currentUser]);

    const handleCheckout = async () => {
        console.log(accessToken);
        const { data } = await pay({
            cart,
            address: currentUser?.addresses?.find(addr => addr.is_selected === 1) || null,
            total_price: subTotal(cart),
        }, accessToken);
        if (data.status === 'success') {
            setCheckoutFormContent(data.checkoutFormContent);
        }



        console.log("Payment response:", data);

    };

    useEffect(() => {
        if (formRef.current && checkoutFormContent) {
            formRef.current.innerHTML = checkoutFormContent;
            // Script tag’ini bul ve çalıştır
            const script = formRef.current.querySelector("script");
            if (script) {
                const newScript = document.createElement("script");
                newScript.text = script.text;
                document.body.appendChild(newScript);
            }
        }
    }, [checkoutFormContent]);
    console.log(currentUser);
    return (
        <>
            <div className="deneme123" ref={formRef} />
            {open && (<>

                <Dialog open={open} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ m: 0, p: 2 }}>
                        Adreslerim
                        <IconButton
                            aria-label="close"
                            onClick={() => { handleCancel(); setSelectedAddressId(currentUser?.addresses?.find(addr => addr.is_selected === 1)?.id || null); }}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                            mb: 2,
                        }}
                    >
                        {currentUser?.addresses?.length > 0 ? (
                            currentUser.addresses.map((address) => (
                                <div key={address.id} className={`border rounded p-2 mb-2 ${selectedAddressId === address.id ? 'border-warning' : ''}`}
                                    style={{ background: selectedAddressId === address.id ? '#fff8e1' : '#fff', cursor: 'pointer' }}
                                    onClick={() => setSelectedAddressId(address.id)}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <b>{address.title}</b> <span className="mx-2">|</span> {address.name} {address.lastname} <span className="mx-2">|</span> <span style={{ fontSize: 13 }}>{address.phone}</span>
                                        </div>
                                        <span className="modalUpdateAddress" style={{ fontSize: 13, cursor: 'pointer' }}> <UpdateAddress initialValues={address} /></span>
                                    </div>
                                    <div style={{ fontSize: 14, marginTop: 4 }}>{address.address}</div>
                                    <div style={{ fontSize: 13, color: '#888' }}>{address.neighborhood} / {address.district} / {address.city}</div>
                                </div>
                            ))
                        ) : (
                            <div>Kayıtlı adresiniz yok.</div>
                        )}
                        <AddAddress accessToken={accessToken} onCreateAddress={(newAddress) => {
                            // Update the currentUser addresses state with the new address
                            setCurrentUser(prevUser => ({
                                ...prevUser,
                                addresses: [...prevUser.addresses, newAddress]
                            }));
                        }} />
                        {/* <button className="btn w-100 mt-2" style={{ border: '1px solid #cda557', color: '#cda557', background: '#fff' }} onClick={handleOpenAddressDialog}>
                            + Yeni Adres Ekle
                        </button> */}

                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={handleChangeAddressSubmit}
                            variant="contained"
                            sx={{ backgroundColor: '#595959' }}
                        >
                            Tamam
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
            )}
            {loading ? (<Loading />) : (
                cartMatched === true ? (

                    <div className="checkout-area">
                        <div className="container-fluid">
                            {!currentUser && (
                                <div className="row">
                                    <div className="col-12">
                                        <div className="coupon-accordion">
                                            <h3>
                                                <span id="showlogin" onClick={() => setShowLogin(!showLogin)}>
                                                    Hesabınıza Giriş Yapmak İçin <em>Tıklayın</em>
                                                </span>
                                            </h3>
                                            <div
                                                id="checkout-login"
                                                className={`coupon-content ${showLogin ? "active" : ""}`}
                                            // style={{ display: showLogin ? "block" : "none" }}
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
                                                className={`coupon-checkout-content ${showCoupon ? "active" : ""
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
                            )}

                            <div className="row">

                                <div className="col-lg-7 col-12">
                                    {/* <div className="row">
                                        {cart?.length > 0 && cart.map((item, index) => (
                                            <div className="col-12 checkout-item" key={index}>

                                                <div className="cart-item-box" >
                                                    <div className="cart-item-img">
                                                        <img src="https://dummyimage.com/80x100/eee/333&text=Foto" alt="Ürün Görseli" />
                                                    </div>
                                                    <div className="cart-item-info">
                                                        <div className="cart-item-title">
                                                            <b>Avva</b> Erkek Antrasit Klasik Yaka Kolay Ütülenen Comfort Fit Gömlek Ceket A52Y2104
                                                        </div>
                                                        <div className="cart-item-details">
                                                            <span>Ölçü: <b>S</b></span>
                                                            <span>|</span>
                                                            <span>Renk: <b>S</b></span>
                                                            <span>|</span>
                                                            <span>Adet: <b>1 Adet</b></span>
                                                        </div>
                                                        <div className="cart-item-shipping">
                                                            <span className="shipping-fast">🚚 En Geç Yarın Kargoda!</span>
                                                        </div>
                                                        <div className="cart-item-discount">
                                                            <span className="discount-badge">Sepette %30 indirim</span>
                                                            <span className="discount-applied">Uygulandı ✔️</span>
                                                        </div>
                                                    </div>
                                                    <div className="cart-item-price">
                                                        <div className="old-price">4.372,99 TL</div>
                                                        <div className="new-price">3.061,09 TL</div>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div> */}
                                    {currentUser ? (
                                        <>
                                            <div className="address-select-section">
                                                <div className="checkbox-form">
                                                    <h3 className="d-flex justify-content-between">Teslimat Adresim
                                                        <AddAddress accessToken={accessToken} style={{ color: '#cda557', background: 'none', border: 'none', fontSize: 16 }} onCreateAddress={(newAddress) => {
                                                            // Update the currentUser addresses state with the new address
                                                            setCurrentUser(prevUser => ({
                                                                ...prevUser,
                                                                addresses: [...prevUser.addresses, newAddress]
                                                            }));
                                                        }} />

                                                    </h3>

                                                    <div className="row">
                                                        {currentUser?.addresses?.filter(address => address.is_selected === 1)?.length > 0 ? (
                                                            currentUser.addresses.filter(address => address.is_selected === 1).map((address) => (
                                                                <div className="col-12" key={address.id}>
                                                                    <div className="d-flex justify-content-between">
                                                                        <div><b>{address.title}</b> ({address.neighborhood} / {address.district} / {address.city})
                                                                            <p>{address.address}</p>
                                                                        </div>
                                                                        <div>
                                                                            <button style={{ color: '#cda557' }} onClick={() => setOpen(true)} type="button" className="btn">
                                                                                <ChangeCircleOutlinedIcon fontSize="small" />
                                                                                Değiştir
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="col-12">Kayıtlı adresiniz yok.</div>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
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
                                                            className={`checkout-form-list create-account ${isChecked ? "active" : ""
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

                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    <div className="order-notes">
                                        <div className="checkout-form-list checkout-form-list-2">
                                            <label>Sipariş Notu</label>
                                            <textarea
                                                id="checkout-mess"
                                                cols="30"
                                                rows="10"
                                                placeholder="Siparişinizle ilgili notlar, örn. teslimat için özel notlar."

                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <input
                                            type="checkbox"
                                            id="isDifferent"
                                            checked={isDifferent}
                                            onChange={() => setIsDifferent(!isDifferent)}
                                            style={{ marginRight: 8 }}
                                        />
                                        <label htmlFor="isDifferent" style={{ fontSize: 14 }}>
                                            Teslimat adresim ile fatura adresim farklı.
                                        </label>
                                    </div>
                                    {isDifferent && (
                                        <form>
                                            {/* Switch */}
                                            <div className="d-flex justify-content-end mb-3">
                                                <div
                                                    style={{
                                                        background: "#f3f3f3",
                                                        borderRadius: 20,
                                                        display: "inline-flex",
                                                        border: "1px solid #ced4da",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${mode === "bireysel" ? "btn-light" : ""}`}
                                                        style={{
                                                            borderRadius: 20,
                                                            color: mode === "bireysel" ? "#222" : "#888",
                                                            background: mode === "bireysel" ? "#fff" : "transparent",
                                                            marginRight: 2,
                                                            border: "none",
                                                            onHover: { border: "transparent" },
                                                        }}
                                                        onClick={() => setMode("bireysel")}
                                                    >
                                                        Bireysel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${mode === "kurumsal" ? "btn-primary" : ""}`}
                                                        style={{
                                                            borderRadius: 20,
                                                            color: mode === "kurumsal" ? "#fff" : "#222",
                                                            background: mode === "kurumsal" ? "#595959" : "transparent",
                                                            border: "none",
                                                        }}
                                                        onClick={() => setMode("kurumsal")}
                                                    >
                                                        Kurumsal
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Ortak Alanlar */}
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <label className="form-label">Ad *</label>
                                                    <input className="form-control" required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Soyad *</label>
                                                    <input className="form-control" required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Cep Telefonu *</label>
                                                    <input className="form-control" required placeholder="Başında 0 olmadan giriniz." />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">E-Posta Adresi *</label>
                                                    <input className="form-control" required type="email" />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">İl *</label>
                                                    <select className="form-select" required>
                                                        <option>Seçiniz</option>
                                                        {/* iller buraya gelecek */}
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">İlçe *</label>
                                                    <select className="form-select" required>
                                                        <option>Seçiniz</option>
                                                        {/* ilçeler buraya gelecek */}
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Mahalle *</label>
                                                    <select className="form-select" required>
                                                        <option>Seçiniz</option>
                                                        {/* mahalleler buraya gelecek */}
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Cadde/Sokak *</label>
                                                    <select className="form-select" required>
                                                        <option>Seçiniz</option>
                                                        {/* caddeler buraya gelecek */}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Kurumsal alanlar */}
                                            {mode === "kurumsal" && (
                                                <div className="row g-3 mt-2">
                                                    <div className="col-md-4">
                                                        <label className="form-label">Firma Adı *</label>
                                                        <input className="form-control" required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">Vergi Dairesi *</label>
                                                        <input className="form-control" required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">Vergi No *</label>
                                                        <input className="form-control" required />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Açık Adres */}
                                            <div className="mt-3 mb-3">
                                                <label className="form-label">Açık Adres</label>
                                                <textarea className="form-control" rows={3} />
                                            </div>
                                        </form>

                                    )}

                                    {/* Sözleşme */}
                                    <div className="">
                                        <input type="checkbox" id="sozlesme" required style={{ marginRight: 8 }} />
                                        <label htmlFor="sozlesme" style={{ fontSize: 13 }}>
                                            <span style={{ color: '#222', fontWeight: 500 }}>Mesafeli Satış Sözleşmesi</span>’ni ve <span style={{ color: '#222', fontWeight: 500 }}>Güvenlik ve Gizlilik Politikası</span>’nı okudum, onaylıyorum.
                                        </label>
                                    </div>

                                </div>
                                <div className="col-lg-5 col-12">
                                    <div className="your-order">
                                        <h3>Sipariş Detayı</h3>
                                        <div className="your-order-table table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="cart-product-name">
                                                            {cart?.length > 1
                                                                ? "Ürünler"
                                                                : "Ürün"}
                                                        </th>
                                                        <th className="cart-product-total">
                                                            Total
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cart?.length > 0 && cart.map((item, index) => (
                                                        <tr
                                                            className="cart_item"
                                                            key={`${item.product_slug}-${index}`}
                                                        >
                                                            <td className="cart-product-name">
                                                                {item.product_name}{" "}
                                                                <strong className="product-quantity">
                                                                    × {item.quantity}
                                                                </strong>
                                                            </td>
                                                            <td className="cart-product-total">
                                                                <span className="amount text-danger text-decoration-line-through small">
                                                                    {(
                                                                        item.product_price *
                                                                        item.quantity
                                                                    ).toLocaleString(
                                                                        "tr-TR",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )}{" "}
                                                                    ₺
                                                                </span><br />
                                                                <span className="amount">
                                                                    {totalCost(item.product_price, item.quantity, item.product_discount)}
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
                                                                {subTotal(
                                                                    cart
                                                                ).toLocaleString(
                                                                    "tr-TR",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )} ₺
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr className="cart-subtotal">
                                                        <th>Kargo</th>
                                                        <td>
                                                            <span className="amount"
                                                                style={{
                                                                    color: "#67c36c",
                                                                }}
                                                            >
                                                                <dfn style={{ color: '#666666', textDecoration: 'line-through', fontSize: '12px' }}>
                                                                    59,99₺
                                                                </dfn> Kargo Bedava

                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr className="order-total">
                                                        <th>Ödenecek Tutar</th>
                                                        <td>

                                                            <span className="amount fw-bold">
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
                                                                    Havale ve EFT
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
                                                        value="Alışverişi Tamamla"
                                                        type="submit"
                                                        onClick={handleCheckout}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div >

                        </div >
                    </div >

                ) : cartMatched === false ? (
                    <div className="checkout-area">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="text-center">
                                        <p className="fw-bold">Sepetiniz boş, ama fırsatlar dolu! <br /> Özel fırsatları kaçırmamak için alışverişe devam edin.</p>

                                        <button
                                            style={{
                                                background: '#595959',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '8px 24px',
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                marginTop: '0',
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
            )
            }


        </>
    );
}

export default Checkout;
