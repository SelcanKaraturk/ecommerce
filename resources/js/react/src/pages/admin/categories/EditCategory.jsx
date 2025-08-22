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
    Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { updateCategory } from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";

export default function EditCategory({ category, onUpdated, categories }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: category.name,
        parent_slug: category.parent_slug || "",
        images: category.images || [],
    });
    const { accessToken } = useAuth();
    const [preview, setPreview] = useState(category.images);

    const handleChange = (e) => {
        console.log(e.target);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // birden fazla dosya seçilebilir
    if (files.length > 0) {

        setForm((prev) => ({
            ...prev,
            images: [...(prev.images || []), ...files],
        }));


        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreview((prev) => [...(prev || []), ...newPreviews]);
    }
};


    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            if (form.parent_slug) formData.append("parent_slug", form.parent_slug);
            if (form.images){
                form.images.forEach((file) => {
                formData.append("images[]", file);
            });
            }
            formData.append("_method", "PUT");

            const { data } = await updateCategory(
                category.slug,
                formData,
                accessToken
            );
            console.log(data);
            // onUpdated(data); // listeyi yenile
            // setOpen(false);
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
                <EditIcon />
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Kategori Düzenle</DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                        width: "500px",
                        height: "400px",
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
                            value={
                                form.parent_slug || category.parent_slug || ""
                            } // varsayılan parent_slug olsun
                            onChange={handleChange}
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
                                <Grid item xs={4} key={index}>
                                    <img
                                        src={i}
                                        alt=""
                                        style={{
                                            width: "120", // grid alanına otursun
                                            height: "auto",
                                            borderRadius: 8, // köşeler hafif yuvarlak
                                            boxShadow:
                                                "0 2px 6px rgba(0,0,0,0.15)", // gölge
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Vazgeç</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                    >
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
