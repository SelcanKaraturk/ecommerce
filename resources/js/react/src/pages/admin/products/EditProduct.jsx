import {
    Close,
    Delete,
    Code,
    Edit,
} from "@mui/icons-material";
import { NumericFormat } from "react-number-format";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../services/AuthContex";
import ValidateError from "../../auth/ValidateError";
import Chip from "@mui/material/Chip";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createProduct } from "../../../services/AdminService";
import Loading from "../../../layouts/GeneralComponents/Loading";
import { toast } from "react-toastify";

function EditProduct({ categories, product }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: product.product_name,
        content: product.product_content,
        parent_slug: product.categories?.map(c => c.slug) || [],
        price: product.product_price,
        discount: product.product_discount,
        color: "",
        size: "",
        quantity: "",
        images: product.product_images,
    });
    const [preview, setPreview] = useState([]);
    const [errors, setErrors] = useState(null);
    const { accessToken } = useAuth();
    const [htmlMode, setHtmlMode] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        console.log(product);
        console.log(categories);
        console.log(form)
    }, [product]);

    const handleCancel = () => {
        setForm({
            name: "",
            parent_slug: [],
            images: [],
            content: "",
            price: "",
            discount: "",
            color: "",
            size: "",
            quantity: "",
        });
        setPreview([]);
        setOpen(false); // modal kapat
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        // setForm({ ...form, [e.target.name]: e.target.value });
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

    const handleImageDelete = (index) => {
        // preview'den çıkar
        const newPreview = [...preview];
        newPreview.splice(index, 1);
        setPreview(newPreview);

        // form.images'den de çıkar
        const newImages = [...form.images];
        newImages.splice(index, 1);
        setForm({ ...form, images: newImages });
    };

    const cleanNumber = (value) => {
        if (!value) return 0;
        return Number(value.replace(/[₺,%\s]/g, ""));
    };

    const handleSubmit = async () => {
        setLoad(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("content", form.content);
            formData.append("parent_slug", form.parent_slug);
            formData.append("price", cleanNumber(form.price));
            formData.append("discount", cleanNumber(form.discount));
            formData.append("color", form.color);
            formData.append("size", form.size);
            formData.append("quantity", form.quantity);

            if (form.images) {
                form.images.forEach((file) => {
                    formData.append("images[]", file);
                });
            }

            //formData.forEach((e) => console.log(e));

            const { data } = await createProduct(formData, accessToken);
            console.log(data);
            if (data.status === "success") {
                onCreated(data.data);
                toast.success(data.message);
                handleCancel();
                setLoad(false);
            } else {
                toast.error("Beklenmeyen Bir Hata Oluştu.");
                setLoad(false);
            }
        } catch (error) {
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.error(error);
            setLoad(false);
        }
    };

    return (
        <>
            <IconButton
                size="small"
                color="success"
                aria-label="update"
                onClick={() => setOpen(!open)}
            >
                <Edit />
            </IconButton>

            <Dialog open={open} disableEscapeKeyDown fullWidth maxWidth="sm">
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Ürün Ekle
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
                        label="Ürün Adı"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 1 }}
                    />
                    {ValidateError(errors, "name")}

                    <div className="position-relative">
                        <label
                            style={{
                                marginBottom: "8px",
                                display: "block",
                            }}
                        >
                            Ürün Açıklaması
                        </label>

                        {!htmlMode ? (
                            <ReactQuill
                                className="text-editor"
                                theme="snow"
                                value={form.content}
                                onChange={(value) =>
                                    setForm({ ...form, content: value })
                                }
                            />
                        ) : (
                            <textarea
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    marginTop: "10px",
                                    fontFamily: "monospace",
                                }}
                                value={form.content}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        content: e.target.value,
                                    })
                                }
                            />
                        )}
                        <IconButton
                            color="primary"
                            sx={{
                                position: "absolute",
                                top: "33px",
                                right: "10px",
                            }}
                            onClick={() => setHtmlMode(!htmlMode)}
                        >
                            <Code />
                        </IconButton>
                    </div>
                    {ValidateError(errors, "content")}
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <NumericFormat
                                error={!!errors?.price}
                                value={form.price}
                                name="price"
                                onChange={handleChange}
                                fullWidth
                                customInput={TextField}
                                thousandSeparator
                                valueIsNumericString
                                allowNegative={false}
                                decimalScale={2}
                                prefix="₺"
                                label="Fiyat"
                            />
                            {ValidateError(errors, "price")}
                        </Grid>
                        <Grid size={6}>
                            <NumericFormat
                                error={!!errors?.discount}
                                value={form.discount}
                                name="discount"
                                onChange={handleChange}
                                fullWidth
                                customInput={TextField}
                                valueIsNumericString
                                allowNegative={false}
                                prefix="%"
                                label="İndirim"
                            />
                            {ValidateError(errors, "discount")}
                        </Grid>
                    </Grid>

                    <FormControl fullWidth>
                        <InputLabel id="demo-multiple-chip-label">
                            Kategori
                        </InputLabel>
                        <Select
                            name="parent_slug"
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={form.parent_slug}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    id="select-multiple-chip"
                                    label="Chip"
                                />
                            }
                            renderValue={(selected) => (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                    }}
                                >
                                    {selected.map((slug) => {
                                        const category = categories.find(
                                            (c) => c.slug === slug
                                        );
                                        return (
                                            <Chip
                                                key={slug}
                                                label={category?.name || slug}
                                            />
                                        );
                                        // <Chip key={value} label={value} />
                                    })}
                                </Box>
                            )}
                            // MenuProps={MenuProps}
                        >
                            {categories.map((c) => (
                                <MenuItem key={c.slug} value={c.slug}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {ValidateError(errors, "parent_slug")}
                    <Grid container spacing={2}>
                        <Grid size={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-multiple-color-label">
                                    Renk
                                </InputLabel>
                                <Select
                                    name="color"
                                    labelId="demo-multiple-color-label"
                                    id="demo-multiple-chip"
                                    value={form.color}
                                    onChange={handleChange}
                                    input={
                                        <OutlinedInput
                                        // id="select-multiple-chip"
                                        // label="Chip"
                                        />
                                    }
                                >
                                    <MenuItem key={1} value={"Beyaz Altın"}>
                                        Beyaz Altın
                                    </MenuItem>
                                    <MenuItem key={2} value={"Gold"}>
                                        Gold
                                    </MenuItem>
                                    <MenuItem key={3} value={"Rose"}>
                                        Rose Gold
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-multiple-size-label">
                                    Ölçü
                                </InputLabel>
                                <Select
                                    name="size"
                                    labelId="demo-multiple-size-label"
                                    value={form.size}
                                    onChange={handleChange}
                                    input={<OutlinedInput />}
                                >
                                    <MenuItem key={1} value="a">
                                        a
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={4}>
                            <TextField
                                error={!!errors?.quantity}
                                helperText={errors?.quantity}
                                label="Adet"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ min: 1 }}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
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
                                <Grid size={4} key={index}>
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
                    {load ? (
                        <Loading style={"m-height"} />
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                        >
                            Kaydet
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EditProduct;
