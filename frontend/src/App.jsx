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
import AuthorProfile from "./pages/AuthorProfile";
import Areas from "./pages/Areas";
import Bookmarks from "./pages/Bookmarks";
import MyReviews from "./pages/MyReviews";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import PaperDetails from "./pages/PaperDetails";
import Admin from "./pages/Admin";

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
                                path="/authors/:id"
                                element={<AuthorProfile />}
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
                                path="/reviews/me"
                                element={<MyReviews />}
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
                        <Route element={<MainLayout />}>
                            <Route
                                path="/admin"
                                element={<Admin />}
                            />
                        </Route>
                    </Route>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;