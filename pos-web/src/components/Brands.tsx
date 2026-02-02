import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

interface Brand {
    id: number;
    name: string;
}

const Brands: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandName, setBrandName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fetchBrands = async () => {
        try {
            setError(null);
            const res = await axios.get('http://localhost:8080/brands', {
                withCredentials: true,
            });
            setBrands(res.data);
        } catch (err) {
            let message = 'Failed to fetch brands.';
            if (axios.isAxiosError(err)) {
                const apiMsg = err.response?.data?.message;
                if (apiMsg) {
                    message += ` (${apiMsg})`;
                } else if (err.message) {
                    message += ` (${err.message})`;
                }
            } else if (err instanceof Error) {
                message += ` (${err.message})`;
            }
            setError(message);
        }
    };

    useEffect(() => {
        // Avoid calling setState synchronously in effect
        (async () => {
            await fetchBrands();
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!brandName.trim()) return;
        try {
            if (editingId !== null) {
                // Update
                await axios.put(`http://localhost:8080/brands/${editingId}`, {name: brandName}, {
                    withCredentials: true,
                });
            } else {
                // Create
                await axios.post('http://localhost:8080/brands', {name: brandName}, {
                    withCredentials: true,
                });
            }
            setBrandName('');
            setEditingId(null);
            fetchBrands();
        } catch (err) {
            let message = 'Failed to save brand.';
            if (axios.isAxiosError(err)) {
                const apiMsg = err.response?.data?.message;
                if (apiMsg) {
                    message += ` (${apiMsg})`;
                } else if (err.message) {
                    message += ` (${err.message})`;
                }
            } else if (err instanceof Error) {
                message += ` (${err.message})`;
            }
            setError(message);
        }
    };

    const handleEdit = (brand: Brand) => {
        setBrandName(brand.name);
        setEditingId(brand.id);
    };

    const handleDelete = async (id: number) => {
        setError(null);
        try {
            await axios.delete(`http://localhost:8080/brands/${id}`, {
                withCredentials: true,
            });
            fetchBrands();
        } catch (err) {
            let message = 'Failed to delete brand.';
            if (axios.isAxiosError(err)) {
                const apiMsg = err.response?.data?.message;
                if (apiMsg) {
                    message += ` (${apiMsg})`;
                } else if (err.message) {
                    message += ` (${err.message})`;
                }
            } else if (err instanceof Error) {
                message += ` (${err.message})`;
            }
            setError(message);
        }
    };

    // Filter brands by search query (case-insensitive)
    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(search.toLowerCase())
    );

    // DataGrid columns definition
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 120,
            getActions: (params) => [
                <GridActionsCellItem key="edit" icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.row)} />,
                <GridActionsCellItem key="delete" icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id as number)} />
            ]
        }
    ];

    return (
        <Box sx={{maxWidth: 500, mx: 'auto', mt: 4}}>
            <Typography variant="h5" gutterBottom>Manage Brands</Typography>
            {error && (
                <Box sx={{ mb: 2 }}>
                    <Typography color="error" variant="body2">{error}</Typography>
                </Box>
            )}
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Find brand"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    fullWidth
                    size="small"
                />
            </Box>
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, marginBottom: 16}}>
                    <TextField
                        label="Brand Name"
                        value={brandName}
                        onChange={e => setBrandName(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {editingId === null ? 'Add' : 'Update'}
                    </Button>
                </form>
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredBrands}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    autoHeight
                />
            </Box>
        </Box>
    );
};

export default Brands;
