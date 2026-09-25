import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Page from "../components/Page";

function Areas() {
    const [areas, setAreas] = useState([]);
    const [stats, setStats] = useState({});
    const [keywords, setKeywords] = useState([]);
    const [selected, setSelected] = useState(null); // { type, id, name }
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [papersLoading, setPapersLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [a, s, k] = await Promise.all([
                    api.get("/areas"),
                    api.get("/analytics/areas"),
                    api.get("/keywords"),
                ]);
                setAreas(a.data?.data || []);
                setStats(Object.fromEntries((s.data?.data || []).map((r) => [r.area_id, r])));
                setKeywords(k.data?.data || []);
            } catch (err) {
                console.error(err);
                setError("Could not load research areas.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const choose = async (type, id, name) => {
        try {
            setSelected({ type, id, name });
            setPapersLoading(true);
            setError("");
            const path = type === "area" ? `/areas/${id}/papers` : `/keywords/${id}/papers`;
            const res = await api.get(path);
            setPapers(res.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Could not load papers.");
        } finally {
            setPapersLoading(false);
        }
    };

    return (
        <Page
            eyebrow="KNOWLEDGE MAP"
            title="Research Areas & Keywords"
            subtitle="Explore the repository by topic."
            loading={loading}
            error={error}
        >
            <div className="card-grid">
                {areas.map((a) => (
                    <button
                        type="button"
                        key={a.area_id}
                        className={`info-card ${selected?.type === "area" && selected.id === a.area_id ? "selected" : ""}`}
                        onClick={() => choose("area", a.area_id, a.area_name)}
                    >
                        <h3>{a.area_name}</h3>
                        <p className="muted">{a.description}</p>
                        <span className="pill">{stats[a.area_id]?.paper_count ?? 0} papers</span>{" "}
                        <span className="pill">{stats[a.area_id]?.citation_count ?? 0} citations</span>
                    </button>
                ))}
            </div>

            <h2 className="subheading">Keywords</h2>
            <div className="chip-row">
                {keywords.map((k) => (
                    <button
                        type="button"
                        key={k.keyword_id}
                        className={`chip ${selected?.type === "keyword" && selected.id === k.keyword_id ? "selected" : ""}`}
                        onClick={() => choose("keyword", k.keyword_id, k.keyword_name)}
                    >
                        {k.keyword_name}
                    </button>
                ))}
            </div>

            {selected && (
                <section className="dashboard-panel results-panel">
                    <div className="panel-header">
                        <h2>Papers: {selected.name}</h2>
                    </div>
                    <div className="list-body">
                        {papersLoading ? (
                            <div className="loading-state">Loading...</div>
                        ) : papers.length === 0 ? (
                            <div className="empty-state">No papers found.</div>
                        ) : (
                            papers.map((p) => (
                                <Link className="list-row" key={p.paper_id} to={`/papers/${p.paper_id}`}>
                                    <strong>{p.title}</strong>
                                    <span className="muted">
                                        {p.publication_year} · {p.area_name}
                                        {p.venue_name ? ` · ${p.venue_name}` : ""}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            )}
        </Page>
    );
}

export default Areas;
