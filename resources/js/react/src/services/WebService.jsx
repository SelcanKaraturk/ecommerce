import api, { getConfig } from "./api";
import { useAuth } from "./AuthContex";

export const homeData = async () => {
    return await api.get("/api/tr");
};

export const getSingleProduct = async (category, slug, token) => {
    if (token) {
        return await api.get(`/api/me/tr/${category}/${slug}`,getConfig(token));
    } else {
        return await api.get(`/api/tr/${category}/${slug}`);
    }
};

export const addWishToList = async (productObj, token) => {
    const { product_slug, price } = productObj;
    return await api.post(
        "/api/me/wishlist",
        { product_slug, price },
        getConfig(token)
    );
};

export const addCartToList = async (slug, token) => {
    return await api.post(
        "/api/me/cart",
        { slug },
        getConfig(token)
    );
};

export const getWishList = async (token) => {
    return await api.get(
        "/api/me/wishlist",
        getConfig(token)
    );
};
export const destroyWish = async (slug,token) => {
    return await api.delete(
        `/api/me/wishlist/${slug}`,
        getConfig(token)
    );
};

