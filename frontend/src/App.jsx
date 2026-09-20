import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Authors from "./pages/Authors";
import Areas from "./pages/Areas";
import Bookmarks from "./pages/Bookmarks";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import PaperDetails from "./pages/PaperDetails";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>

                            <Route
                                path="/"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/discover"
                                element={<Discover />}
                            />

                            <Route
                                path="/authors"
                                element={<Authors />}
                            />

                            <Route
                                path="/areas"
                                element={<Areas />}
                            />

                            <Route
                                path="/bookmarks"
                                element={<Bookmarks />}
                            />

                            <Route
                                path="/analytics"
                                element={<Analytics />}
                            />

                            <Route
                                path="/profile"
                                element={<Profile />}
                            />

                            <Route 
                                path="/papers/:id" 
                                element={<PaperDetails />} 
                            />

                        </Route>
                    </Route>

                    {/* Admin */}
                    <Route element={<AdminRoute />}>
                        <Route
                            path="/admin"
                            element={
                                <div>
                                    <h1>Admin Dashboard</h1>
                                </div>
                            }
                        />
                    </Route>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;