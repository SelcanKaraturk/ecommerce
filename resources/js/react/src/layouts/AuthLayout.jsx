import React, { Fragment, useState, useEffect } from "react";
import Drawer from "./adminCompanents/Drawer";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContex";
import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import Loading from "./GeneralComponents/Loading";
import { styled, useTheme } from "@mui/material/styles";

function AuthLayout() {
    const { accessToken, checkRole } = useAuth();
    const [permission, setPermission] = useState(false);
    const [load, setLoad] = useState(true);
    const [open, setOpen] = useState(true);

    const navigate = useNavigate();
    const drawerWidth = 240;
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const { data } = await checkRole();
                if (data.status === "success" && data.user === "admin") {
                    setLoad(false);
                    setPermission(true);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (!accessToken) {
            navigate("/admin/login");
        } else {
            fetchAdmin();
        }
    }, [accessToken]);

    const Main = styled("main", {
        shouldForwardProp: (prop) => prop !== "open",
    })(({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    width: `calc(100% - ${drawerWidth}px)`,
                    marginLeft: `${drawerWidth}px`,
                    transition: theme.transitions.create(["margin", "width"], {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
            },
        ],
    }));


    return (
        <>
            {load ? (
                <Loading />
            ) : (
                <>
                    {!accessToken ? (
                        <Navigate to={"/admin/login"} />
                    ) : (
                        <>
                            {permission ? (
                                <>

                                        <Drawer open={open} setOpen={setOpen} />
                                        <Main open={open}>
                                            <Outlet />
                                        </Main>

                                </>
                            ) : (
                                <Fragment>
                                    <CssBaseline />

                                    <Box
                                        sx={{
                                            height: "100vh",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Grid container>
                                            <Grid size={12}>
                                                <Typography
                                                    variant="body1"
                                                    gutterBottom
                                                >
                                                    Bu alana giriş izniniz
                                                    bulunmamaktadır.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Fragment>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default AuthLayout;
