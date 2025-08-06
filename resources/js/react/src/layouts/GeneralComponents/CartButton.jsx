import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCartToList } from "../../services/WebService";
import { toast } from "react-toastify";
import { useAuth } from "../../services/AuthContex";
import { CircularProgress } from "@mui/material";

function CartButton({ product, handleCartClick, productVarients }) {
    const { errorShow, accessToken, cart, setCart, setMiniCart } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addCart = async (e) => {
        setLoading(true);
            e.preventDefault();
            try {
                const { data } = await addCartToList(product.product_number, productVarients.id);
                const response = data.original.data;
                if (data.status === "error") {
                    toast.error(data.message);
                }else{
                    toast.success(data.original.message);
                    setCart(response);
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
    // console.log(productVarients)
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
                    (product.in_carts_exists ||
                        (cart.length > 0 &&
                            cart.find((i) => i.product_number === product.product_number &&  i.stock_number === productVarients?.id)
                        ))
                        ? "Sepetten Çıkar"
                        : "Sepete Ekle"}
                </a>
            )}
        </>
    );
}

export default CartButton;
