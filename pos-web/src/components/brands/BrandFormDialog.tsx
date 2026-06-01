import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import BrandForm from './BrandForm.tsx';

/**
 * Props for `BrandFormDialog`.
 */
interface BrandFormDialogProps {
    open: boolean;
    name: string;
    description: string;
    isEditing: boolean;
    loading?: boolean;
    onClose: () => void;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Reusable modal wrapper for creating or editing a brand.
 *
 * This component is intentionally presentation-only: it renders the dialog
 * container and delegates all form state and behavior to the parent through
 * props.
 */
const BrandFormDialog: React.FC<BrandFormDialogProps> = ({
    open,
    name,
    description,
    isEditing,
    loading,
    onClose,
    onNameChange,
    onDescriptionChange,
    onSubmit
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? 'Update Brand' : 'Add Brand'}</DialogTitle>
            <DialogContent>
                <BrandForm
                    name={name}
                    description={description}
                    isEditing={isEditing}
                    loading={loading}
                    onNameChange={onNameChange}
                    onDescriptionChange={onDescriptionChange}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    );
};

export default BrandFormDialog;
