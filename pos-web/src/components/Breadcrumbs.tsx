import React from 'react';
import {Breadcrumbs as MUIBreadcrumbs, Link, Typography} from '@mui/material';
import {useLocation, Link as RouterLink} from 'react-router-dom';

const routeNameMap: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/purchase-history': 'Purchase History',
    '/brands': 'Brands',
    '/products': 'Products',
    '/product-types': 'Product Types',
    '/login': 'Login',
};

function getBreadcrumbs(locationPath: string) {
    const paths = locationPath.split('/').filter(Boolean);
    let accumulated = '';
    return paths.map((segment, idx) => {
        accumulated += '/' + segment;
        const label = routeNameMap[accumulated] || segment.charAt(0).toUpperCase() + segment.slice(1);
        return {
            label,
            path: accumulated,
            isLast: idx === paths.length - 1,
        };
    });
}

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const breadcrumbs = getBreadcrumbs(location.pathname);

    if (breadcrumbs.length === 0) return null;

    return (
        <MUIBreadcrumbs aria-label="breadcrumb" sx={{mb: 2}}>
            <Link component={RouterLink} underline="hover" color="inherit" to="/dashboard">
                Home
            </Link>
            {breadcrumbs.map((crumb) =>
                crumb.isLast ? (
                    <Typography color="text.primary" key={crumb.path}>{crumb.label}</Typography>
                ) : (
                    <Link
                        component={RouterLink}
                        underline="hover"
                        color="inherit"
                        to={crumb.path}
                        key={crumb.path}
                    >
                        {crumb.label}
                    </Link>
                )
            )}
        </MUIBreadcrumbs>
    );
};

export default Breadcrumbs;

