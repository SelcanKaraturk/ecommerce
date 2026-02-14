import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCartToList } from "../../services/WebService";
import { toast } from "react-toastify";
import { useAuth } from "../../services/AuthContex";
import { CircularProgress } from "@mui/material";

function CartButton({ product, variant, setError, slug, onColorErrorChange }) {
    const { errorShow, accessToken, cart, setCart, setMiniCart } = useAuth();
    const [loading, setLoading] = useState(false);
    const [button, setButton] = useState(false);
    const navigate = useNavigate();

    // Ölçü veya renk değiştiğinde uyarı ve butonu sıfırla
    useEffect(() => {
        setButton(false);
        if (setError) setError(null);
        if (onColorErrorChange) onColorErrorChange(false);
    }, [variant?.color, variant?.size]);

    const keepCarting = async () => {
        try {
            if (accessToken) {
                const { data } = await addCartToList(
                    slug,
                    variant,
                    accessToken
                );
                if (data.status === "success") {
                    toast.success(data.message);
                    if (data.process === "delete") {
                        setCart(data.data);
                        if (data.data.length > 0) setMiniCart(true);
                    } else {
                        setCart(data.data);
                        if (data.data.length > 0) setMiniCart(true);
                        console.log(data.data);
                    }
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await addCartToList(
                    slug,
                    variant
                );
                if (data.status === 'error') {
                    toast.error(data.message);
                } else {
                    //console.log(data);
                    toast.success(data.message);
                    setCart(data.data);
                    console.log(data.data);
                    if (data.data && data.data.length > 0) setMiniCart(true);
                    setButton(false);
                }
                console.log(data);
            }
        } catch (error) {
            console.log(error);
            setMiniCart(false);
        } finally {
            setLoading(false);
        }
    }

    const addCart = async (e) => {
        e.preventDefault();
        setLoading(true);
        const stockVariant = product.variants.find(v => v.color === variant.color && v.size == variant.size);

        if (!variant || variant.color == "" || variant.size == "") {
            if (!variant || variant.color == "") {
                if (onColorErrorChange) onColorErrorChange(true);
            }
            toast("Lütfen istediğiniz ürünün ölçü ve rengini seçiniz.");
            setLoading(false);
            return;
        }

        if (!stockVariant || stockVariant.quantity <= 0) {
            setButton(false);
            setLoading(false);
            if (!product.allow_out_of_stock_cart) {
                setError("Seçtiğiniz ürün stoklarımızda bulunmamakta ve tekli alımlarda özel üretim yapılamamaktadır. Toptan siparişiniz için lütfen <b> WhatsApp </b> üzerinden bizimle iletişime geçiniz.");
                return;
            }
            setError("*İstediğiniz ölçüde ve renkte ürün stoklarımızda mevcut değildir.Sipariş vermeniz halinde 1 - 10 iş günü içerisinde size özel üretilip tarafınıza gönderim sağlanır. <b> Devam etmek için devam et butonuna tıklayınız. </b >");
            setButton(true);
            return;
        }


        keepCarting();
    };
    //console.log(variant);
    //  console.log(cart);
    //console.log(product);
    //  console.log(slug);


    // Color seçimi için örnek bir div render'ı (kendi color seçim component'iniz varsa oraya entegre edin)
    // Aşağıdaki örnek, color seçici div'in border'ını kırmızı yapar
    return (
        <>
            {loading ? (
                <CircularProgress size="sm" />
            ) : (button ? (
                <a
                    role="button"
                    className="qty-cart_btn"
                    onClick={keepCarting}>
                    Devam Et
                </a>
            ) :
                (
                    <a
                        role="button"
                        className="qty-cart_btn"
                        onClick={addCart}
                    >
                        {product &&
                            cart?.length > 0 &&
                            cart.find(
                                (i) =>
                                    i.product_slug ===
                                    slug &&
                                    i.color === variant?.color &&
                                    i.size === variant?.size
                            )
                            ? "Sepetten Çıkar"
                            : "Sepete Ekle"}
                    </a>
                )
            )}
        </>
    );
}

export default CartButton;
