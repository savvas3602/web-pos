import React from 'react';
import {
    AppBar, Box, Collapse, Divider, Drawer, IconButton,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Menu, MenuItem, Toolbar, Tooltip, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [configAnchorEl, setConfigAnchorEl] = React.useState<null | HTMLElement>(null);
    const [configOpen, setConfigOpen] = React.useState(false);
    const configMenuOpen = Boolean(configAnchorEl);

    const drawerWidth = 200;

    const navItems: NavItem[] = [
        { label: 'New Sale', path: '/dashboard', icon: <PointOfSaleIcon /> },
        { label: 'Purchase History', path: '/purchase-history', icon: <ReceiptLongIcon /> }
    ];

    const configItems: NavItem[] = [
        { label: 'Products', path: '/products', icon: <InventoryIcon fontSize="small" /> },
        { label: 'Product Types', path: '/product-types', icon: <CategoryIcon fontSize="small" /> },
        { label: 'Brands', path: '/brands', icon: <LocalOfferIcon fontSize="small" /> }
    ];

    const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
    const handleConfigClick = (event: React.MouseEvent<HTMLElement>) => setConfigAnchorEl(event.currentTarget);
    const handleConfigClose = () => setConfigAnchorEl(null);
    const handleConfigToggle = () => setConfigOpen((prev) => !prev);

    const container = globalThis.window === undefined
        ? undefined
        : () => globalThis.window.document.body;

    const drawer = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>Menu</Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle}>
                            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={handleConfigToggle}>
                        <ListItemIcon sx={{ minWidth: 36 }}><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Configure" />
                        {configOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={configOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {configItems.map((item) => (
                            <ListItem key={item.label} disablePadding sx={{ pl: 2 }}>
                                <ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
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
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
                        {navItems.map((item) => (
                            <Tooltip key={item.label} title={item.label}>
                                <IconButton color="inherit" component={Link} to={item.path}>
                                    {item.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                        <Tooltip title="Configure">
                            <IconButton color="inherit" onClick={handleConfigClick}>
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
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
                                    <ListItemIcon>{item.icon}</ListItemIcon>
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
                    ModalProps={{ keepMounted: true }}
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
