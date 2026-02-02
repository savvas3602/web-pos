import * as React from 'react';
import {AuthTypes, type User} from './AuthTypes';
import axios from 'axios';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    const checkAuth = React.useCallback(async () => {
        setLoading(true);

        axios.get('http://localhost:8080/auth/validate-session', { withCredentials: true })
            .then(response => {
                setIsAuthenticated(response.data.isAuthenticated);
                setUser(response.data.user || null);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    React.useEffect(() => {
        checkAuth().catch((err) => {
            console.error("Error checking authentication status:" + err);
        });
    }, [checkAuth]);

    const login = React.useCallback(
        async (username: string, password: string) => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/auth/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password}),
                });
                if (response.ok) {
                    await checkAuth();
                    return true;
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    return false;
                }
            }
            catch {
                setIsAuthenticated(false);
                setUser(null);
                return false;
            }
            finally {
                setLoading(false);
            }
        },
        [checkAuth]
    );

    const logout = React.useCallback(async () => {
        setLoading(true);
        try {
            await fetch('http://local/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        }
        catch {
            // Ignore errors
        }
        finally {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
        }
    }, []);

    const contextValue = React.useMemo(() => (
        {isAuthenticated, user, loading, login, logout, checkAuth}),
        [isAuthenticated, user, loading, login, logout, checkAuth]
    );

    return (
        <AuthTypes.Provider value={contextValue}>
            {children}
        </AuthTypes.Provider>
    );
};
