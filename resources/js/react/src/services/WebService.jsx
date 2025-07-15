import api, {getConfig} from "./api"
import { useAuth } from "./AuthContex";

//const {accessToken} = useAuth();

export const homeData = async ()=>{
    return await api.get('api/tr');
}

export const getSingleProduct = async (category,slug)=>{

    return await api.get(`/api/tr/${category}/${slug}`,{withCredentials:true});
}

export const addWishToList = async (productObj)=>{
    const {product_slug, price} = productObj;
    return await api.post('/api/me/wishlist/toggle');
}
