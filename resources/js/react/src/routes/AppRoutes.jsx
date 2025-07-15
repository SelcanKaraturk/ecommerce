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
import PrivateRoutes from "./PrivateRoutes";
import GuestRoute from "./GuestRoute";
import WishList from "../pages/user/WishList";
import ProductDetail from "../pages/products/ProductDetail";
import Cart from "../pages/user/Cart";


function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/tr" />} />
            <Route path="/:lang" element={<LangGuard />}>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="altin" element={<Products />} />
                    <Route path="pirlanta" element={<Products />} />
                    <Route path=":category/:slug" element={<ProductDetail />} />
                    <Route path="hakkimizda" element={<AboutUs />} />
                    <Route path="iletisim" element={<Contact />} />
                </Route>
            </Route>

            {/* Auth Rotaları */}
            <Route element={<MainLayout />}>

                <Route path="login" element={<Login/>} />  {/* <GuestRoute><Login/></GuestRoute> */}


                <Route path="register" element={<Register />} />
                <Route path="logout" element={<Navigate to="/tr" />} />

                 <Route path="/me" element={<PrivateRoutes roles={["user"]} />} >
                    <Route index element={<MyAccount />} />
                    <Route path="wishlist" element={<WishList/>}/>

                    <Route path="cart" element={<Cart/>}/>
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;
