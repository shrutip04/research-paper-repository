import { NavLink, Outlet } from "react-router-dom";

function MainLayout() {
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

                    <NavLink to="/analytics">
                        Analytics
                    </NavLink>

                </nav>

                <div className="sidebar-bottom">

                    <NavLink to="/profile">
                        Profile
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