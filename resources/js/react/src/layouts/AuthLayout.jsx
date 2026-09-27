import React, { Fragment, useState, useEffect } from "react";
import Drawer from "./adminCompanents/Drawer";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContex";
import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import Loading from "./GeneralComponents/Loading";
import { styled, useTheme } from "@mui/material/styles";

function AuthLayout() {
    const { accessToken, checkRole } = useAuth();
    const [permission, setPermission] = useState(false);
    const [load, setLoad] = useState(true);
    const [open, setOpen] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const drawerWidth = 240;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/assets/js/ckeditor/ckeditor.js';
        script.async = true;
        script.onload = () => {
            document.dispatchEvent(new Event('ckeditor-loaded'));
        };
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const { data } = await checkRole();
                if (data.status === "success" && data.user === "admin") {
                    setPermission(true);
                    setErrorMessage("");
                }
            } catch (error) {
                if (error?.response?.status === 403) {
                    setPermission(false);
                    setErrorMessage("Bu alana giriş yetkiniz bulunmamaktadır.");
                } else if (error?.response?.status === 401) {
                    navigate("/admin/login");
                    return;
                } else {
                    setPermission(false);
                    setErrorMessage("Yetki kontrolü sırasında bir hata oluştu.");
                }
            } finally {
                setLoad(false);
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
                                            px: 2,
                                            background: "#ffffff",
                                        }}
                                    >
                                        <Grid
                                            container
                                            sx={{
                                                maxWidth: 520,
                                                backgroundColor: "#d4b06a",
                                                border: "1px solid #A88442",
                                                borderRadius: 1,
                                                boxShadow:
                                                    "0 18px 45px rgba(84, 61, 37, 0.12)",
                                                px: { xs: 3, md: 5 },
                                                py: { xs: 4, md: 5 },
                                                textAlign: "center",
                                            }}
                                        >
                                           
                                            <Grid size={12}>
                                                <Typography
                                                    variant="h5"
                                                    gutterBottom
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: "#fbf3e6",
                                                    }}
                                                >
                                                    Bu Sayfaya Erisim Yetkiniz Bulunmamaktadır
                                                </Typography>
                                            </Grid>
                                            
                                             <Grid size={12}>
                                                <Typography
                                                    variant="overline"
                                                    sx={{
                                                        display: "inline-block",
                                                        px: 1.5,
                                                        py: 0.5,
                                                        my: 2,
                                                        borderRadius: 0,
                                                        letterSpacing: 1.2,
                                                        backgroundColor: "#fbf3e6",
                                                    }}
                                                >
                                                  <Link style = {{ color: "#A88442" }} to="/"> Ana Sayfaya Dönmek İÇİN Tıklayınız</Link>
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
