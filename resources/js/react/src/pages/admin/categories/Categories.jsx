import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Box,
    Typography,
    Button,
    Container,
    CircularProgress,
} from "@mui/material";
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    Delete,
} from "@mui/icons-material";
import {
    getCategoryAll,
    getCategory,
    deleteCategory,
} from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";
import EditCategory from "./EditCategory";
import { toast } from "react-toastify";
import AddCategory from "./AddCategory";

function Row({ category, categories, onUpdated, level = 0, setCategories }) {
    const [open, setOpen] = useState(false);
    const { accessToken } = useAuth();
    const [sending, setSending] = useState(false);

    const handleDelete = async (e) => {
        console.log(e);
        setSending(true);
        if (
            !window.confirm(
                "Bu kategori ve tüm alt kategorileri silinecek. Emin misiniz?"
            )
        )
            return;
        try {
            const { data } = await deleteCategory(e.slug, accessToken);

            if (data.status === "success") {
                toast.success(data.message);

                function removeCategory(categories, slug) {
                    return categories
                        .filter((c) => c.slug !== slug)
                        .map((c) => ({
                            ...c,
                            children: c.children
                                ? removeCategory(c.children, slug)
                                : [],
                        }));
                }

                // Kullanımı:
                setCategories((prev) => removeCategory(prev, e.slug));
            }
            setSending(false);
        } catch (error) {
            console.log(error);
            setSending(false);
        }
    };
    return (
        <>
            <TableRow>
                <TableCell>
                    {category.children?.length > 0 && (
                        <IconButton size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    )}
                </TableCell>
                <TableCell style={{ paddingLeft: `${level * 20}px` }}>
                    {category.name}
                </TableCell>
                <TableCell>
                    {category.images?.length > 0 && (
                        <img
                            src={category.images[0]}
                            alt="thumb"
                            width={40}
                            height={40}
                        />
                    )}
                </TableCell>
                <TableCell>
                   <div className="d-flex align-items-center">
                     <EditCategory
                        category={category}
                        categories={categories}
                        onUpdated={onUpdated}
                    />
                    {sending ? (
                        <CircularProgress size="sm" sx={{width:'15px'}} />
                    ) : (
                        <IconButton
                            size="small"
                            color="error"
                            aria-label="delete"
                            onClick={() => handleDelete(category)}
                        >
                            <Delete />
                        </IconButton>
                    )}
                   </div>
                </TableCell>
            </TableRow>

            {/* Recursive Collapse */}
            {category.children?.length > 0 && (
                <TableRow>
                    <TableCell
                        colSpan={4}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Table size="small">
                                    <TableBody>
                                        {category.children.map((child) => (
                                            <Row
                                                key={child.slug}
                                                category={child}
                                                categories={categories}
                                                onUpdated={onUpdated}
                                                level={level + 1}
                                                setCategories={setCategories}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

function Categories() {
    const [categories, setCategories] = useState([]);
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await getCategoryAll(accessToken);
                if (data.status === "success") {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.log(error);
                setCategories([]);
            }
        };
        fetchProducts();
    }, []);

    const onUpdated = (data) => {
        setCategories(data);
    };

    const onCreated = (data) => {
        setCategories(data);
    };

    return (
        <Box>
            <AddCategory categories={categories} onCreated={onCreated} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Ad</TableCell>
                            <TableCell>Görsel</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories
                            ?.filter((cat) => cat.parent_slug === null) // sadece root kategoriler
                            .map((category) => (
                                <Row
                                    key={category.slug}
                                    category={category}
                                    categories={categories}
                                    onUpdated={onUpdated}
                                    token={accessToken}
                                    setCategories={setCategories}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Categories;
