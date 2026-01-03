import { createContext } from 'react';

export interface User {
    id: string;
    username: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const AuthTypes = createContext<AuthContextType | undefined>(undefined);

