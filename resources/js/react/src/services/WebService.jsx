import api, { getConfig } from "./api";

export const homeData = async () => {
    return await api.get("/api/tr");
};

export const getMenu = async () => {
    return await api.get("/api/menu");
};

export const getSingleProduct = async (category, slug, token, price_min = undefined, price_max = undefined, sort = undefined, size = undefined, materials = undefined) => {
    let url;
   console.log(price_min, price_max);
    if (slug) {
        url = `/api/tr/${category}/${slug}`;
    } else {
        url = `/api/tr/${category}`;
    }

    const config = getConfig(token);
    const params = {};

    // Sadece price_min ve price_max varsa params ekle
    if (price_min !== undefined && price_max !== undefined) {
        params.price_min = price_min;
        params.price_max = price_max;
    }
    if (sort !== undefined) {
        params.sort = sort;
    }
    if (size !== undefined && size !== "") {
        params.size = size;
    }
    if (Array.isArray(materials) && materials.length > 0) {
        params.materials = materials;
    }
    if (Object.keys(params).length > 0) {
        config.params = params;
    }
    return await api.get(url, config);
};

export const getGoldRate = async () => {
    return await api.get('/api/gold-rate');
};

export const addWishToList = async (productObj, token) => {
    return await api.post(
        "/api/me/wishlist",
        {
            product_slug: productObj.product_slug,
            price: productObj.price,
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
            color: product.color,
            size: product.size,
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
        color: product.color,
        size: product.size,
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

export const matchCartForUser = async (token) => {
    return await api.get(
        "/api/me/cart/products-info-match",
        getConfig(token)
    );

}

export const updateSelectedAddress = async (addressId, token) => {
    return await api.post(
        "/api/me/addresses/select",
        {
            address_id: addressId
        },
        getConfig(token)
    );
}

export const pay = async (paymentData, token) => {
    console.log(token);
    return await api.post(
        "/api/checkout/pay",
        {
            cart: paymentData.cart,
            address: paymentData.address,
            total_price: paymentData.total_price
        },
        getConfig(token)
    );
}