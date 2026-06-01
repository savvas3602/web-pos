import React from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';

/**
 * Props for the reusable brand form.
 */
export interface BrandFormProps {
    name: string;
    description: string;
    isEditing: boolean;
    loading?: boolean;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel?: () => void;
}

/**
 * Reusable presentational form for creating or editing a brand.
 *
 * This component renders the input fields and action buttons only. It does not
 * contain any business logic or API calls; all state and behavior are supplied
 * via props.
 */
const BrandForm: React.FC<BrandFormProps> = ({
    name,
    description,
    isEditing,
    loading = false,
    onNameChange,
    onDescriptionChange,
    onSubmit,
    onCancel
}) => {
    return (
        <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField
                    label="Brand Name"
                    value={name}
                    onChange={e => onNameChange(e.target.value)}
                    required
                    fullWidth
                    autoFocus
                />
                <TextField
                    label="Brand Description"
                    value={description}
                    onChange={e => onDescriptionChange(e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outlined"
                            color="inherit"
                            onClick={onCancel}
                            disabled={loading}
                            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}
                    >
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default BrandForm;
