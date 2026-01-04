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
      <main style={{ minHeight: 'calc(100vh - 626px)' }}>
        <Outlet/>
      </main>
      <Footer/>
    </>
  )
}

export default Main
