import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Page from "../components/Page";

function Authors() {
    const [authors, setAuthors] = useState([]);
    const [productivity, setProductivity] = useState({});
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [list, stats] = await Promise.all([
                    api.get("/authors"),
                    api.get("/analytics/authors"),
                ]);
                setAuthors(list.data?.data || []);
                setProductivity(
                    Object.fromEntries(
                        (stats.data?.data || []).map((a) => [a.author_id, a.publication_count])
                    )
                );
            } catch (err) {
                console.error(err);
                setError("Could not load authors.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return authors.filter((a) =>
            [a.name, a.affiliation, a.department].some((v) => (v || "").toLowerCase().includes(q))
        );
    }, [authors, query]);

    return (
        <Page
            eyebrow="PEOPLE"
            title="Authors"
            subtitle="Browse researchers and explore their collaborations."
            loading={loading}
            error={error}
        >
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Filter by name, affiliation or department..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {visible.length === 0 ? (
                <div className="empty-state">No authors match your filter.</div>
            ) : (
                <div className="card-grid">
                    {visible.map((a) => (
                        <Link className="info-card" key={a.author_id} to={`/authors/${a.author_id}`}>
                            <h3>{a.name}</h3>
                            <p>{a.affiliation}</p>
                            <p className="muted">{a.department}</p>
                            <span className="pill">
                                {productivity[a.author_id] ?? 0} papers
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </Page>
    );
}

export default Authors;
