import {
    GridToolbarContainer,
    GridToolbarQuickFilter,
    GridToolbarFilterButton,
    GridToolbarColumnsButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { IconButton, Tooltip, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Define optional add props for the toolbar
export interface CustomToolbarProps {
    onAddClick?: () => void;
}

/**
 * Generic custom toolbar for MUI data-grid
 * @constructor
 */
const ToolbarDivider = () => (
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
);

function CustomToolbar({ onAddClick }: CustomToolbarProps) {
    return (
        <GridToolbarContainer sx={{ '& .MuiButton-root': { color: 'inherit' } }}>
            {onAddClick && (
                <Tooltip title="Add new item">
                    <IconButton size="small" onClick={onAddClick} sx={{
                        color: 'inherit', '&:hover': { backgroundColor: 'action.hover' }
                    }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            )}
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