import React, { useState, useEffect } from "react";
import CartButton from "../../layouts/GeneralComponents/CartButton";
import { getWishList, destroyWish } from "../../services/WebService";
import { useAuth } from "../../services/AuthContex";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Cart() {
    const { accessToken } = useAuth();
    const [cartList, setCartList] = useState([]);
    const [load, setLoad] = useState(false);
    return <>
        

    </>;
}

export default Cart;
