import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Page from "../components/Page";
import CountUp from "../reactbits/CountUp/CountUp";

function Admin() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [s, u, l] = await Promise.all([
                    api.get("/admin/stats"),
                    api.get("/admin/users"),
                    api.get("/admin/audit-logs?limit=25"),
                ]);
                setStats(s.data?.data || null);
                setUsers(u.data?.data || []);
                setLogs(l.data?.data || []);
            } catch (err) {
                console.error(err);
                setError("Could not load admin data.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const cards = stats
        ? [
              ["Users", stats.total_users],
              ["Papers", stats.total_papers],
              ["Authors", stats.total_authors],
              ["Citations", stats.total_citations],
              ["Downloads", stats.total_downloads],
              ["Bookmarks", stats.total_bookmarks],
              ["Reviews", stats.total_reviews],
              ["Avg. Rating", stats.average_rating],
          ]
        : [];

    return (
        <Page
            eyebrow="ADMINISTRATION"
            title="Admin Dashboard"
            subtitle="System statistics, users and the paper audit trail."
            loading={loading}
            error={error}
        >
            <section className="stats-grid">
                {cards.map(([label, value]) => (
                    <div className="stat-card" key={label}>
                        <div>
                            <p>{label}</p>
                            <h2>
                                {typeof value === "number" || /^\d+(\.\d+)?$/.test(String(value))
                                    ? <CountUp to={Number(value)} duration={1.2} />
                                    : value}
                            </h2>
                        </div>
                    </div>
                ))}
            </section>

            <section className="dashboard-panel">
                <div className="panel-header"><h2>Users</h2></div>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Papers</th><th>Reviews</th><th>Bookmarks</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.user_id}>
                                    <td>{u.user_id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className="pill">{u.role}</span></td>
                                    <td>{u.paper_count}</td>
                                    <td>{u.review_count}</td>
                                    <td>{u.bookmark_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="dashboard-panel">
                <div className="panel-header"><h2>Recent Paper Changes (audit_log)</h2></div>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr><th>When</th><th>Action</th><th>Paper</th><th>User</th><th>Detail</th></tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr><td colSpan={5}>No audit entries yet.</td></tr>
                            ) : (
                                logs.map((l) => (
                                    <tr key={l.audit_id}>
                                        <td>{new Date(l.logged_at).toLocaleString()}</td>
                                        <td><span className="pill">{l.action}</span></td>
                                        <td>
                                            {l.paper_id ? <Link to={`/papers/${l.paper_id}`}>#{l.paper_id}</Link> : "deleted"}
                                        </td>
                                        <td>{l.user_id ?? "–"}</td>
                                        <td className="muted">{(l.new_value || l.old_value || "").slice(0, 70)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </Page>
    );
}

export default Admin;
