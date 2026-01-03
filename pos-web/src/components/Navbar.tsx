import React from 'react';
import {AppBar, Box,
    Button, Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, Menu, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [configAnchorEl, setConfigAnchorEl] = React.useState<null | HTMLElement>(null);
    const [configOpen, setConfigOpen] = React.useState(false);
    const configMenuOpen = Boolean(configAnchorEl);

    const drawerWidth = 200;
    const navItems = [
        { label: 'New sale', path: '/dashboard' },
        { label: 'Purchase History', path: '/purchase-history' }
    ];

    const configItems = [
        { label: 'Products', path: '/products' },
        { label: 'Product Types', path: '/product-types' },
        { label: 'Brands', path: '/brands' }
    ];

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleConfigClick = (event: React.MouseEvent<HTMLElement>) => {
        setConfigAnchorEl(event.currentTarget);
    };

    const handleConfigClose = () => {
        setConfigAnchorEl(null);
    };

    const handleConfigToggle = () => {
        setConfigOpen((prevState) => !prevState);
    };

    const container = globalThis.window === undefined
        ? undefined
        : () => globalThis.window.document.body;

    const drawer = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Menu
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={handleConfigToggle}>
                        <ListItemText primary="Config" />
                        {configOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={configOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {configItems.map((item) => (
                            <ListItem key={item.label} disablePadding sx={{ pl: 2 }}>
                                <ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle}>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </List>
        </Box>
    );

    return (
        <Box>
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        K2
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button key={item.label} component={Link} to={item.path}>
                                {item.label}
                            </Button>
                        ))}
                        <Button
                            onClick={handleConfigClick}
                            endIcon={<ArrowDropDownIcon />}
                        >
                            Configure
                        </Button>
                        <Menu
                            anchorEl={configAnchorEl}
                            open={configMenuOpen}
                            onClose={handleConfigClose}
                        >
                            {configItems.map((item) => (
                                <MenuItem
                                    key={item.label}
                                    component={Link}
                                    to={item.path}
                                    onClick={handleConfigClose}
                                >
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}