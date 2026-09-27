import React, { useRef, useEffect, useCallback, useState } from 'react'
import { IconButton } from '@mui/material'
import { Edit } from '@mui/icons-material'
import useForm from '../../../services/hooks/useForm'
import { useAuth } from '../../../services/AuthContex'
import { updatePage } from '../../../services/AdminService'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select,
    MenuItem, Grid, Box, FormControlLabel, Checkbox, Typography, Paper
} from '@mui/material'
import { Close, Delete, Upload } from '@mui/icons-material'
import { toast } from "react-toastify";
import Loading from '../../../layouts/GeneralComponents/Loading'

export default function EditPage({ item, page, blockTitle, onUpdated }) {
    const { accessToken } = useAuth();
    const initialIsActive = item.is_active === true || item.is_active === 1 || item.is_active === '1';
    const { form, setForm, handleChange, open, setOpen, preview, setPreview, handleFileChange, handleImageDelete, handleCancel } = useForm({
        title: item.title,
        description: item.description || "",
        image_path: item.image_path || "",
        'url': item.url || "",
        'sort_order': item.sort_order || 1,
        'is_active': initialIsActive,
        'metadata': item.metadata || {},
    });
    const textareaRef = useRef(null);
    const editorRef = useRef(null);
    const editorIdRef = useRef(`product_description_${Math.random().toString(36).slice(2, 9)}`);
    const initialDescriptionRef = useRef("");
    const pageLabel = page === 'home' ? 'Anasayfa' : page === 'about' ? 'Hakkımızda' : 'İletişim';
    const [sending, setSending] = useState(false);

    const initEditor = useCallback(() => {
        if (!open || !window.CKEDITOR || !textareaRef.current || editorRef.current) return;

        const instance = window.CKEDITOR.replace(editorIdRef.current, {
            height: 250,
            filebrowserBrowseUrl: '/assets/js/ckeditor/ckfinder/ckfinder.html',
            filebrowserUploadUrl: '/assets/js/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files'
        });

        editorRef.current = instance;
        instance.setData(initialDescriptionRef.current || "");
        instance.on('change', function () {
            const data = instance.getData();
            setForm(prev => ({ ...prev, description: data }));
        });
    }, [open, setForm]);

    useEffect(() => {
        initEditor();
        document.addEventListener('ckeditor-loaded', initEditor);

        return () => {
            document.removeEventListener('ckeditor-loaded', initEditor);
            if (editorRef.current) {
                try {
                    editorRef.current.destroy(true);
                } catch (e) { }
            }
            editorRef.current = null;
        };
    }, [initEditor]);

    useEffect(() => {
        if (open) {
            initialDescriptionRef.current = form.description || "";
        }
    }, [open]);



    const handleSubmit = async () => {
        setSending(true);
        try {
            const normalizedIsActive = form.is_active === true || form.is_active === 1 || form.is_active === '1';
            const formData = new FormData();
            formData.append('title', form.title || '');
            formData.append('description', form.description || '');
            formData.append('url', form.url || '');
            formData.append('sort_order', String(form.sort_order || 1));
            formData.append('is_active', normalizedIsActive ? '1' : '0');
            formData.append('metadata', JSON.stringify(form.metadata || {}));

            if (form.image_path instanceof File) {
                formData.append('image_path', form.image_path);
            } else {
                formData.append('image_path', form.image_path || '');
            }

            const { data } = await updatePage(item.id, formData, accessToken);
            if (data.status === "success") {
                onUpdated(data.data);
                toast.success(data.message || "Sayfa başarıyla güncellendi.");
            }
            setOpen(false);
        }
        catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Sayfa güncellenirken bir hata oluştu.");
        }finally {
            setSending(false);
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
                <Dialog
                    open={open}
                    maxWidth="md"
                    fullWidth
                    TransitionProps={{ onEntered: initEditor }}
                >
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {pageLabel} {blockTitle} Düzenle

                        <IconButton
                            onClick={handleCancel}
                            sx={{ position: "absolute", right: 16, top: 12 }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Box component="form" sx={{ pt: 1 }}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ minWidth: 64 }}>
                                            Sayfa:
                                        </Box>
                                        <TextField
                                            fullWidth
                                            value={pageLabel}
                                            slotProps={{ input: { readOnly: true } }}
                                            size="small"
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ minWidth: 64 }}>
                                            Bölüm:
                                        </Box>
                                        <TextField
                                            fullWidth
                                            value={blockTitle}
                                            slotProps={{ input: { readOnly: true } }}
                                            size="small"
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 2, md: 1, lg: 1 }}>
                                    Başlık:
                                </Grid>
                                <Grid size={{ xs: 10, md: 11, lg: 11 }}>
                                    <TextField name='title' onChange={handleChange} fullWidth defaultValue={form.title} size="small" />
                                </Grid>

                                <Grid size={{ xs: 12, md: 12 }} alignSelf="flex-start" sx={{ pt: 2 }}>
                                    Açıklama:
                                </Grid>
                                <Grid size={{ xs: 12, md: 12 }}>
                                    <textarea
                                        id={editorIdRef.current}
                                        ref={textareaRef}
                                        style={{ width: "100%", minHeight: "220px" }}
                                        defaultValue={form.description}
                                    />
                                </Grid>

                                <Grid size={{ xs: 2, md: 2 }}>
                                    Resim:
                                </Grid>
                                <Grid size={{ xs: 5, md: 3 }}>
                                    <Button variant="outlined" component="label" startIcon={<Upload />}>
                                        RESİM YÜKLE
                                        <input hidden type="file" onChange={(e) => {
                                            setPreview(URL.createObjectURL(e.target.files[0]));
                                            setForm(prev => ({ ...prev, image_path: e.target.files[0] }))
                                        }} />
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 5, md: 7 }}>
                                    {preview.length > 0 && (
                                        <Grid container spacing={2} sx={{ mt: 1 }}>

                                            <Grid size={4}>
                                                <Box sx={{
                                                    position: "relative", width: "80px", height: "80px", borderRadius: 2, overflow: "hidden",
                                                    "&:hover .overlay": { opacity: 1 },
                                                }}>
                                                    <img src={preview.startsWith("blob:") ? preview : `/storage/${preview}`} alt="" style={{
                                                        width: "100%", height: "100%", objectFit: "contain", display: "block",
                                                    }} />

                                                    <Box className="overlay" sx={{
                                                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                                                        bgcolor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                                                        display: "flex", justifyContent: "center", alignItems: "center",
                                                        opacity: 0, transition: "opacity 0.3s",
                                                    }}>
                                                        <IconButton sx={{ color: "white" }} onClick={() => {
                                                            setPreview("");
                                                            setForm(prev => ({ ...prev, image_path: "" }))
                                                        }}>
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                        </Grid>
                                    )}
                                </Grid>

                                <Grid size={{ xs: 2, md: 2 }}>
                                    URL:
                                </Grid>
                                <Grid size={{ xs: 10, md: 10 }}>
                                    <TextField name="url" fullWidth value={form.url} onChange={handleChange} size="small" />
                                </Grid>

                                <Grid size={{ xs: 6, md: 8 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Box>
                                            Sıra:
                                        </Box>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            inputMode="numeric"
                                            name="sort_order"
                                            value={form.sort_order}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/[^0-9]/g, '');

                                                if (value === '') {
                                                    setForm(prev => ({ ...prev, sort_order: '' }));
                                                } else {
                                                    const num = parseInt(value) || 0;
                                                    if (num < 1) {
                                                        setForm(prev => ({ ...prev, sort_order: '' }));
                                                    } else {
                                                        setForm(prev => ({ ...prev, sort_order: num }));
                                                    }
                                                }
                                            }}
                                            onBlur={() => {
                                                if (form.sort_order === '' || form.sort_order === 0 || isNaN(form.sort_order)) {
                                                    setForm(prev => ({ ...prev, sort_order: 1 }));
                                                }
                                            }}
                                            slotProps={{ input: { min: 1 } }}
                                            size="small"
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 6, md: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                        <Box>
                                            Aktif:
                                        </Box>
                                        <FormControlLabel
                                            control={<Checkbox name="is_active" checked={form.is_active === true || form.is_active === 1 || form.is_active === '1'} onChange={handleChange} />}
                                            label=""
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={12}>

                                    Metadata:

                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 12, md: 3 }}>
                                                button_text:
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 9 }}>
                                                <TextField
                                                    fullWidth
                                                    name="button_text"
                                                    value={form.metadata?.button_text || ''}
                                                    onChange={(e) => setForm(prev => ({
                                                        ...prev,
                                                        metadata: { ...prev.metadata, button_text: e.target.value }
                                                    }))}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 3 }}>
                                                image_alt:
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 9 }}>
                                                <TextField
                                                    fullWidth
                                                    name="image_alt"
                                                    value={form.metadata?.image_alt || ''}
                                                    onChange={(e) => setForm(prev => ({
                                                        ...prev,
                                                        metadata: { ...prev.metadata, image_alt: e.target.value }
                                                    }))}
                                                    size="small"
                                                />
                                            </Grid>

                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={handleCancel}>
                            Vazgeç
                        </Button>
                        {sending ? (
                            <Loading style="m-height mt-0" />
                        ) : (<Button onClick={handleSubmit} variant="contained">
                            Kaydet
                        </Button>)}
                    </DialogActions>
                </Dialog>
            )
            }
        </>
    )
}
