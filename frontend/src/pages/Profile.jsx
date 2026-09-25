import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <Page eyebrow="ACCOUNT" title="Profile" subtitle="Your ResearchSphere account.">
            <section className="dashboard-panel profile-panel">
                <dl className="detail-list">
                    <dt>Name</dt>
                    <dd>{user.name}</dd>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                    <dt>Role</dt>
                    <dd><span className="pill">{user.role}</span></dd>
                    <dt>Member since</dt>
                    <dd>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "–"}</dd>
                </dl>
                <button type="button" className="primary-button" onClick={handleLogout}>
                    Log out
                </button>
            </section>
        </Page>
    );
}

export default Profile;
