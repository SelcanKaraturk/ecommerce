import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCartToList } from "../../services/WebService";
import { toast } from "react-toastify";
import { useAuth } from "../../services/AuthContex";

function CartButton({ product, handleCartClick }) {
    const { errorShow, accessToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log(product);
    // }, [product]);
    const addCart = async (e) => {
        if (!accessToken) {
            navigate("/login#signIn");
            const error = { response: { data: "", status: 401 } };
            errorShow(error);
        } else {
            e.preventDefault();
            setLoading(true);
            try {
                const { data } = await addCartToList(product.slug, accessToken);
                if (data.status === "error") {
                    toast.error(data.message);
                } else if (data.status === "removed") {
                    toast.info(data.message);
                     handleCartClick({slug:product.slug, inCart:false});
                } else if (data.status === "added") {
                    toast.success(data.message);
                    handleCartClick({slug:product.slug, inCart:true});
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    return (
        <>
            {loading ? (
                <div className="mt-3">
                    <div className="spinner-border text-dark" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <a
                    style={{
                        cursor: "pointer",
                    }}
                    className="qty-cart_btn"
                    onClick={addCart}
                >
                    {product && product.in_carts_exists
                        ? "Sepetten Çıkar"
                        : "Sepete Ekle"}
                </a>
            )}
        </>
    );
}

export default CartButton;
