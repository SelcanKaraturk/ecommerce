import api, { getConfig } from "./api";

export const getProductAll = async (token) => {
    return await api.get("/api/admin/products", getConfig(token));
};

export const getCategoryAll = async (token) => {
    return await api.get("/api/admin/categories", getConfig(token));
};

export const getCategory = async (categoryId, token) => {
    return await api.get(`/api/admin/categories/${categoryId}`, getConfig(token));
};

export const updateCategory = async (category_slug, data, token) => {
    return await api.post(`/api/admin/categories/${category_slug}`, data, getConfig(token, "multipart/form-data"));
};

