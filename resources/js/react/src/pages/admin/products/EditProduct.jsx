import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import {  updateProduct } from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";
import { toast } from "react-toastify";
import { Edit } from "@mui/icons-material";
import { Dialog, IconButton } from "@mui/material";

function EditProduct({ product, categories, onUpdated }) {
    const [open, setOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { accessToken } = useAuth();
    console.log("EditProduct product:", product);

    const handleSubmit = async (formData, setErrors) => {
        setSubmitLoading(true);
        try {
            const { data } = await updateProduct(product.product_number, formData, accessToken);
            console.log(data);
            if (data.status === "success") {
                onUpdated && onUpdated(data.data);
                console.log("Product updated:", data.data);
                toast.success(data.message);
                setOpen(false);
            } else {
                toast.error("Beklenmeyen Bir Hata Oluştu.");
            }
        } catch (error) {
            console.log(error);
            if (error?.response?.status === 422) setErrors(error.response.data.errors);
        }
        setSubmitLoading(false);
    };

    return (
    <>
            <IconButton
                size="small"
                color="success"
                aria-label="edit"
                onClick={() => setOpen(true)}
                >
                <Edit />
            </IconButton>
            {open && (
            <Dialog open={open} maxWidth="sm" fullWidth>
                <ProductForm
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                categories={categories}
                initialValues={product}
                isEdit={true}
                loading={submitLoading}
                />
            </Dialog>
            )}
        </>
        
    );
}

export default EditProduct;