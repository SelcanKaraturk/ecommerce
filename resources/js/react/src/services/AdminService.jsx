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

export const deleteCategory = async (category_slug, token) => {
    return await api.delete(`/api/admin/categories/${category_slug}`, getConfig(token));
};

export const createCategory = async (data, token) => {
    return await api.post(`/api/admin/categories`, data, getConfig(token, "multipart/form-data"));
};

export const createProduct = async (data, token) => {
    return await api.post(`/api/admin/products`, data, getConfig(token, "multipart/form-data"));
};


export const updateProduct = async (productId, data, token) => {
    // Eğer data bir FormData ise _method ekle
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
    }
    return await api.post(`/api/admin/products/${productId}`, data, getConfig(token, "multipart/form-data"));
};

export const getPages = async (token, page) => {
    const params = page ? { page } : undefined;
    console.log(params);
    return await api.get("/api/admin/pages", {
        ...getConfig(token, "application/json"),
        params,
    });
};

export const updatePage = async (id, data, token) => {
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
    }
    return await api.post(`/api/admin/pages/${id}`, data, getConfig(token, "multipart/form-data"));
};

export const createPage = async (data, token, parentId, pageId) => {
    if (parentId !== undefined && parentId !== null) {
        data.append('parent_id', String(parentId));
    }
    if (pageId !== undefined && pageId !== null) {
        data.append('page_id', String(pageId));
    }
    return await api.post(`/api/admin/pages`, data, getConfig(token, "multipart/form-data"));
};

export const deletePage = async (id, token) => {
    return await api.delete(`/api/admin/pages/${id}`, getConfig(token));
};

export const updatePageParent = async (id, data, token) => {
    return await api.post(`/api/admin/pages/${id}/update-parent`, data, getConfig(token));
};

