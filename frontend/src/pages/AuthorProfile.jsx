import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import Page from "../components/Page";

function AuthorProfile() {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [papers, setPapers] = useState([]);
    const [collabs, setCollabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const [a, p, c] = await Promise.all([
                    api.get(`/authors/${id}`),
                    api.get(`/authors/${id}/papers`),
                    api.get(`/authors/${id}/collaborations`),
                ]);
                setAuthor(a.data?.data || null);
                setPapers(p.data?.data || []);
                setCollabs(c.data?.data || []);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.status === 404
                        ? "Author not found."
                        : "Could not load this author."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const areas = [...new Set(papers.map((p) => p.area_name).filter(Boolean))];

    return (
        <Page
            eyebrow="AUTHOR PROFILE"
            title={author?.name || "Author"}
            subtitle={author ? [author.affiliation, author.department].filter(Boolean).join(" · ") : ""}
            loading={loading}
            error={error}
        >
            {author && (
                <>
                    {author.bio && <p className="paper-abstract">{author.bio}</p>}

                    <section className="stats-grid">
                        <div className="stat-card">
                            <div>
                                <p>Papers</p>
                                <h2>{papers.length}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p>Collaborators</p>
                                <h2>{collabs.length}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <p>Research Areas</p>
                                <h2>{areas.length}</h2>
                            </div>
                        </div>
                    </section>

                    <div className="dashboard-columns">
                        <section className="dashboard-panel">
                            <div className="panel-header"><h2>Papers</h2></div>
                            <div className="list-body">
                                {papers.length === 0 ? (
                                    <div className="empty-state">No papers on record.</div>
                                ) : (
                                    papers.map((p) => (
                                        <Link className="list-row" key={p.paper_id} to={`/papers/${p.paper_id}`}>
                                            <strong>{p.title}</strong>
                                            <span className="muted">
                                                {p.publication_year} · {p.area_name} · {p.paper_type}
                                            </span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="dashboard-panel">
                            <div className="panel-header"><h2>Collaborators</h2></div>
                            <div className="list-body">
                                {collabs.length === 0 ? (
                                    <div className="empty-state">No shared papers yet.</div>
                                ) : (
                                    collabs.map((c) => (
                                        <Link className="list-row" key={c.author_id} to={`/authors/${c.author_id}`}>
                                            <strong>{c.name}</strong>
                                            <span className="muted">
                                                {c.affiliation} · {c.shared_papers} shared paper
                                                {Number(c.shared_papers) === 1 ? "" : "s"}
                                            </span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </>
            )}
        </Page>
    );
}

export default AuthorProfile;
