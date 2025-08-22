import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getProductAll } from "../../../services/AdminService";
import { useAuth } from "../../../services/AuthContex";

function Products() {
    const [products, setProducts] = useState([]);
    const {accessToken} = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await getProductAll(accessToken);
                if (data.status === "success") {
                    setProducts(data.products);
                }
            } catch (error) {
                console.log(error);
                setProducts([]);
            }
        };
        fetchProducts();
        console.log(products);
    }, [products]);

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "firstName", headerName: "First name", width: 130 },
        { field: "lastName", headerName: "Last name", width: 130 },
        {
            field: "age",
            headerName: "Age",
            type: "number",
            width: 90,
        },
        {
            field: "fullName",
            headerName: "Full name",
            description: "This column has a value getter and is not sortable.",
            sortable: false,
            width: 160,
            valueGetter: (value, row) =>
                `${row.firstName || ""} ${row.lastName || ""}`,
        },
    ];

    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <div>
            <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={products? products : []}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    );
}

export default Products;
