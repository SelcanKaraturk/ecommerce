import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCartToList } from "../../services/WebService";
import { toast } from "react-toastify";
import { useAuth } from "../../services/AuthContex";
import { CircularProgress } from "@mui/material";

function CartButton({ product, productVarient }) {
    const { errorShow, accessToken, cart, setCart, setMiniCart } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addCart = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            if (accessToken) {
                const { data } = await addCartToList(
                    productVarient.product_number,
                    productVarient.stock_number,
                    accessToken
                );
                if (data.status === "success") {
                    toast.success(data.message);
                    if (data.process === "delete") {
                        setCart(
                            cart.filter(
                                (i) =>
                                    !(
                                        i.product_number ===
                                            productVarient.product_number &&
                                        i.stock_number ===
                                            productVarient.stock_number
                                    )
                            )
                        );
                    } else {
                        const createdItem = {
                            stock_number: data.item.product_stock_id,
                            product_number: data.item.product_id,
                            color: productVarient.color,
                            size: productVarient.size,
                            stock: productVarient.stock,
                            quantity: 1,
                            product_name: product.product_name,
                            product_slug: product.product_slug,
                            product_price: product.product_price,
                            product_images: product.product_images,
                            category_slug: product.category_slug,
                        };
                        setCart([...cart, createdItem]);
                        console.log(data);
                    }
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await addCartToList(
                    productVarient.product_number,
                    productVarient.stock_number
                );
                if(data.satus === 'error'){
                    toast.error(data.message);
                }else{
                    toast.success(data.message);
                    setCart(data.data);
                }

            }
            setMiniCart(true);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setMiniCart(false);
        }

        setLoading(false);
        setMiniCart(true);
    };
    // console.log(product)
    return (
        <>
            {loading ? (
                <CircularProgress size="sm" />
            ) : (
                <a
                    style={{
                        cursor: "pointer",
                    }}
                    className="qty-cart_btn"
                    onClick={addCart}
                >
                    {product &&
                    cart.length > 0 &&
                    cart.find(
                        (i) =>
                            i.product_number ===
                                productVarient.product_number &&
                            i.stock_number === productVarient?.stock_number
                    )
                        ? "Sepetten Çıkar"
                        : "Sepete Ekle"}
                </a>
            )}
        </>
    );
}

export default CartButton;
