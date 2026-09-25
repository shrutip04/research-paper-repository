import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function MainLayout() {
    const { user } = useAuth();
    return (
        <div className="app-layout">

            <aside className="sidebar">

                <div className="sidebar-logo">
                    ResearchSphere
                </div>

                <nav className="sidebar-nav">

                    <NavLink to="/">
                        Dashboard
                    </NavLink>

                    <NavLink to="/discover">
                        Discover
                    </NavLink>

                    <NavLink to="/authors">
                        Authors
                    </NavLink>

                    <NavLink to="/areas">
                        Research Areas
                    </NavLink>

                    <NavLink to="/bookmarks">
                        Bookmarks
                    </NavLink>

                    <NavLink to="/reviews/me">
                        My Reviews
                    </NavLink>

                    <NavLink to="/analytics">
                        Analytics
                    </NavLink>

                    {user?.role === "ADMIN" && (
                        <NavLink to="/admin">
                            Admin
                        </NavLink>
                    )}

                </nav>

                <div className="sidebar-bottom">

                    <NavLink to="/profile">
                        {user?.name || "Profile"}
                    </NavLink>

                </div>

            </aside>

            <div className="main-section">

                <header className="navbar">

                    <strong>
                        ResearchSphere
                    </strong>

                    <span className="navbar-user">
                        Research Repository
                    </span>

                </header>

                <main className="main-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default MainLayout;