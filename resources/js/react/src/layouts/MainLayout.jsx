import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../companents/Navbar'
import Footer from '../companents/Footer'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Main() {
  return (
    <>
    <Navbar/>
        <Outlet/>
    <Footer/>
    </>
  )
}

export default Main
