import api, { getConfig } from "./api";

export const homeData = async () => {
    return await api.get("/api/tr");
};

export const getSingleProduct = async (category, slug, token) => {
    return await api.get(`/api/tr/${category}/${slug}`,getConfig(token));
};

export const addWishToList = async (productObj, token) => {
    const { product_slug, price, product_varient_id } = productObj;
    return await api.post(
        "/api/me/wishlist",
        { product_slug, price, product_varient_id },
        getConfig(token)
    );
};

export const addCartToList = async (id, stock_id) => {
    return await api.post(
        "/api/cart/toggle",
        { product_id: id, product_stock_id: stock_id }
    );
};

// export const addCartToAuth = async (cart, token) => {
//     return await api.put(
//         "/api/me/cart",
//         { cart },
//         getConfig(token)
//     );
// };

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

export const getCartList = async () => {
    return await api.get(
        "/api/cart"
    );
};

export const destroyCart = async (slug,token) => {
    return await api.delete(
        `/api/me/cart/${slug}`,
        getConfig(token)
    );
};
