import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Authors from "./pages/Authors";
import Areas from "./pages/Areas";
import Bookmarks from "./pages/Bookmarks";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/areas" element={<Areas />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;