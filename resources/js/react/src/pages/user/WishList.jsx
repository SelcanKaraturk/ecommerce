import React, { useState, useEffect } from "react";
import CartButton from "../../layouts/GeneralComponents/CartButton";
import { getWishList, destroyWish } from "../../services/WebService";
import { useAuth } from "../../services/AuthContex";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../layouts/GeneralComponents/Loading";
import { CloseRounded, LanguageSharp, ShoppingBag, ShoppingBagOutlined } from "@mui/icons-material";

function WishList() {
    const { accessToken } = useAuth();
    const [wishList, setWishList] = useState([]);
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();
    const lang = useParams().lang || 'tr';
    const [hoveredProductSlug, setHoveredProductSlug] = useState(null);
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
            {wishList?.length > 0 ? (
                <div className="hiraola-wishlist_area">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="shop-product-wrap row justify-content-center">

                                    {wishList?.length > 0 &&
                                        wishList.map((e, index) => (
                                            <div className="col-md-3 col-sm-4">
                                                <div className="slide-item account-wishlist-item" style={{ position: 'relative' }}>
                                                    {/* Close Button */}
                                                    <CloseRounded className="account-wishlist-close"
                                                        fontSize="small" onClick={(i) => deleteWish(e.slug)}
                                                    />
                                                    <div className="single_product">
                                                        <div className="product-img">
                                                            <a href="single-product.html">
                                                                <img className="primary-img" src={`/storage/${e.images?.[0] ?? "https://placehold.co/160x160"}`} alt={e.name} />
                                                                <img className="secondary-img" src={`/storage/${e.images?.[1] ?? "https://placehold.co/160x160"}`} alt={e.name} />
                                                            </a>
                                                        </div>
                                                        <div className="hiraola-product_content px-3">
                                                            <div className="product-desc_info">
                                                                <h6>
                                                                    <a className="product-name" href={`/${lang}/${e.category.slug}/${e.slug}`}>
                                                                        {e.name}
                                                                    </a>
                                                                </h6>
                                                                <div className="price-box">
                                                                    <span className="old-price ms-0">{e.price} ₺</span>
                                                                    <span className="new-price">{e.discounted_price} ₺</span>
                                                                </div>
                                                                <div className="additional-add_action">
                                                                    <ul>
                                                                        <li>
                                                                            <span
                                                                                className="product-cart-corner"
                                                                                aria-label="Sepete ekle"
                                                                                onMouseEnter={() => setHoveredProductSlug(e.product_slug)}
                                                                                onMouseLeave={() => setHoveredProductSlug(null)}
                                                                                onClick={() => setSelectedShoppingProduct(e)}
                                                                            >
                                                                                {hoveredProductSlug === e.product_slug ?
                                                                                    (<ShoppingBag data-bs-toggle="modal" data-bs-target="#exampleModalCenter" style={{ fontSize: '22px' }} />)
                                                                                    :
                                                                                    (<ShoppingBagOutlined data-bs-toggle="modal" data-bs-target="#exampleModalCenter" style={{ fontSize: '22px' }} />)}
                                                                            </span>

                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                </div>
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

                        </div>
                    </div>
                </div>
            ) : (
                <div className="checkout-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="text-center">
                                    <p className="fw-bold">Favori ürünlerinizi hemen ekleyin. <br /> Size özel fırsatları kaçırmayın.</p>

                                    <button
                                        style={{
                                            background: '#595959',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 24px',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            marginTop: '0',
                                        }}
                                        onClick={() => window.location.href = '/'}
                                    >
                                        Alışverişe Devam Et
                                    </button> <br />
                                    <img className="empty-card" src="/assets/images/wish-bag.png" alt="Empty Wish List" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </>

    );
}

export default WishList;
