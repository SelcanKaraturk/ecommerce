import React, { useState } from "react";
import ProductForm from "./ProductForm";
import { createProduct } from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";
import { toast } from "react-toastify";
import { Dialog } from "@mui/material";

function AddProduct({ categories, onCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  const handleSubmit = async (formData, setErrors) => {
    setLoading(true);
    try {
      const { data } = await createProduct(formData, accessToken);
      if (data.status === "success") {
        onCreated(data.data);
        toast.success(data.message);
        setOpen(false);
      } else {
        toast.error("Beklenmeyen Bir Hata Oluştu.");
      }
    } catch (error) {
      if (error?.response?.status === 422) setErrors(error.response.data.errors);
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>ÜRÜN EKLE</button>
      </div>
      {open && (
        <Dialog open={open} maxWidth="sm" fullWidth>
          <ProductForm
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            categories={categories}
            isEdit={false}
            loading={loading}
          />
        </Dialog>
      )}
    </>
  );
}

export default AddProduct;