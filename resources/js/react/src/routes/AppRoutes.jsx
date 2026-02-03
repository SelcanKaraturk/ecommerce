import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/products/Products";
import LangGuard from "../guard/LangGuard";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MyAccount from "../pages/user/MyAccount";
import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";
import WishList from "../pages/user/WishList";
import ProductDetail from "../pages/products/ProductDetail";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/Checkout";
import VerifyEmail from "../pages/auth/VerifyEmail";
import AuthLayout from "../layouts/AuthLayout";
import AdminLogin from "../pages/admin/adminLogin";
import AdminProducts from "../pages/admin/products/Products";
import Dashboard from "../pages/admin/Dashboard";
import AdminCategories from "../pages/admin/categories/Categories";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/tr" />} />
            <Route path="/:lang" element={<LangGuard />}>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="altin" element={<Products />} />
                    <Route path="pirlanta" element={<Products />} />
                    <Route path="snr-uretim/:slug" element={<ProductDetail />} />
                    <Route path=":category/:slug" element={<ProductDetail />} />
                    <Route path=":slug" element={<ProductDetail />} />
                    <Route path="hakkimizda" element={<AboutUs />} />
                    <Route path="iletisim" element={<Contact />} />
                    <Route path="odeme" element={<Checkout />} />
                    <Route path="sepet" element={<Cart />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="hesabim" element={<MyAccount />} />
                        <Route path="favorilerim" element={<WishList />} />
                    </Route>
                </Route>
            </Route>

            {/* Auth Rotaları */}
            <Route element={<MainLayout />}>

                <Route path="login" element={<Login />} />  {/* <GuestRoute><Login/></GuestRoute> */}
                <Route path="register" element={<Register />} />
                <Route path="logout" element={<Navigate to="/tr" />} />
                <Route path="verify-email" element={<VerifyEmail />} />

                {/* <Route path="/tr" > element={<PrivateRoutes roles={["user"]} />}
                </Route> */}
            </Route>

            {/* Admin Routes */}
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin/logout" element={<Navigate to="/admin/login" />} />
            <Route path="admin" element={<AuthLayout />}>
                <Route path="" index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;
