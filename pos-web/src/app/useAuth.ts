import { useContext } from 'react';
import { AuthTypes, type AuthContextType } from './AuthTypes.ts';

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthTypes);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
