import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getProductAll } from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";
import {  IconButton, Stack, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddProduct from "./AddProduct";

function Products() {
    const [products, setProducts] = useState([]);
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await getProductAll(accessToken);
                console.log(data);
                setProducts(data);
            } catch (error) {
                console.log(error);
                setProducts([]);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        console.log("Products değişti:", products);
    }, [products]);

    // const [products, setProducts] = useState([
    //     {
    //         product_number: 1,
    //         product_name: "Altın Bilezik",
    //         product_slug: "altin-bilezik",
    //         product_price: 5000,
    //         category_slug: "bilezik",
    //         product_stock: [{ stock: 10 }],
    //         grouped_stock_by_color: [{ color: "Altın" }],
    //         product_images: ["https://via.placeholder.com/40"],
    //     },
    //     {
    //         product_number: 2,
    //         product_name: "Pırlanta Yüzük",
    //         product_slug: "pirlanta-yuzuk",
    //         product_price: 12000,
    //         category_slug: "yuzuk",
    //         product_stock: [{ stock: 5 }],
    //         grouped_stock_by_color: [{ color: "Beyaz" }],
    //         product_images: ["https://via.placeholder.com/40"],
    //     },
    // ]);

    const columns = [
        { field: "product_number", headerName: "ID", width: 60 },
        { field: "product_name", headerName: "Ürün Adı", flex: 1 },
        {
            field: "product_images",
            headerName: "Görseller",
            width: 150,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    {params.value?.slice(0, 2).map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt="Ürün"
                            width={40}
                            height={40}
                            style={{ borderRadius: 4 }}
                        />
                    ))}
                </Stack>
            ),
        },
        {
            field: "product_price",
            headerName: "Fiyat",
            width: 120,
            type: "number",
        },
        { field: "category_slug", headerName: "Kategori", width: 120 },
        {
            field: "grouped_stock_by_color",
            headerName: "Renkler",
            width: 160,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <span>
                    {params.row.grouped_stock_by_color
                        ?.map((g) => g.color)
                        .join(", ") || "-"}
                </span>
            ),
        },
        {
            field: "total_stock",
            headerName: "Toplam Stok",
            width: 90,
           type: "number",
        },
        {
            field: "actions",
            headerName: "İşlemler",
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        size="small"
                        color="success"
                        aria-label="update"
                        onClick={() => handleUpdate(category)}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        aria-label="delete"
                        onClick={() => handleDelete(category)}
                    >
                        <Delete />
                    </IconButton>
                </Stack>
            ),
        },
    ];
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    return (
        <div>
            <Box>
                <AddProduct/>
                <Paper sx={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={products}
                        columns={columns}
                        getRowId={(row) => row.product_number} // <-- burası önemli
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 20, 30]}
                        sx={{ border: 0 }}
                    />
                </Paper>
            </Box>
        </div>
    );
}

export default Products;
