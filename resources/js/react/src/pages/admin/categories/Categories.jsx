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
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Delete } from "@mui/icons-material";
import { getCategoryAll, getCategory } from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";
import EditCategory from "./EditCategory";

function Row({ category, open, categories }) {
    return (
        <>
            {category.children?.length > 0 && (
                <TableRow>
                    <TableCell
                        colSpan={4}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Alt Kategoriler
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ad</TableCell>
                                            <TableCell>Görsel</TableCell>
                                            <TableCell>İşlemler</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {category.children.map((child) => (
                                            <TableRow key={child.slug}>
                                                <TableCell>
                                                    {child.name}
                                                </TableCell>
                                                <TableCell>
                                                    {child.images?.length >
                                                        0 && (
                                                        <img
                                                            src={
                                                                child.images[0]
                                                            }
                                                            alt="thumb"
                                                            width={40}
                                                            height={40}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <EditCategory
                                                        category={{...child, parent_slug: category.slug}}
                                                        categories={categories}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        aria-label="delete"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
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
    const [open, setOpen] = useState(null);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await getCategoryAll(accessToken);
                if (data.status === "success") {
                    setCategories(data.categories);
                    console.log(data.categories);
                }
            } catch (error) {
                console.log(error);
                setCategories([]);
            }
        };
        fetchProducts();
    }, []);

    return (
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
                    {categories?.map(
                        (category, index) =>
                            category.slug === category.parent_slug && (
                                <React.Fragment key={index}>
                                    <TableRow >
                                        <TableCell>
                                            {category.children?.length > 0 && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        setOpen(
                                                            open === index
                                                                ? null
                                                                : index
                                                        )
                                                    }
                                                >
                                                    {open === index ? (
                                                        <KeyboardArrowUp />
                                                    ) : (
                                                        <KeyboardArrowDown />
                                                    )}
                                                </IconButton>
                                            )}
                                        </TableCell>
                                        <TableCell>{category.name}</TableCell>
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
                                            {" "}
                                            {/*onUpdated={fetchCategories} */}
                                            <EditCategory
                                                category={category}
                                                categories={categories}
                                            />
                                            <IconButton
                                                size="small"
                                                color="error"
                                                aria-label="delete"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>

                                    <Row
                                        category={category}
                                        open={open === index}
                                        categories={categories}
                                    />
                                </React.Fragment>
                            )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Categories;
