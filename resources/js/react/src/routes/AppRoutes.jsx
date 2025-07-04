import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/products/Products";
import LangGuard from "../guard/LangGuard";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/tr" />} />
            <Route path="/:lang" element={<LangGuard />}>
                <Route element={<MainLayout/>}>
                    <Route index element={<Home />} />
                    <Route path="altin" element={<Products />} />
                    <Route path="pirlanta" element={<Products />} />
                     <Route path="hakkimizda" element={<AboutUs />} />
                     <Route path="iletisim" element={<Contact />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;
