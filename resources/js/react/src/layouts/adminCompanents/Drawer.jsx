import React, { useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import {
    Box,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    CssBaseline,
    ListItemIcon,
    Divider,
    ListItemText,
    Badge,
    Menu,
    MenuItem,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronLeft";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContex";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";

function DrawerBar({ open ,setOpen }) {
    const theme = useTheme();
    const menuId = "primary-search-account-menu";
    const { apiAdminLogout, setAccessToken, setCurrentUser } = useAuth();
    const drawerWidth = 240;
    const [account, setAccount] = useState(false);

    const toggleMenu = () => setAccount(prev => !prev);
    const closeMenu = () => setAccount(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };


    const adminLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await apiAdminLogout();

            if (res?.data?.message) {
                setCurrentUser("");
                setAccessToken(null);
                localStorage.setItem("currentToken", null);
                toast.success(res.data.message);
                navigate("/admin/login");
            }
        } catch (error) {
            console.log(error);
        }
    };



    const DrawerHeader = styled("div")(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    }));

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== "open",
    })(({ theme }) => ({
        transition: theme.transitions.create(["margin", "width"], {
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
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: "#1976d2",
            },
        },
    });

    return (
        <>
            <Box sx={{}}>
                <CssBaseline />
                <ThemeProvider theme={darkTheme}>
                    <AppBar position="static" open={open}>
                        <Toolbar>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    sx={[
                                        {
                                            mr: 2,
                                        },
                                        open && { display: "none" },
                                    ]}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="h6" noWrap component="div">
                                    Admin Panel
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <IconButton
                                    size="large"
                                    aria-label="show 4 new mails"
                                    color="inherit"
                                >
                                    <Badge badgeContent={4} color="error">
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    size="large"
                                    aria-label="show 17 new notifications"
                                    color="inherit"
                                >
                                    <Badge badgeContent={17} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>

                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={toggleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                {account && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "16px", // AppBar butonunun altı
                                            right: "16px",
                                            bgcolor: "background.paper",
                                            boxShadow: 3,
                                            borderRadius: 1,
                                            zIndex: 1300,
                                            minWidth: 150,
                                        }}
                                    >
                                        <MenuItem onClick={closeMenu}>
                                            Profile
                                        </MenuItem>
                                        <MenuItem onClick={closeMenu}>
                                            My Account
                                        </MenuItem>
                                        <MenuItem onClick={adminLogout}>
                                            Logout
                                        </MenuItem>
                                    </Box>
                                )}
                            </Box>
                        </Toolbar>
                    </AppBar>
                </ThemeProvider>
            </Box>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "ltr" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <Link to={"/admin/products"}>
                                <ListItemText primary={"Ürünler"} />
                            </Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <CategoryIcon />
                            </ListItemIcon>
                            <Link to="/admin/categories">
                                <ListItemText primary={"Kategoriler"} />
                            </Link>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {["All mail", "Trash", "Spam"].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? (
                                        <InboxIcon />
                                    ) : (
                                        <MailIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}

export default DrawerBar;
