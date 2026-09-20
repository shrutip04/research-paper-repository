import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    ResearchSphere
                </div>

                <nav className="sidebar-nav">
                    <a href="/">Dashboard</a>
                    <a href="/discover">Discover</a>
                    <a href="/authors">Authors</a>
                    <a href="/areas">Research Areas</a>
                    <a href="/bookmarks">Bookmarks</a>
                    <a href="/analytics">Analytics</a>
                </nav>

                <div className="sidebar-bottom">
                    <a href="/profile">Profile</a>
                </div>
            </aside>

            <div className="main-section">
                <header className="navbar">
                    <div>
                        <strong>ResearchSphere</strong>
                    </div>

                    <div className="navbar-user">
                        Research Repository
                    </div>
                </header>

                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;