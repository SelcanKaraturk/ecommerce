import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContex";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../layouts/GeneralComponents/Loading";
import { GradingRounded, FavoriteBorderRounded, ShoppingCartOutlined, AlarmRounded, LogoutRounded, CloseRounded, WorkspacePremiumOutlined, DeleteForeverOutlined } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { colors } from "@mui/material";
import useForm from "../../services/hooks/useForm";
import { NumericFormat } from "react-number-format";
import api, { getConfig } from "../../services/api";
import { updateProfile, updatePassword } from "../../services/AuthService";
import AddAddress from "./UserInfo/AddAddress";

function MyAccount() {
    // Modern adres ikonu (kartın üstünde, dışarıda, profile-card tarzı)
    const AddressIcon = () => (
        <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px #0002',
            position: 'absolute',
            left: '50%',
            top: -36,
            transform: 'translateX(-50%)',
            zIndex: 2,
        }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#e3f2fd" />
                <circle cx="12" cy="9" r="2.5" fill="#1976d2" />
            </svg>
        </div>
    );
    // Modern adres yönetimi için state
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: "Ev",
            address: "1234 Heaven Street, Beverly Hill, OldYork, United States of Lorem",
        },
    ]);
    const [newAddress, setNewAddress] = useState("");
    const [newName, setNewName] = useState("");

    const handleAddAddress = () => {
        if (!newAddress.trim() || !newName.trim()) return;
        setAddresses(prev => ([
            ...prev,
            { id: Date.now(), name: newName, address: newAddress }
        ]));
        setNewAddress("");
        setNewName("");
        setShowAddForm(false);
    };
    const handleDeleteAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };
    const handleUpdateAddress = (id) => { };
    // Düzenleme için ek state ve fonksiyonlar eklenebilir (isteğe bağlı)
    const [load, setLoad] = useState(true);
    const personalForm = useForm({ name: '', lastname: '', email: '', phone: '', birthdate: '' });
    const passwordForm = useForm({ current_password: '', new_password: '' });
    const [profileOpen, setProfileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const [birthDate, setBirthDate] = useState(null);
    const [count, setCount] = useState(1);
    // Şifre göster/gizle için stateler
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        setAccessToken,
        setCurrentUser,
        currentUser,
        logout,
        setCart,
        accessToken,
        loading,
        setLoading,
    } = useAuth();

    useEffect(() => {
        if (!loading && !accessToken) {
            navigate("/login", { replace: true });
        }
    }, [loading, accessToken, navigate]);

    if (loading) {
        return <Loading />;
    }

    if (!accessToken) {
        // Henüz yönlendirme yapıldı ya da yapılacak, render etme
        return null;
    }
    const userLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await logout();

            if (res?.data?.message) {
                setCurrentUser("");
                setAccessToken(null);
                localStorage.setItem("currentToken", null);
                setCart([]);
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Daha zarif, minimal göz ikonları (açık ve kapalı)
    const EyeIcon = ({ open, onClick }) => (
        <span onClick={onClick} style={{ cursor: 'pointer', position: 'absolute', right: 12, top: '66%', transform: 'translateY(-50%)', zIndex: 2 }}>
            {open ? (
                // Zarif açık göz
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 11C3.5 6.5 7.5 3.5 11 3.5C14.5 3.5 18.5 6.5 21 11C18.5 15.5 14.5 18.5 11 18.5C7.5 18.5 3.5 15.5 1 11Z" />
                    <circle cx="11" cy="11" r="3.2" />
                </svg>
            ) : (
                // Zarif kapalı göz
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 11C3.5 6.5 7.5 3.5 11 3.5C14.5 3.5 18.5 6.5 21 11C18.5 15.5 14.5 18.5 11 18.5C7.5 18.5 3.5 15.5 1 11Z" />
                    <circle cx="11" cy="11" r="3.2" />
                    <line x1="5" y1="17" x2="17" y2="5" stroke="#222" strokeWidth="1.5" />
                </svg>
            )}
        </span>
    );

    return accessToken && (
        <main className="page-content">
            {/* <!-- Begin Hiraola's Account Page Area --> */}
            <div className="account-page-area">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3">
                            <ul
                                className="nav myaccount-tab-trigger"
                                id="account-page-tab"
                                role="tablist"
                            >
                                <li className="nav-item">
                                    <a
                                        className={`nav-link${activeTab === 'dashboard' ? ' active' : ''}`}
                                        id="account-dashboard-tab"
                                        href="#account-dashboard"
                                        role="tab"
                                        aria-controls="account-dashboard"
                                        aria-selected={activeTab === 'dashboard'}
                                        onClick={e => {
                                            e.preventDefault();
                                            setProfileOpen((prev) => !prev);
                                            setActiveTab('dashboard');
                                        }}
                                        style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                            {/* Kullanıcı ikonu (SVG) */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: 6 }}>
                                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                            </svg>
                                            Profil & Güvenlik
                                        </span>
                                        {/* Chevron ikonu */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            style={{
                                                marginLeft: 10,
                                                transition: 'transform 0.2s',
                                                transform: profileOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                                            }}
                                        >
                                            <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </a>
                                    {/* Alt başlıklar */}
                                    {profileOpen && (
                                        <ul className="nav flex-column" style={{ borderRadius: 4 }}>
                                            <li className="nav-item">
                                                <a className={`nav-link border-0${activeTab === 'account-details' ? ' active' : ''}`}
                                                    id="account-details-tab"
                                                    href="#account-details"
                                                    role="tab"
                                                    aria-controls="account-details"
                                                    aria-selected={activeTab === 'account-details'}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setActiveTab('account-details');
                                                    }}
                                                >
                                                    Kişisel Bilgilerim
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className={`nav-link border-0${activeTab === 'password-change' ? ' active' : ''}`}
                                                    id="password-change-tab"
                                                    href="#password-change"
                                                    role="tab"
                                                    aria-controls="password-change"
                                                    aria-selected={activeTab === 'password-change'}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setActiveTab('password-change');
                                                    }}
                                                >
                                                    Şifre Değiştir
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className={`nav-link border-0${activeTab === 'account-address' ? ' active' : ''} border-bottom`}
                                                    id="account-address-tab"
                                                    href="#account-address"
                                                    role="tab"
                                                    aria-controls="account-address"
                                                    aria-selected={activeTab === 'account-address'}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setActiveTab('account-address');
                                                    }}
                                                >
                                                    Adreslerim
                                                </a>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link${activeTab === 'account-orders' ? ' active' : ''}`}
                                        id="account-orders-tab"
                                        href="#account-orders"
                                        role="tab"
                                        aria-controls="account-orders"
                                        aria-selected={activeTab === 'account-orders'}
                                        onClick={e => {
                                            e.preventDefault();
                                            setActiveTab('account-orders');
                                        }}
                                    >
                                        <GradingRounded />
                                        Siparişlerim
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link${activeTab === 'account-preorders' ? ' active' : ''}`}
                                        id="account-preorders-tab"
                                        href="#account-preorders"
                                        role="tab"
                                        aria-controls="account-preorders"
                                        aria-selected={activeTab === 'account-preorders'}
                                        onClick={e => {
                                            e.preventDefault();
                                            setActiveTab('account-preorders');
                                        }}
                                    >
                                        <WorkspacePremiumOutlined />
                                        VIP Siparişlerim
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link${activeTab === 'wishlist' ? ' active' : ''}`}
                                        id="wishlist-tab"
                                        href="#wishlist"
                                        role="tab"
                                        aria-controls="wishlist"
                                        aria-selected={activeTab === 'wishlist'}
                                        onClick={e => {
                                            e.preventDefault();
                                            setActiveTab('wishlist');
                                        }}
                                    >
                                        <FavoriteBorderRounded sx={{ marginRight: '2px' }} />
                                        Favorilerim
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link${activeTab === 'account-card' ? ' active' : ''}`}
                                        id="account-card-tab"
                                        href="#account-card"
                                        role="tab"
                                        aria-controls="account-card"
                                        aria-selected={activeTab === 'account-card'}
                                        onClick={e => {
                                            e.preventDefault();
                                            setActiveTab('account-card');
                                        }}
                                    >
                                        <ShoppingCartOutlined sx={{ marginRight: '2px' }} />
                                        Sepetim
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link${activeTab === 'account-alarm' ? ' active' : ''}`}
                                        id="account-alarm-tab"
                                        href="#account-alarm"
                                        role="tab"
                                        aria-controls="account-alarm"
                                        aria-selected={activeTab === 'account-alarm'}
                                        onClick={e => {
                                            e.preventDefault();
                                            setActiveTab('account-alarm');
                                        }}
                                    >
                                        <AlarmRounded sx={{ marginRight: '2px' }} />
                                        Fiyat & Stok Alarmım
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        type="submit"
                                        onClick={userLogout}
                                        role="tab"
                                        aria-selected="false"
                                    >
                                        <LogoutRounded sx={{ marginRight: '2px' }} />
                                        Güvenli Çıkış
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-9 mt-4 mt-md-0">
                            <div
                                className="tab-content myaccount-tab-content"
                                id="account-page-tab-content"
                            >
                                <div
                                    className={`tab-pane fade${activeTab === 'dashboard' ? ' show active' : ''}`}
                                    id="account-dashboard"
                                    role="tabpanel"
                                    aria-labelledby="account-dashboard-tab"
                                >
                                    <div className="myaccount-dashboard">
                                        <p>
                                            Hello <b>{currentUser?.name}</b>
                                        </p>
                                        <p>
                                            From your account dashboard you can
                                            view your recent orders, manage your
                                            shipping and billing addresses and{" "}
                                            <a href="javascript:void(0)">
                                                edit your password and account
                                                details
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`tab-pane fade${activeTab === 'account-details' ? ' show active' : ''}`}
                                    id="account-details"
                                    role="tabpanel"
                                    aria-labelledby="account-details-tab"
                                >
                                    <div className="myaccount-details">
                                        <form onSubmit={personalForm.handleSubmit(async (formData) => {
                                            try {
                                                const { data } = await updateProfile(formData, accessToken);
                                                console.log(data);
                                                if (data.status === 'success') {
                                                    console.log("Kişisel Bilgi Formu Cevabı:", data);
                                                    toast.success("Bilgileriniz güncellendi!");
                                                }
                                                console.log("Kişisel Bilgi Formu Gönderildi:", data);
                                                // toast.success("Bilgileriniz güncellendi!");
                                            } catch (err) {
                                                console.error("Kişisel Bilgi Formu Hatası:", err);
                                                // toast.error("Bir hata oluştu!");
                                            }
                                        })}
                                            className="hiraola-form"
                                        >
                                            <div className="hiraola-form-inner">
                                                <div className="single-input single-input-half">
                                                    <label htmlFor="account-details-firstname">
                                                        Ad*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="account-details-firstname"
                                                        name="name"
                                                        value={personalForm.form.name}
                                                        onChange={personalForm.handleChange}
                                                    />
                                                </div>
                                                <div className="single-input single-input-half">
                                                    <label htmlFor="account-details-lastname">
                                                        Soyad*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="account-details-lastname"
                                                        name="lastname"
                                                        value={personalForm.form.lastname}
                                                        onChange={personalForm.handleChange}
                                                    />
                                                </div>
                                                <div className="single-input">
                                                    <label htmlFor="account-details-email">
                                                        Email*
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="account-details-email"
                                                        name="email"
                                                        value={personalForm.form.email}
                                                        onChange={personalForm.handleChange}
                                                    />
                                                </div>
                                                <div className="single-input single-input-half">
                                                    <label htmlFor="account-details-phone">
                                                        Cep Telefonu
                                                    </label>

                                                    <NumericFormat
                                                        format="+90 (###) ### ## ##"
                                                        mask="_"
                                                        value={personalForm.form.phone}
                                                        onValueChange={values => personalForm.setForm(prev => ({
                                                            ...prev,
                                                            phone: values.value
                                                        }))}
                                                        isAllowed={({ value }) => {
                                                            // Sadece 5 ile başlayan ve en fazla 10 haneli (5xxxxxxxxx) numaraya izin ver
                                                            if (!value) return true;
                                                            if (value.length === 0) return true;
                                                            if (value[0] !== '5') return false;
                                                            if (value.length > 10) return false;
                                                            return /^5\d{0,9}$/.test(value);
                                                        }}
                                                        type="tel"
                                                        id="account-details-phone"
                                                        name="phone"
                                                        placeholder="+90 (5xx) xxx xx xx"
                                                        inputMode="numeric"
                                                    />
                                                </div>
                                                <div className="single-input single-input-half">
                                                    <label htmlFor="account-details-birthdate">
                                                        Doğum Tarihi
                                                    </label>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DatePicker
                                                            format="dd/MM/yyyy"
                                                            value={personalForm.form.birthdate || null}
                                                            onChange={newValue =>
                                                                personalForm.setForm(prev => ({ ...prev, birthdate: newValue }))
                                                            }
                                                            name="birthdate"
                                                            maxDate={(() => {
                                                                const today = new Date();
                                                                const year = today.getFullYear() - 14;
                                                                // 31 Aralık (Aralık = 11. ay)
                                                                return new Date(year, 11, 31, 23, 59, 59, 999);
                                                            })()}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    InputProps: {
                                                                        sx: { height: 40, padding: '0 15px 0 15px' }
                                                                    },
                                                                    inputProps: {
                                                                        style: { height: 40, padding: '0 15px 0 15px' }
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                                <div className="single-input">
                                                    <button
                                                        className="hiraola-btn hiraola-btn_dark"
                                                        type="submit"
                                                    >
                                                        <span>
                                                            Kaydet
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div
                                    className={`tab-pane fade${activeTab === 'password-change' ? ' show active' : ''}`}
                                    id="password-change"
                                    role="tabpanel"
                                    aria-labelledby="password-change-tab"
                                >
                                    <div className="myaccount-details">
                                        <form onSubmit={passwordForm.handleSubmit(async (formData) => {
                                            try {
                                                const { data } = await updatePassword(formData, accessToken);
                                                console.log(data);
                                                if (data.status === 'success') {
                                                    console.log("Kişisel Bilgi Formu Cevabı:", data);
                                                    toast.success("Bilgileriniz güncellendi!");
                                                }
                                                console.log("Kişisel Bilgi Formu Gönderildi:", data);
                                                // toast.success("Bilgileriniz güncellendi!");
                                            } catch (err) {
                                                console.error("Kişisel Bilgi Formu Hatası:", err);
                                                // toast.error("Bir hata oluştu!");
                                            }
                                        })}
                                            className="hiraola-form"
                                        >
                                            <div className="hiraola-form-inner">
                                                <div className="single-input">
                                                    <label htmlFor="account-details-oldpass">
                                                        Mevcut Şifre*
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type={showOldPassword ? 'text' : 'password'}
                                                            id="account-details-oldpass"
                                                            name="oldpassword"
                                                            style={{ paddingRight: 36 }}
                                                        />
                                                        <EyeIcon open={showOldPassword} onClick={() => setShowOldPassword(v => !v)} />
                                                    </div>
                                                </div>
                                                <div className="single-input">
                                                    <label htmlFor="account-details-newpass">
                                                        Yeni Şifre*
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type={showNewPassword ? 'text' : 'password'}
                                                            id="account-details-newpass"
                                                            name="newpassword"
                                                            style={{ paddingRight: 36 }}
                                                        />
                                                        <EyeIcon open={showNewPassword} onClick={() => setShowNewPassword(v => !v)} />
                                                    </div>
                                                </div>
                                                <div className="single-input">
                                                    <label htmlFor="account-details-confpass">
                                                        Yeni Şifreyi Tekrar*
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            id="account-details-confpass"
                                                            name="confirmpassword"
                                                            style={{ paddingRight: 36 }}
                                                        />
                                                        <EyeIcon open={showConfirmPassword} onClick={() => setShowConfirmPassword(v => !v)} />
                                                    </div>
                                                </div>
                                                <div className="single-input">
                                                    <button
                                                        className="hiraola-btn hiraola-btn_dark"
                                                        type="submit"
                                                    >
                                                        <span>
                                                            Kaydet
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div
                                    className={`tab-pane fade${activeTab === 'account-address' ? ' show active' : ''}`}
                                    id="account-address"
                                    role="tabpanel"
                                    aria-labelledby="account-address-tab"
                                >
                                    <div className="myaccount-address">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 50 }}>
                                            <h4 className="small-title" style={{ margin: 0 }}>Adreslerim</h4>
                                            <AddAddress />
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
                                            {addresses.map(addr => (
                                                <div key={addr.id} style={{ minWidth: 280, maxWidth: 320, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #0002', padding: '48px 24px 20px 24px', position: 'relative', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <AddressIcon />
                                                    <div style={{ fontWeight: 700, fontSize: 17, margin: '4px 0 4px 0', textAlign: 'center', color: '#222' }}>{addr.name}</div>
                                                    <div style={{ color: '#555', fontSize: 15, marginBottom: 16, textAlign: 'center', minHeight: 40 }}>{addr.address}</div>
                                                    <div className="address-btn-group" style={{ display: 'flex', gap: 8, justifyContent: 'space-between', width: '100%' }}>
                                                        <button
                                                            style={{width: '45px'}}
                                                            className="hiraola-btn hiraola-btn_sm"
                                                            onClick={e => { e.preventDefault(); handleDeleteAddress(addr.id); }}
                                                        >
                                                            <span>Sil</span>
                                                        </button>
                                                        <button
                                                            className="hiraola-btn_sm d-flex align-items-center w-auto btn btn-sm"
                                                            onClick={e => { e.preventDefault(); handleUpdateAddress(addr.id); }}
                                                        >Düzenle</button>
                                                        {/* <button className="hiraola-btn hiraola-btn_sm" style={{ background: '#1976d2', color: '#fff', borderRadius: 6, fontSize: 14, padding: '4px 18px', boxShadow: '0 1px 4px #0001' }}>Düzenle</button> */}
                                                    </div>
                                                </div>
                                            ))}
                                            {addresses.length === 0 && (
                                                <div style={{ color: '#888', fontSize: 15, padding: 24 }}>Henüz adres eklemediniz.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`tab-pane fade${activeTab === 'account-orders' ? ' show active' : ''}`}
                                    id="account-orders"
                                    role="tabpanel"
                                    aria-labelledby="account-orders-tab"
                                >
                                    <div className="myaccount-orders">
                                        <h5 className="small-title">Siparişlerim</h5>
                                        <div className="order-list">
                                            {/* Order Card 1 */}
                                            <div className="order-card">
                                                <div className="order-card-header">
                                                    <div className="order-number">
                                                        Sipariş No <span className="order-number-highlight">#LT80945</span>
                                                    </div>
                                                    <div className="order-date">
                                                        Sipariş Tarihi<br />
                                                        <span className="order-date-value">23 Aralık 2025</span>
                                                    </div>
                                                </div>
                                                <div className="order-card-body">
                                                    <img
                                                        src="https://placehold.co/80x80"
                                                        alt="Modern Leather Sofa - Caramel"
                                                        className="order-product-img"
                                                    />
                                                    <div className="order-product-info">
                                                        <div className="order-product-title">Modern Leather Sofa - Caramel</div>
                                                        <div className="order-product-details">
                                                            Qty: 1 &nbsp; <span className="order-product-price">$1,299.00</span>
                                                        </div>
                                                        <div className="order-progress-wrap">
                                                            <div className="order-progress">
                                                                <div className="order-progress-label order-progress-label--first">Sipariş alındı</div>
                                                                <div className="order-progress-label order-progress-label--second">Hazırlanıyor</div>
                                                                <div className="order-progress-label order-progress-label--third">Kargoya Verildi</div>
                                                                <div className="order-progress-label order-progress-label--fourth">Teslim Edildi</div>
                                                                <div className="order-progress-bar-bg">
                                                                    <div className="order-progress-bar-fill" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="order-card-actions">
                                                    <button className="order-btn order-btn-outline">Track Package</button>
                                                    <button className="order-btn order-btn-primary">Delivery Details</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`tab-pane fade${activeTab === 'account-preorders' ? ' show active' : ''}`}
                                    id="account-preorders"
                                    role="tabpanel"
                                    aria-labelledby="account-preorders-tab"
                                >
                                    <div className="myaccount-orders">
                                        <h5 className="small-title">VIP Siparişlerim</h5>
                                        <div className="order-list">
                                            {/* Order Card 1 */}
                                            <div className="order-card">
                                                <div className="order-card-header">
                                                    <div className="order-number">
                                                        Sipariş No <span className="order-number-highlight">#LT80945</span>
                                                    </div>
                                                    <div className="order-date">
                                                        Sipariş Tarihi<br />
                                                        <span className="order-date-value">23 Aralık 2025</span>
                                                    </div>
                                                </div>
                                                <div className="order-card-body">
                                                    <img
                                                        src="https://placehold.co/80x80"
                                                        alt="Modern Leather Sofa - Caramel"
                                                        className="order-product-img"
                                                    />
                                                    <div className="order-product-info">
                                                        <div className="order-product-title">Modern Leather Sofa - Caramel</div>
                                                        <div className="order-product-details">
                                                            Qty: 1 &nbsp; <span className="order-product-price">$1,299.00</span>
                                                        </div>
                                                        <div className="order-progress-wrap">
                                                            <div className="order-progress">
                                                                <div className="order-progress-label order-progress-label--first">Sipariş alındı</div>
                                                                <div className="order-progress-label order-progress-label--second vip-order">Özel Siparişleriniz <br /> Hazırlanıyor</div>
                                                                <div className="order-progress-label order-progress-label--third">Kargoya Verildi</div>
                                                                <div className="order-progress-label order-progress-label--fourth">Teslim Edildi</div>
                                                                <div className="order-progress-bar-bg">
                                                                    <div className="order-progress-bar-fill" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="order-card-actions">
                                                    <button className="order-btn order-btn-outline">Kargo Takibi</button>
                                                    <button className="order-btn order-btn-primary">Sipariş Detayı</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`tab-pane fade${activeTab === 'wishlist' ? ' show active' : ''}`}
                                    id="wishlist"
                                    role="tabpanel"
                                    aria-labelledby="wishlist-tab"
                                >
                                    <div className="shop-product-wrap row">


                                        <div className="col-lg-2 col-md-3 col-sm-4">
                                            <div className="slide-item account-wishlist-item" style={{ position: 'relative' }}>
                                                {/* Close Button */}
                                                <CloseRounded className="account-wishlist-close"
                                                    fontSize="small"
                                                />
                                                <div className="single_product">
                                                    <div className="product-img">
                                                        <a href="single-product.html">
                                                            <img className="primary-img" src="https://placehold.co/160x160" alt="Hiraola's Product Image" />
                                                            <img className="secondary-img" src="https://placehold.co/160x160" alt="Hiraola's Product Image" />
                                                        </a>
                                                    </div>
                                                    <div className="hiraola-product_content">
                                                        <div className="product-desc_info">
                                                            <h6>
                                                                <a className="product-name" href="single-product.html">Flash Furniture
                                                                    Alonza Se...
                                                                </a>
                                                            </h6>
                                                            <div className="price-box">
                                                                <span className="new-price">£90.36</span>
                                                            </div>
                                                            <div className="additional-add_action">
                                                                <ul>
                                                                    <li>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 512 512"
                                                                            width="24"
                                                                            height="24"
                                                                            className="wishlist-add-icon"
                                                                        >
                                                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                                                strokeWidth="32" d="M256 256v128M320 320H192M80 176a16 16 0 00-16 16v216c0 30.24 25.76 56 56 56h272c30.24 0 56-24.51 56-54.75V192a16 16 0 00-16-16zM160 176v-32a96 96 0 0196-96h0a96 96 0 0196 96v32" />
                                                                        </svg>

                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-3 col-sm-4">
                                            <div className="slide-item account-wishlist-item" style={{ position: 'relative' }}>
                                                {/* Close Button */}
                                                <CloseRounded className="account-wishlist-close"
                                                    fontSize="small"
                                                />
                                                <div className="single_product">
                                                    <div className="product-img">
                                                        <a href="single-product.html">
                                                            <img className="primary-img" src="https://placehold.co/160x160" alt="Hiraola's Product Image" />
                                                            <img className="secondary-img" src="https://placehold.co/160x160" alt="Hiraola's Product Image" />
                                                        </a>
                                                    </div>
                                                    <div className="hiraola-product_content">
                                                        <div className="product-desc_info">
                                                            <h6>
                                                                <a className="product-name" href="single-product.html">Flash Furniture
                                                                    Alonza Se...
                                                                </a>
                                                            </h6>
                                                            <div className="price-box">
                                                                <span className="new-price">£90.36</span>
                                                            </div>
                                                            <div className="additional-add_action">
                                                                <ul>
                                                                    <li>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 512 512"
                                                                            width="24"
                                                                            height="24"
                                                                            className="wishlist-add-icon"
                                                                        >
                                                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                                                strokeWidth="32" d="M256 256v128M320 320H192M80 176a16 16 0 00-16 16v216c0 30.24 25.76 56 56 56h272c30.24 0 56-24.51 56-54.75V192a16 16 0 00-16-16zM160 176v-32a96 96 0 0196-96h0a96 96 0 0196 96v32" />
                                                                        </svg>

                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-3 col-sm-4">
                                            <div className="slide-item account-wishlist-item" style={{ position: 'relative' }}>
                                                {/* Close Button */}
                                                <CloseRounded className="account-wishlist-close"
                                                    fontSize="small"
                                                />
                                                <div className="single_product">
                                                    <div className="product-img">
                                                        <a href="single-product.html">
                                                            <img className="primary-img" src="https://placehold.co/160x160" alt="Hiraola's Product Image" />
                                                            <img className="secondary-img" src="https://placehold.co/160x160" alt="Hiraola's Product Image" />
                                                        </a>
                                                    </div>
                                                    <div className="hiraola-product_content">
                                                        <div className="product-desc_info">
                                                            <h6>
                                                                <a className="product-name" href="single-product.html">Flash Furniture
                                                                    Alonza Se...
                                                                </a>
                                                            </h6>
                                                            <div className="price-box">
                                                                <span className="new-price">£90.36</span>
                                                            </div>
                                                            <div className="additional-add_action">
                                                                <ul>
                                                                    <li>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 512 512"
                                                                            width="24"
                                                                            height="24"
                                                                            className="wishlist-add-icon"
                                                                        >
                                                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                                                strokeWidth="32" d="M256 256v128M320 320H192M80 176a16 16 0 00-16 16v216c0 30.24 25.76 56 56 56h272c30.24 0 56-24.51 56-54.75V192a16 16 0 00-16-16zM160 176v-32a96 96 0 0196-96h0a96 96 0 0196 96v32" />
                                                                        </svg>

                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div
                                    className={`tab-pane fade${activeTab === 'account-card' ? ' show active' : ''}`}
                                    id="account-card"
                                    role="tabpanel"
                                    aria-labelledby="account-card-tab"
                                >
                                    {/* <!-- Begin Hiraola's Cart Area --> */}
                                    <div className="">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <form action="javascript:void(0)">
                                                        <div className="table-content table-responsive">
                                                            <table className="table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="hiraola-product-thumbnail text-start">
                                                                            <a href="javascript:void(0)"><i className="fa fa-trash me-3"
                                                                                title="Remove"></i></a>
                                                                            <a href="javascript:void(0)">
                                                                                <img src="https://placehold.co/600x400" alt="Hiraola's Cart Thumbnail" />
                                                                                <span className="account-product-name">İSİM</span>
                                                                            </a>
                                                                        </td>


                                                                        <td className="quantity">

                                                                            <div className="cart-plus-minus">
                                                                                <input className="cart-plus-minus-box" value={count} type="text" />
                                                                                <div className="dec qtybutton" onClick={() => count > 1 && setCount(count - 1)}><i className="fa fa-angle-down"></i></div>
                                                                                <div className="inc qtybutton" onClick={() => setCount(count + 1)}><i className="fa fa-angle-up"></i></div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="product-subtotal"><span className="amount">$46.80</span></td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="coupon-all">
                                                                    <div className="coupon">
                                                                        <input id="coupon_code" className="input-text" name="coupon_code" value="" placeholder="Kupon Kodu" type="text" />
                                                                        <input className="button" name="apply_coupon" value="Kupon Uygula" type="submit" style={{ padding: '0 0 0 12px' }} />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="cart-page-total pt-0">
                                                        <h2 style={{ color: '#cda557' }}>Sepet Toplamı</h2>
                                                        <ul>
                                                            <li>Ara Toplam <span >118.60 ₺</span></li>
                                                            <li>Kargo <span>0 ₺</span></li>
                                                            <li className="fw-bold">Toplam <span>118.60 ₺</span></li>
                                                        </ul>
                                                        <a href="javascript:void(0)">Sepeti Onayla</a>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div
                                    className={`tab-pane fade${activeTab === 'account-alarm' ? ' show active' : ''}`}
                                    id="account-alarm"
                                    role="tabpanel"
                                    aria-labelledby="account-alarm-tab"
                                >
                                    <div className="myaccount-orders">
                                        <h5 className="small-title">Fiyat & Stok Bildirimlerim</h5>
                                        <p className="mb-3" style={{ fontSize: '14px' }}>
                                            Fiyatı düşen veya stoğa giren ürünler burada listelenir.
                                        </p>
                                        {/* Örnek bildirim verisi */}
                                        {false ? (
                                            <div className="alert alert-info">Henüz bir bildirim yok.</div>
                                        ) : (
                                            <div className="table-responsive">
                                                <div className="alert-list-wrap">
                                                    {/* Fiyat düştü bildirimi */}
                                                    <div className="alert-list">
                                                        <div className="alert-icon">
                                                            <i className="fa fa-tag" />
                                                        </div>
                                                        <div className="alert-content">
                                                            <div className="alert-content-title">
                                                                <div className="title">Fiyat Düştü <span>Bugün</span></div>
                                                                <div className="time">1 saat önce</div>
                                                            </div>
                                                            <div className="alert-content-body">
                                                                <img src="https://placehold.co/60x60" alt="Ürün" />
                                                                <div>
                                                                    <div className="product-name">Ürün Adı Örneği</div>
                                                                    <div className="product-price">
                                                                        <span>500 ₺</span>
                                                                        <span>420 ₺</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="alert-btn-group">
                                                                <a href="#" className="hiraola-btn_sm">Ürüne Git</a>
                                                                <button className="btn btn-light btn-sm">Kapat</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Stok bildirimi */}
                                                    <div className="alert-list recharging">
                                                        <div className="alert-icon green">
                                                            <i className="fa fa-check-circle" />
                                                        </div>
                                                        <div className="alert-content">
                                                            <div className="alert-content-title">
                                                                <div className="title">Stokta Var <span>Dün</span></div>
                                                                <div className="time">22.12.2025</div>
                                                            </div>
                                                            <div className="alert-content-body">
                                                                <img src="https://placehold.co/60x60" alt="Ürün" />
                                                                <div>
                                                                    <div className="product-name">Başka Bir Ürün</div>
                                                                    <div className="product-price">
                                                                        <span>320 ₺</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="alert-btn-group">
                                                                <a href="#" className="hiraola-btn_sm">Ürüne Git</a>
                                                                <button className="btn btn-light btn-sm">Kapat</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {/* <!-- Hiraola's Account Page Area End Here --> */}
        </main >
    );
}

export default MyAccount;
