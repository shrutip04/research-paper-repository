import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("researchsphere_token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/auth/me")
            .then((response) => {
                setUser(response.data.user);
            })
            .catch(() => {
                localStorage.removeItem("researchsphere_token");
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const token = response.data.token;

        localStorage.setItem("researchsphere_token", token);

        setUser(response.data.user);

        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post("/auth/register", userData);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("researchsphere_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}