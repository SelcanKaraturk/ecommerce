import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../companents/Navbar'
import Footer from '../companents/Footer'

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
