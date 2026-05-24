import {
    GridToolbarContainer,
    GridToolbarQuickFilter,
    GridToolbarFilterButton,
    GridToolbarColumnsButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { Divider } from '@mui/material';

const ToolbarDivider = () => (
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
);

function CustomToolbar() {
    return (
        <GridToolbarContainer sx={{ '& .MuiButton-root': { color: 'inherit' } }}>
            <GridToolbarQuickFilter />
            <ToolbarDivider />
            <GridToolbarFilterButton />
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

export default CustomToolbar;