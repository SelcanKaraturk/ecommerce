import React from "react";
import "./css/Navbar.css";
import { NavLink, Outlet, Link } from "react-router-dom";

function Navbar() {

    return (
        <header className="header-main_area header-main_area-2">
            <div className="header-bottom_area header-bottom_area-2 header-sticky stick">
                <div className="container-fliud h-100">
                    <div className="row h-100">
                        <div className="col-lg-2 col-md-4 col-sm-4 h-100">
                            <div className="header-logo h-100">
                                <NavLink to="/tr">
                                    <img
                                        src="/src/assets/images/valor_logo_transparent_125px.png"
                                        alt="Hiraola's Header Logo"
                                    />
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-lg-7 d-none d-lg-block position-static">
                            <div className="main-menu_area">
                                <nav>
                                    <ul>
                                        <li className="megamenu-holder">
                                            <NavLink to="/tr/altin">
                                                Altın
                                            </NavLink>

                                            <ul className="hm-megamenu">
                                                <li>
                                                    <span className="megamenu-title">
                                                        Shop Page Layout
                                                    </span>
                                                    <ul>
                                                        <li>
                                                            <a href="shop-3-column.html">
                                                                Grid Fullwidth
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-left-sidebar.html">
                                                                Left Sidebar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-right-sidebar.html">
                                                                Right Sidebar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-list-fullwidth.html">
                                                                List Fullwidth
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-list-left-sidebar.html">
                                                                List Left
                                                                Sidebar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-list-right-sidebar.html">
                                                                List Right
                                                                Sidebar
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <span className="megamenu-title">
                                                        Single Product Style
                                                    </span>
                                                    <ul>
                                                        <li>
                                                            <a href="single-product-gallery-left.html">
                                                                Gallery Left
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-gallery-right.html">
                                                                Gallery Right
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-tab-style-left.html">
                                                                Tab Style Left
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-tab-style-right.html">
                                                                Tab Style Right
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-sticky-left.html">
                                                                Sticky Left
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-sticky-right.html">
                                                                Sticky Right
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <span className="megamenu-title">
                                                        Single Product Type
                                                    </span>
                                                    <ul>
                                                        <li>
                                                            <a href="single-product.html">
                                                                Single Product
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-sale.html">
                                                                Single Product
                                                                Sale
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-group.html">
                                                                Single Product
                                                                Group
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-variable.html">
                                                                Single Product
                                                                Variable
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-affiliate.html">
                                                                Single Product
                                                                Affiliate
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-slider.html">
                                                                Single Product
                                                                Slider
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li className="menu-item_img"></li>
                                            </ul>
                                        </li>
                                         <li className="megamenu-holder">
                                            <NavLink to="/tr/pirlanta">
                                                Pırlanta
                                            </NavLink>

                                            <ul className="hm-megamenu">
                                                <li>
                                                    <span className="megamenu-title">
                                                        Shop Page Layout
                                                    </span>
                                                    <ul>
                                                        <li>
                                                            <a href="shop-3-column.html">
                                                                Grid Fullwidth
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-left-sidebar.html">
                                                                Left Sidebar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-right-sidebar.html">
                                                                Right Sidebar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-list-fullwidth.html">
                                                                List Fullwidth
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-list-left-sidebar.html">
                                                                List Left
                                                                Sidebar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="shop-list-right-sidebar.html">
                                                                List Right
                                                                Sidebar
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <span className="megamenu-title">
                                                        Single Product Style
                                                    </span>
                                                    <ul>
                                                        <li>
                                                            <a href="single-product-gallery-left.html">
                                                                Gallery Left
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-gallery-right.html">
                                                                Gallery Right
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-tab-style-left.html">
                                                                Tab Style Left
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-tab-style-right.html">
                                                                Tab Style Right
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-sticky-left.html">
                                                                Sticky Left
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-sticky-right.html">
                                                                Sticky Right
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <span className="megamenu-title">
                                                        Single Product Type
                                                    </span>
                                                    <ul>
                                                        <li>
                                                            <a href="single-product.html">
                                                                Single Product
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-sale.html">
                                                                Single Product
                                                                Sale
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-group.html">
                                                                Single Product
                                                                Group
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-variable.html">
                                                                Single Product
                                                                Variable
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-affiliate.html">
                                                                Single Product
                                                                Affiliate
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="single-product-slider.html">
                                                                Single Product
                                                                Slider
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li className="menu-item_img"></li>
                                            </ul>
                                        </li>
                                         <li>
                                            <NavLink to="/tr/hakkimizda">Hakkımızda</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/tr/iletisim">İLETİŞİM</NavLink>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-8 col-sm-8">
                            <div className="header-right_area">
                                <ul>
                                    <li>
                                        <Link className="wishlist-btn" to="/me/wishlist">
                                            <i className="ion-android-favorite-outline"></i>
                                        </Link>

                                    </li>
                                    <li>
                                        <a
                                            href="#searchBar"
                                            className="search-btn toolbar-btn"
                                        >
                                            <i className="ion-ios-search-strong"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#mobileMenu"
                                            className="mobile-menu_btn toolbar-btn color--white d-lg-none d-block"
                                        >
                                            <i className="ion-navicon"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <Link className="minicart-btn toolbar-btn" to={'/me/cart'}>
                                            <i className="ion-bag"></i>
                                        </Link>

                                    </li>
                                     <li>
                                        <Link className="minicart-btn toolbar-btn" to={'/me'}>
                                            <i className="ion-android-person"></i>
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="offcanvas-search_wrapper" id="searchBar">
                <div className="offcanvas-menu-inner">
                    <div className="container">
                        <a href="#" className="btn-close">
                            <i className="ion-android-close"></i>
                        </a>
                        {/* <!-- Begin Offcanvas Search Area --> */}
                        <div className="offcanvas-search">
                            <form action="#" className="hm-searchbox">
                                <input
                                    type="text"
                                    placeholder="Search for item..."
                                />
                                <button className="search_btn" type="submit">
                                    <i className="ion-ios-search-strong"></i>
                                </button>
                            </form>
                        </div>
                        {/* <!-- Offcanvas Search Area End Here --> */}
                    </div>
                </div>
            </div>
            <div className="offcanvas-minicart_wrapper" id="miniCart">
                <div className="offcanvas-menu-inner">
                    <a href="#" className="btn-close">
                        <i className="ion-android-close"></i>
                    </a>
                    <div className="minicart-content">
                        <div className="minicart-heading">
                            <h4>Shopping Cart</h4>
                        </div>
                        <ul className="minicart-list">
                            <li className="minicart-product">
                                <a
                                    className="product-item_remove"
                                    href="javascript:void(0)"
                                >
                                    <i className="ion-android-close"></i>
                                </a>
                                <div className="product-item_img">
                                    <img
                                        src="/src/assets/images/product/small-size/2-1.jpg"
                                        alt="Hiraola's Product Image"
                                    />
                                </div>
                                <div className="product-item_content">
                                    <a
                                        className="product-item_title"
                                        href="shop-left-sidebar.html"
                                    >
                                        Pendant, Made of White Pl...
                                    </a>
                                    <span className="product-item_quantity">
                                        1 x $120.80
                                    </span>
                                </div>
                            </li>
                            <li className="minicart-product">
                                <a
                                    className="product-item_remove"
                                    href="javascript:void(0)"
                                >
                                    <i className="ion-android-close"></i>
                                </a>
                                <div className="product-item_img">
                                    <img
                                        src="/src/assets/images/product/small-size/2-2.jpg"
                                        alt="Hiraola's Product Image"
                                    />
                                </div>
                                <div className="product-item_content">
                                    <a
                                        className="product-item_title"
                                        href="shop-left-sidebar.html"
                                    >
                                        Pendant, Made of White Pl...
                                    </a>
                                    <span className="product-item_quantity">
                                        1 x $120.80
                                    </span>
                                </div>
                            </li>
                            <li className="minicart-product">
                                <a
                                    className="product-item_remove"
                                    href="javascript:void(0)"
                                >
                                    <i className="ion-android-close"></i>
                                </a>
                                <div className="product-item_img">
                                    <img
                                        src="/src/assets/images/product/small-size/2-3.jpg"
                                        alt="Hiraola's Product Image"
                                    />
                                </div>
                                <div className="product-item_content">
                                    <a
                                        className="product-item_title"
                                        href="shop-left-sidebar.html"
                                    >
                                        Pendant, Made of White Pl...
                                    </a>
                                    <span className="product-item_quantity">
                                        1 x $120.80
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="minicart-item_total">
                        <span>Subtotal</span>
                        <span className="ammount">$360.00</span>
                    </div>
                    <div className="minicart-btn_area">
                        <a
                            href="cart.html"
                            className="hiraola-btn hiraola-btn_dark hiraola-btn_fullwidth"
                        >
                            Minicart
                        </a>
                    </div>
                    <div className="minicart-btn_area">
                        <a
                            href="checkout.html"
                            className="hiraola-btn hiraola-btn_dark hiraola-btn_fullwidth"
                        >
                            Checkout
                        </a>
                    </div>
                </div>
            </div>
            <div className="mobile-menu_wrapper" id="mobileMenu">
                <div className="offcanvas-menu-inner">
                    <div className="container">
                        <a href="#" className="btn-close">
                            <i className="ion-android-close"></i>
                        </a>
                        <div className="offcanvas-inner_search">
                            <form action="#" className="hm-searchbox">
                                <input
                                    type="text"
                                    placeholder="Search for item..."
                                />
                                <button className="search_btn" type="submit">
                                    <i className="ion-ios-search-strong"></i>
                                </button>
                            </form>
                        </div>
                        <nav className="offcanvas-navigation">
                            <ul className="mobile-menu">
                                <li className="menu-item-has-children active">
                                    <a href="#">
                                        <span className="mm-text">Home</span>
                                    </a>
                                    <ul className="sub-menu">
                                        <li>
                                            <a href="index.html">
                                                <span className="mm-text">
                                                    Home One
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="index-2.html">
                                                <span className="mm-text">
                                                    Home Two
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="index-3.html">
                                                <span className="mm-text">
                                                    Home Three
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="menu-item-has-children">
                                    <a href="#">
                                        <span className="mm-text">Shop</span>
                                    </a>
                                    <ul className="sub-menu">
                                        <li className="menu-item-has-children">
                                            <a href="#">
                                                <span className="mm-text">
                                                    Grid View
                                                </span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="shop-3-column.html">
                                                        <span className="mm-text">
                                                            Column Three
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="shop-4-column.html">
                                                        <span className="mm-text">
                                                            Column Four
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="shop-left-sidebar.html">
                                                        <span className="mm-text">
                                                            Left Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="shop-right-sidebar.html">
                                                        <span className="mm-text">
                                                            Right Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <a href="#">
                                                <span className="mm-text">
                                                    Shop List
                                                </span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="shop-list-fullwidth.html">
                                                        <span className="mm-text">
                                                            Full Width
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="shop-list-left-sidebar.html">
                                                        <span className="mm-text">
                                                            Left Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="shop-list-right-sidebar.html">
                                                        <span className="mm-text">
                                                            Right Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <a href="#">
                                                <span className="mm-text">
                                                    Single Product Style
                                                </span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="single-product-gallery-left.html">
                                                        <span className="mm-text">
                                                            Gallery Left
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-gallery-right.html">
                                                        <span className="mm-text">
                                                            Gallery Right
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-tab-style-left.html">
                                                        <span className="mm-text">
                                                            Tab Style Left
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-tab-style-right.html">
                                                        <span className="mm-text">
                                                            Tab Style Right
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-sticky-left.html">
                                                        <span className="mm-text">
                                                            Sticky Left
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-sticky-right.html">
                                                        <span className="mm-text">
                                                            Sticky Right
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <a href="#">
                                                <span className="mm-text">
                                                    Single Product Type
                                                </span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="single-product.html">
                                                        <span className="mm-text">
                                                            Single Product
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-sale.html">
                                                        <span className="mm-text">
                                                            Single Product Sale
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-group.html">
                                                        <span className="mm-text">
                                                            Single Product Group
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-variable.html">
                                                        <span className="mm-text">
                                                            Single Product
                                                            Variable
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-affiliate.html">
                                                        <span className="mm-text">
                                                            Single Product
                                                            Affiliate
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="single-product-slider.html">
                                                        <span className="mm-text">
                                                            Single Product
                                                            Slider
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li className="menu-item-has-children">
                                    <a href="#">
                                        <span className="mm-text">Blog</span>
                                    </a>
                                    <ul className="sub-menu">
                                        <li className="menu-item-has-children has-children">
                                            <a href="#">
                                                <span className="mm-text">
                                                    Grid View
                                                </span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="blog-2-column.html">
                                                        <span className="mm-text">
                                                            Column Two
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="blog-3-column.html">
                                                        <span className="mm-text">
                                                            Column Three
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="blog-left-sidebar.html">
                                                        <span className="mm-text">
                                                            Left Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="blog-right-sidebar.html">
                                                        <span className="mm-text">
                                                            Right Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children has-children">
                                            <a href="#">
                                                <span className="mm-text">
                                                    List View
                                                </span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="blog-list-fullwidth.html">
                                                        <span className="mm-text">
                                                            List Fullwidth
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="blog-list-left-sidebar.html">
                                                        <span className="mm-text">
                                                            List Left Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="blog-list-right-sidebar.html">
                                                        <span className="mm-text">
                                                            List Right Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children has-children">
                                            <a href="#">
                                                <span className="mm-text">
                                                    Blog Details
                                                </span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="blog-details-left-sidebar.html">
                                                        <span className="mm-text">
                                                            Left Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="blog-details-right-sidebar.html">
                                                        <span className="mm-text">
                                                            Right Sidebar
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children has-children">
                                            <a href="#">
                                                <span className="mm-text">
                                                    Blog Format
                                                </span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="blog-gallery-format.html">
                                                        <span className="mm-text">
                                                            Gallery Format
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="blog-audio-format.html">
                                                        <span className="mm-text">
                                                            Audio Format
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="blog-video-format.html">
                                                        <span className="mm-text">
                                                            Video Format
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li className="menu-item-has-children">
                                    <a href="#">
                                        <span className="mm-text">Pages</span>
                                    </a>
                                    <ul className="sub-menu">
                                        <li>
                                            <a href="my-account.html">
                                                <span className="mm-text">
                                                    My Account
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="login-register.html">
                                                <span className="mm-text">
                                                    Login | Register
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="wishlist.html">
                                                <span className="mm-text">
                                                    Wishlist
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="cart.html">
                                                <span className="mm-text">
                                                    Cart
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="checkout.html">
                                                <span className="mm-text">
                                                    Checkout
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="compare.html">
                                                <span className="mm-text">
                                                    Compare
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="faq.html">
                                                <span className="mm-text">
                                                    FAQ
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="404.html">
                                                <span className="mm-text">
                                                    Error 404
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="coming-soon_page.html">
                                                <span className="mm-text">
                                                    Comming Soon
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                        <nav className="offcanvas-navigation user-setting_area">
                            <ul className="mobile-menu">
                                <li className="menu-item-has-children active">
                                    <a href="#">
                                        <span className="mm-text">
                                            User Setting
                                        </span>
                                    </a>
                                    <ul className="sub-menu">
                                        <li>
                                            <a href="my-account.html">
                                                <span className="mm-text">
                                                    My Account
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="login-register.html">
                                                <span className="mm-text">
                                                    Login | Register
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="menu-item-has-children">
                                    <a href="#">
                                        <span className="mm-text">
                                            Currency
                                        </span>
                                    </a>
                                    <ul className="sub-menu">
                                        <li>
                                            <a href="javascript:void(0)">
                                                <span className="mm-text">
                                                    EUR €
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">
                                                <span className="mm-text">
                                                    USD $
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="menu-item-has-children">
                                    <a href="#">
                                        <span className="mm-text">
                                            Language
                                        </span>
                                    </a>
                                    <ul className="sub-menu">
                                        <li>
                                            <a href="javascript:void(0)">
                                                <span className="mm-text">
                                                    English
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">
                                                <span className="mm-text">
                                                    Français
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">
                                                <span className="mm-text">
                                                    Romanian
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">
                                                <span className="mm-text">
                                                    Japanese
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
