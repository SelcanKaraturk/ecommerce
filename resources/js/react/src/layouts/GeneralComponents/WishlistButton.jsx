import React, { useEffect, useState } from "react";
import { addWishToList } from "../../services/WebService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContex";


function WishlistButton({ productObj, user }) {
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    const [isWish, setIsWish] = useState(false);
    const {errorShow} = useAuth();

    // useEffect(()=>{
    //     console.log(isWish)
    // },[isWish]);


    const WishClick =  async (e) => {
        e.preventDefault();

        try {
           const res = await addWishToList(productObj);
           const status = res.data.status;
           console.log(status);
           if(status === "added"){
                setIsWish(true);
           }else if (status === "removed") {
                setIsWish(false);
            }
           //setResponse(res);
        } catch (error) {
            errorShow(error);
        }
        if(!user){
            navigate('/login#signIn');
        }
        console.log(isWish);
        //console.log(user);
        //console.log(response);
    };

    return (
        <>
            <a
                onClick={WishClick}
                className="hiraola-add_compare"
                data-bs-toggle="tooltip"
                data-placement="top"
                title="Add To Wishlist"
            >
                {isWish ? <i className="ion-android-favorite" style={{color: '#cda557' }}></i>
                : <i className="ion-android-favorite-outline" ></i>}


            </a>
        </>
    );
}

export default WishlistButton;
