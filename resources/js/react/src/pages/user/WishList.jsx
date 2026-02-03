import React, { useState, useEffect } from "react";
import CartButton from "../../layouts/GeneralComponents/CartButton";
import { getWishList, destroyWish } from "../../services/WebService";
import { useAuth } from "../../services/AuthContex";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../layouts/GeneralComponents/Loading";


function WishList() {
    const { accessToken } = useAuth();
    const [wishList, setWishList] = useState([]);
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const FetchWishList = async (token) => {
            setLoad(true);
            try {
                const { data } = await getWishList(token);
                setWishList(data);
                setLoad(false);
            } catch (error) {
                console.log(error);
                setLoad(false);
            }
        };
        if (!accessToken) {
            navigate('/login')
        } else {
            FetchWishList(accessToken);
        }

    }, []);

    useEffect(() => {
        console.log(wishList);
    }, [wishList]);

    const addedCart = (e) => {
        setWishList((prevList) =>
            prevList.map((item) =>
                item.slug === e.slug
                    ? { ...item, in_carts_exists: e.inCart }
                    : item
            )
        );
    };

    const deleteWish = async (slug) => {
        setLoad(true);
        try {
            const { data } = await destroyWish(slug, accessToken);
            console.log(data);
            if (data.status === 'error') {
                toast.warning(data.message);
            } else if (data.status === 'success') {
                console.log(data);
                toast.success(data.message)
                const deletedList = wishList.filter((i) => i.slug !== slug);
                console.log(deletedList);
                setWishList(deletedList);
            }
            setLoad(false);
        } catch (error) {
            console.log(error);
            setLoad(false);
        }
    };
    return accessToken && (

        <>
            {/* <!--Begin Hiraola's Wishlist Area --> */}
            <div className="hiraola-wishlist_area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            <form>
                                <div className="table-content table-responsive">
                                    <table
                                        className="table"
                                        style={{
                                            border: "1px solid #e5e5e5",
                                        }}
                                    >
                                        <tbody>
                                            {wishList?.length > 0 &&
                                                wishList.map(
                                                    (e, index) => (
                                                        <tr
                                                            key={`${index}-${e.slug}`}
                                                        >
                                                            <td className="hiraola-product_remove border-0">
                                                                <a onClick={(i) => deleteWish(e.slug)}>
                                                                    <i
                                                                        className="fa fa-trash"
                                                                        title="Remove"
                                                                    ></i>
                                                                </a>
                                                            </td>
                                                            <td className="hiraola-product-thumbnail border-0">
                                                                <Link
                                                                    to={`/tr/${e.category.slug}/${e.slug}`}
                                                                >
                                                                    <img
                                                                        src={
                                                                            e
                                                                                .images[0]
                                                                        }
                                                                        alt="Hiraola's Wishlist Thumbnail"
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td className="hiraola-product-name border-0">
                                                                <Link
                                                                    to={`/tr/${e.category.slug}/${e.slug}`}
                                                                >
                                                                    {
                                                                        e.name
                                                                    }
                                                                </Link>
                                                            </td>
                                                            <td className="hiraola-product-price border-0">
                                                                <span className="amount">
                                                                    {`${e.price.toLocaleString(
                                                                        "tr-TR",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )} ₺`}
                                                                </span>
                                                            </td>
                                                            <td className="hiraola-product-name border-0">
                                                                <span className="amount">
                                                                    {e.stock_color}
                                                                </span>
                                                            </td>
                                                            <td className="hiraola-product-stock-status border-0">
                                                                <span className="in-stock">
                                                                    in
                                                                    stock
                                                                </span>
                                                            </td>
                                                            <td className="hiraola-cart_btn">
                                                                {e.in_carts_exists ? (
                                                                    <span className="inCart">Ürün Sepetinizde</span>
                                                                ) : (
                                                                    <CartButton
                                                                        product={
                                                                            e
                                                                        }
                                                                        handleCartClick={
                                                                            addedCart
                                                                        }
                                                                    />
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>
            {/* <!-- Hiraola's Wishlist Area End Here --> */}
        </>

    );
}

export default WishList;
