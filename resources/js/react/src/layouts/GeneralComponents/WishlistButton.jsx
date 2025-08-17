import React, { useEffect, useState } from "react";
import { addWishToList } from "../../services/WebService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContex";
import { CircularProgress } from "@mui/material";

function WishlistButton({ productObj, changeWishStatue }) {
    const navigate = useNavigate();
    const [isWish, setIsWish] = useState(productObj.myWish);
    const { errorShow, accessToken } = useAuth();
    const [updating, setUpdating] = useState(false);

    const WishClick = async (e) => {
        e.preventDefault();
        setUpdating(true);
        if (!accessToken) {
            navigate("/login#signIn");
            const error = { response: {data:'',status:401} };
            errorShow(error);
        } else {
            try {
                const res = await addWishToList(productObj, accessToken);
                const status = res.data.status;
                //console.log(res.data);
                if (status === "added") {
                    setIsWish(true);
                    changeWishStatue(true);
                } else if (status === "removed") {
                    setIsWish(false);
                    changeWishStatue(false);
                }
                setUpdating(false);
            } catch (error) {
                console.log(error);
                errorShow(error);
                setUpdating(false);
            }
        }
    };
    useEffect(()=>{
        setIsWish(productObj.myWish)
        //console.log(productObj);
    },[productObj])
    return (
        <>
            <a

                className="qty-wishlist_btn"
                data-bs-toggle="tooltip"
                title={isWish ? "Favoriden Çıkar":"Favoriye Ekle"}
            >
                {updating? (<CircularProgress size="sm" sx={{width:'13px'}} />) : (
                    isWish ? (
                    <i
                        onClick={WishClick}
                        className="ion-android-favorite"
                        style={{ color: "#cda557" }}
                    ></i>
                ) : (
                    <i onClick={WishClick} className="ion-android-favorite-outline"></i>
                )
                )}

            </a>
        </>
    );
}

export default WishlistButton;
