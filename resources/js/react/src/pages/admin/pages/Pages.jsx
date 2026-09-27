import React, { useState, useEffect } from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Grid, Collapse, TextField, Button, Typography } from '@mui/material'
import { Delete, KeyboardArrowUp, KeyboardArrowDown, Add, Label } from '@mui/icons-material'
import { useAuth } from '../../../services/AuthContex'
import EditPage from './EditPage'
import AddPage from './AddPage'
import { useSearchParams } from "react-router-dom";
import { getPages, deletePage, updatePageParent } from '../../../services/AdminService'
import { toast } from 'react-toastify';
import useForm from '../../../services/hooks/useForm';

export default function Pages() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page");
    const [sending, setSending] = useState(false);
    const [openRows, setOpenRows] = useState({});
    const { accessToken } = useAuth();
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const { form, setForm, handleChange } = useForm({ seo_title: blocks?.seo_title || "", seo_description: blocks?.seo_description || "" }, [blocks]);

    useEffect(() => {
        setForm({ seo_title: blocks?.seo_title || "", seo_description: blocks?.seo_description || "" });
    }, [blocks]);

    useEffect(() => {
        if (!accessToken) return;

        const fetchData = async () => {
            try {   
                const { data } = await getPages(accessToken, page);
                setBlocks(data.blocks);
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [page, accessToken]);

    const toggleRow = (rowKey) => {
        setOpenRows((prev) => ({
            ...prev,
            [rowKey]: !prev[rowKey],
        }));
    };

    const handleUpdated = (updatedChild) => {
        setBlocks(prevBlocks => {
            const updatedSections = prevBlocks.sections.map(section => ({
                ...section,
                children: section.children.map(child => child.id === updatedChild.id ? updatedChild : child)
            }));
            return { ...prevBlocks, sections: updatedSections };
        });
    }
    // useEffect(() => { console.log(blocks) }, [blocks])

    const handleCreated = (newChild) => {
        setBlocks(prevBlocks => {
            const updatedSections = prevBlocks.sections.map(section => ({
                ...section,
                children: [...section.children, newChild]
            }));
            return { ...prevBlocks, sections: updatedSections };
        });
    }

    const handleDelete = async (childId) => {
        setLoading(true);
        try {
            const { data } = await deletePage(childId, accessToken);
            if (data.status === "success") {
                toast.success(data.message || "İçerik başarıyla silindi.");
                setBlocks(prevBlocks => {
                    const updatedSections = prevBlocks.sections.map(section => ({
                        ...section,
                        children: section.children.filter(child => child.id !== childId)
                    }));
                    return { ...prevBlocks, sections: updatedSections };
                });
            } else {
                toast.error(data.message || "İçerik silinirken bir hata oluştu.");
            }
        } catch (e) {
            console.log(e);
            toast.error(e.message || "İçerik silinirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {console.log(form)}, [form])
    const handleUpdateMainPage = async () => {
        setSending(true);
        try {
            const { data } = await updatePageParent(blocks.id, form, accessToken);
            if (data.status === "success") {
                toast.success(data.message || "Başarıyla güncellendi.");
                setBlocks(prevBlocks => ({ ...prevBlocks, ...data.data }));
            } else {
                toast.error(data.message || "Güncelleme sırasında bir hata oluştu.");
            }
        } catch (e) {
            console.log(e);
            toast.error(e.message || "Güncelleme sırasında bir hata oluştu.");
        } finally {
            setSending(false);
        }
    }

    return (
        <Box>
            <Grid container justifyContent="center">
                <Grid container mt={7} size={{ xs: 12, md: 12, lg: 8 }} spacing={10} alignItems="flex-start">

                    <Grid size={{ xs: 12, md: 8, lg: 7 }}>
                        <TableContainer component={Paper}>

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Ad</TableCell>
                                        <TableCell>İşlemler</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {blocks && blocks.sections && blocks.sections.map((section, index) => {
                                        const rowKey = section.id;
                                        const isOpen = !!openRows[rowKey];
                                        return (
                                            <React.Fragment key={rowKey}>

                                                <TableRow>

                                                    <TableCell style={{ width: "30px" }}>
                                                        {section.children.length > 0 && (
                                                            <IconButton size="small" onClick={() => toggleRow(rowKey)}>
                                                                {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                            </IconButton>
                                                        )}
                                                    </TableCell>
                                                    <TableCell style={{
                                                        // paddingLeft: `${level * 16}px`,
                                                        // paddingTop: level > 0 ? 8 : undefined,
                                                        // paddingBottom: level > 0 ? 8 : undefined
                                                    }}>
                                                        {section.title}
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="d-flex align-items-center">
                                                            <AddPage childLength={section.children.length} page={page} blockTitle={section.title} pageId={blocks.id} parentId={section.id} onCreated={handleCreated} />
                                                        </div>

                                                    </TableCell>
                                                </TableRow>
                                                {section.children.length > 0 && section.children.map((child, childIndex) =>
                                                    <TableRow key={`${child.id}`}>
                                                        <TableCell colSpan={4} style={{ padding: 0, border: 0 }}>
                                                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                                <Table size="small">
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell style={{ width: "85px" }}></TableCell>
                                                                            <TableCell>
                                                                                {child.title}
                                                                            </TableCell>

                                                                            <TableCell>
                                                                                <div className="d-flex align-items-center justify-content-end">
                                                                                    <EditPage item={child} page={page} blockTitle={section.title} onUpdated={handleUpdated} />
                                                                                    {loading ? <CircularProgress size={24} /> : (
                                                                                        <IconButton
                                                                                            sx={{ mr: 1 }}
                                                                                            onClick={() => handleDelete(child.id)}
                                                                                            size="small"
                                                                                            color="error"
                                                                                            aria-label="delete"

                                                                                        >
                                                                                            <Delete color="error" style={{ cursor: "pointer" }} />
                                                                                        </IconButton>

                                                                                    )}
                                                                                </div>

                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        )
                                    })}


                                </TableBody>
                            </Table>

                        </TableContainer>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4, lg: 5 }} >
                        <Box component="form" >
                            <Grid container alignItems="center" spacing={2}>
                                <Grid size={12} borderBottom={'1px solid #ccc'} mb={1} mt={3}><h4> {blocks?.title} Düzenleme</h4></Grid>
                                <Grid size={12}>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 'bold' }}>SEO Başlığı</Typography>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        name="seo_title"
                                        defaultValue={blocks?.seo_title || ""}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 'bold' }}>SEO Açıklaması</Typography>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        name="seo_description"
                                        defaultValue={blocks?.seo_description || ""}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid size={12} textAlign="right">
                                    {sending ? <CircularProgress size={24} /> : (
                                        <Button variant="outlined" color="primary" onClick={handleUpdateMainPage}>Güncelle</Button>
                                    )}                                
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>


                </Grid>
            </Grid>
        </Box >
    )
}
