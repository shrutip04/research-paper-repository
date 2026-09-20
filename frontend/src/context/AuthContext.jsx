import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("researchsphere_token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/auth/me");

                const userData =
                    response.data?.user ||
                    response.data?.data ||
                    response.data;

                setUser(userData);
            } catch (error) {
                console.error("Failed to restore session:", error);

                localStorage.removeItem("researchsphere_token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const token = response.data.token;

        localStorage.setItem("researchsphere_token", token);

        const userData =
            response.data?.user ||
            response.data?.data?.user;

        setUser(userData);

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
};

export const useAuth = () => useContext(AuthContext);