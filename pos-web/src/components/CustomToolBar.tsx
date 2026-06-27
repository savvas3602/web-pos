import { GridToolbar, type GridToolbarProps } from '@mui/x-data-grid/internals';

function CustomToolbar(props: GridToolbarProps) {
    return <GridToolbar {...props} />;
}

export default CustomToolbar;