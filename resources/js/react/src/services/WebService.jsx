import api, { getConfig } from "./api";

export const homeData = async () => {
    return await api.get("/api/tr");
};

export const getSingleProduct = async (category, slug, token) => {
    let url;
    if (category) {
        url = `/api/tr/${category}/${slug}`;
    } else {
        url = `/api/tr/${slug}`;
    }
    return await api.get(url, getConfig(token));
};

export const addWishToList = async (productObj, token) => {
    return await api.post(
        "/api/me/wishlist",
        {
            product_number: productObj.product_number,
            price: productObj.price,
            product_stock_id: productObj.product_stock_id
        },
        getConfig(token)
    );
};

export const addCartToList = async (slug, variant, token) => {
    if (token) {
        return await api.post(
            "/api/me/cart/toggle",
            {
                product_slug: slug,
                color: variant.color,
                size: variant.size
            },
            getConfig(token)
        );
    } else {
        return await api.post("/api/cart/toggle", {
            product_slug: slug,
            color: variant.color,
            size: variant.size
        }, { withCredentials: true });
    }
};

export const updateCartQuantityService = async (product, quantity, token) => {
    return await api.put(
        "/api/me/cart",
        {
            product_slug: product.product_slug,
            product_stock_id: product.product_stock_number,
            quantity: quantity
        },
        getConfig(token)
    );
};
export const updateCartCookieQuantityService = async (product, quantity) => {
    return await api.put(
        "/api/cart",
        {
            product: product,
            quantity: quantity
        }
    );
};

export const getWishList = async (token) => {
    return await api.get("/api/me/wishlist", getConfig(token));
};
export const destroyWish = async (slug, token) => {
    return await api.delete(`/api/me/wishlist/${slug}`, getConfig(token));
};

export const getCartList = async () => {
    return await api.get("/api/cart");
};

export const destroyCart = async (product, token) => {
    const data = {
        product_slug: product.product_slug,
        product_stock_number: product.product_stock_number,
    };
    if (token) {
        return await api.post(`/api/me/cart/delete`, data, getConfig(token));
    } else {
        return await api.post(`/api/cart/delete`, data);
    }
};

export const matchCart = async (cart, token) => {
    return await api.post(
        "/api/cart/products-info-match",
        {
            cart: cart
        },
        getConfig(token)
    );
};
