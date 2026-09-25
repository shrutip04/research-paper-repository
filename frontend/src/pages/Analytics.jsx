import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Page from "../components/Page";
import BarList from "../components/BarList";

const num = (v) => Number(v) || 0;

function Analytics() {
    const [papers, setPapers] = useState([]);
    const [areas, setAreas] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [p, a, au, t] = await Promise.all([
                    api.get("/analytics/papers"),
                    api.get("/analytics/areas"),
                    api.get("/analytics/authors"),
                    api.get("/analytics/trends"),
                ]);
                setPapers(p.data?.data || []);
                setAreas(a.data?.data || []);
                setAuthors(au.data?.data || []);
                setTrends(t.data?.data || []);
            } catch (err) {
                console.error(err);
                setError("Could not load analytics.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totalCitations = papers.reduce((s, p) => s + num(p.citation_count), 0);
    const totalDownloads = papers.reduce((s, p) => s + num(p.download_count), 0);
    const rated = papers.filter((p) => num(p.average_rating) > 0);
    const avgRating = rated.length
        ? (rated.reduce((s, p) => s + num(p.average_rating), 0) / rated.length).toFixed(2)
        : "–";

    const popular = [...papers]
        .sort((a, b) => num(b.citation_count) + num(b.download_count) - (num(a.citation_count) + num(a.download_count)))
        .slice(0, 5);

    return (
        <Page
            eyebrow="INSIGHTS"
            title="Analytics"
            subtitle="Repository statistics computed from PostgreSQL views."
            loading={loading}
            error={error}
        >
            <section className="stats-grid">
                <div className="stat-card"><div><p>Papers</p><h2>{papers.length}</h2></div></div>
                <div className="stat-card"><div><p>Research Areas</p><h2>{areas.length}</h2></div></div>
                <div className="stat-card"><div><p>Citations</p><h2>{totalCitations}</h2></div></div>
                <div className="stat-card"><div><p>Downloads</p><h2>{totalDownloads}</h2></div></div>
                <div className="stat-card"><div><p>Avg. Rating</p><h2>{avgRating}</h2></div></div>
            </section>

            <div className="dashboard-columns">
                <section className="dashboard-panel">
                    <div className="panel-header"><h2>Publication Trend</h2></div>
                    <div className="list-body">
                        <BarList
                            rows={trends.map((t) => ({ label: String(t.publication_year), value: num(t.paper_count) }))}
                        />
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="panel-header"><h2>Papers by Research Area</h2></div>
                    <div className="list-body">
                        <BarList rows={areas.map((a) => ({ label: a.area_name, value: num(a.paper_count) }))} />
                    </div>
                </section>
            </div>

            <div className="dashboard-columns">
                <section className="dashboard-panel">
                    <div className="panel-header"><h2>Author Productivity</h2></div>
                    <div className="list-body">
                        <BarList
                            rows={authors.slice(0, 8).map((a) => ({ label: a.author_name, value: num(a.publication_count) }))}
                        />
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="panel-header"><h2>Most Engaged Papers</h2></div>
                    <div className="list-body">
                        {popular.map((p) => (
                            <Link className="list-row" key={p.paper_id} to={`/papers/${p.paper_id}`}>
                                <strong>{p.title}</strong>
                                <span className="muted">
                                    {p.citation_count} citations · {p.download_count} downloads
                                    {num(p.average_rating) > 0 ? ` · ★ ${p.average_rating}` : ""}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </Page>
    );
}

export default Analytics;
