import React, { useState } from "react";
import { Add, Delete, Close } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Grid,
    DialogActions,
    MenuItem,
    Typography,
} from "@mui/material";
import ValidateError from "../../auth/ValidateError";
import { createCategory } from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";
import { toast } from "react-toastify";
import useForm from "../../../services/hooks/useForm";
function AddCategory({ categories, onCreated }) {
    const { form, setForm, handleChange, handleFileChange, preview, handleImageDelete, handleCancel, open, setOpen } = useForm({
        name: "",
        parent_slug: "",
        images: [],
    });
    const [errors, setErrors] = useState(null);
    const { accessToken } = useAuth();

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("parent_slug", form.parent_slug);
            if (form.images) {
                form.images.forEach((file) => {
                    formData.append("images[]", file);
                });
            }
            //  formData.forEach((e)=>console.log(e));

            const { data } = await createCategory(formData, accessToken);

            if (data.status === "success") {
                onCreated(data.data);
                toast.success(data.message);
                setOpen(false);
                setForm({
                    name: "",
                    parent_slug: "",
                    images: [],
                });
            } else {
                toast.error("Beklenmeyen Bir Hata Oluştu.");
            }
        } catch (error) {
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.error(error);
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                >
                    KATEGORİ EKLE
                </Button>
            </Box>
            {open && (
                <Dialog open={open} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ m: 0, p: 2 }}>
                        Kategori Ekle
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
                            error={!!errors?.name}
                            label="Kategori Adı"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                        {ValidateError(errors, "name")}

                        <Typography
                            sx={{
                                fontSize: "12px !important",
                                color: "#595959 !important",
                                marginBottom: "-18px",
                            }}
                        >
                            *Üst kategori seçmemeniz halinde ana kategori olarak
                            kaydedilir!
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Üst Kategori</InputLabel>
                            <Select
                                error={!!errors?.parent_slug}
                                name="parent_slug"
                                onChange={handleChange}
                                value={form.parent_slug}
                            >
                                {categories
                                    // .filter((c) => c.slug !== category.slug) // kendisini seçemesin
                                    .map((c) => (
                                        <MenuItem key={c.slug} value={c.slug}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        {ValidateError(errors, "parent_slug")}

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
                        {ValidateError(errors, "files")}

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

export default AddCategory;
