import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Box,
} from "@mui/material";
import { Edit, Delete, Close } from "@mui/icons-material";
import { updateCategory } from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";
import { toast } from "react-toastify";
import { getImagePath } from "../../../services/hooks/utils/image";
import useForm from "../../../services/hooks/useForm";

export default function EditCategory({ category, onUpdated, categories }) {
    const { form, setForm, handleChange, handleFileChange, preview, handleImageDelete, handleCancel, open, setOpen } = useForm({
        name: category.name,
        parent_slug: category.parent_slug || "",
        images: category.images || [],
    });
    const { accessToken } = useAuth();
    useEffect(() => {
        setForm({
            name: category.name,
            parent_slug: category.parent_slug || "",
            images: category.images || [],
        });
    }, [category]);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            console.log(form.parent_slug);
            if (form.parent_slug)
                formData.append("parent_slug", form.parent_slug);
            if (form.images) {
                form.images.forEach(file => {
                    if (file instanceof File) {
                        formData.append("images[]", file);
                    } else if (typeof file === "string") {
                        formData.append("existing_images[]", getImagePath(file));
                    }
                });
            }

            formData.append("_method", "PUT");
            formData.forEach((e) => console.log(e));

            const { data } = await updateCategory(
                category.slug,
                formData,
                accessToken
            );
            console.log(data);
            if (data.status === "success") {
                onUpdated(data.data);
                toast.success(data.message);
                setOpen(false);
            } else {
                toast.error('Beklenmeyen Bir Hata Oluştu.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <IconButton
                sx={{ mr: 1 }}
                onClick={() => setOpen(true)}
                size="small"
                color="success"
                aria-label="update"
                
            >
                <Edit />
            </IconButton>
            {open && (
                <Dialog open={open} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ m: 0, p: 2 }}>
                        Kategori Düzenle
                        <IconButton
                            aria-label="close"
                            onClick={handleCancel}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label="Kategori Adı"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mt: 1 }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Üst Kategori</InputLabel>
                            <Select
                                name="parent_slug"
                                value={form.parent_slug || ""} // varsayılan parent_slug olsun
                                onChange={handleChange}
                            >
                                {categories
                                    .filter((c) => c.slug !== category.slug) // kendisini seçemesin
                                    .map((c) => (
                                        <MenuItem key={c.slug} value={c.slug}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        <Button variant="outlined" component="label">
                            Resim Yükle
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                                multiple
                            />
                        </Button>

                        {preview && (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {preview.map((i, index) => (
                                    <Grid size={3} key={index}>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                width: "120px",
                                                height: "120px",
                                                borderRadius: 2,
                                                overflow: "hidden",
                                                "&:hover .overlay": {
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            <img
                                                src={i}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />

                                            {/* overlay ve delete icon */}
                                            <Box
                                                className="overlay"
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    bgcolor: "rgba(0,0,0,0.5)", // koyu arka plan
                                                    backdropFilter: "blur(4px)", // blur efekti
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    opacity: 0,
                                                    transition: "opacity 0.3s",
                                                }}
                                            >
                                                <IconButton
                                                    sx={{ color: "white" }}
                                                    onClick={() =>
                                                        handleImageDelete(index)
                                                    } // kendi delete fonksiyonun
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCancel}>Vazgeç</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                        >
                            Kaydet
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

        </>
    );
}
