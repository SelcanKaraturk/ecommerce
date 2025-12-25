import { useState } from "react";

export default function useForm(initialState = {}) {
    const [form, setForm] = useState(initialState);
    const [preview, setPreview] = useState(initialState.images || []);
    const [open, setOpen] = useState(false);

    // Input değişikliklerini yakalar
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "file") {
            setForm((prev) => ({ ...prev, [name]: files.length > 1 ? Array.from(files) : files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e, name = "images") => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setForm(prev => ({ ...prev, [name]: [...(prev[name] || []), ...files] }));
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreview(prev => [...(prev || []), ...newPreviews]);
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
    // Formu ilk haline döndürür
    const resetForm = () => setForm(initialState);
    const handleCancel = () => {
        resetForm();
        setPreview(initialState.images || []);
        setOpen(false); // modal kapat
    };

    const handleSubmit = (callback) => (e) => {
        e.preventDefault();
        callback(form);
    };



    return { form, setForm, handleChange, handleFileChange, resetForm, preview, setPreview, handleImageDelete, handleCancel, open, setOpen, handleSubmit };
}
