import React, { useEffect, useState } from "react";
import { addWishToList } from "../../services/WebService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContex";
import { error } from "jquery";

function WishlistButton({ productObj }) {
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    const [isWish, setIsWish] = useState(productObj.myWish);
    const { errorShow, accessToken } = useAuth();

    const WishClick = async (e) => {
        e.preventDefault();
        if (!accessToken) {
            navigate("/login#signIn");
            const error = { response: {data:'',status:401} };
            errorShow(error);
        } else {
            try {
                const res = await addWishToList(productObj, accessToken);
                const status = res.data.status;
                console.log(res);
                if (status === "added") {
                    setIsWish(true);
                } else if (status === "removed") {
                    setIsWish(false);
                }
            } catch (error) {
                errorShow(error);
            }
        }
    };

    return (
        <>
            <a
                onClick={WishClick}
                className="qty-wishlist_btn"
                data-bs-toggle="tooltip"
                title={isWish ? "Favoriden Çıkar":"Favoriye Ekle"}
            >
                {isWish ? (
                    <i
                        className="ion-android-favorite"
                        style={{ color: "#cda557" }}
                    ></i>
                ) : (
                    <i className="ion-android-favorite-outline"></i>
                )}
            </a>
        </>
    );
}

export default WishlistButton;
