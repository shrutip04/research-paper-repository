import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
    const { user } = useAuth();

    const [papers, setPapers] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [papersResponse, authorsResponse, areasResponse] =
                    await Promise.all([
                        api.get("/analytics/papers"),
                        api.get("/analytics/authors"),
                        api.get("/analytics/areas"),
                    ]);

                const extractData = (response) => {
                    const data = response.data;

                    if (Array.isArray(data)) return data;
                    if (Array.isArray(data.data)) return data.data;
                    if (Array.isArray(data.results)) return data.results;

                    return [];
                };

                setPapers(extractData(papersResponse));
                setAuthors(extractData(authorsResponse));
                setAreas(extractData(areasResponse));
            } catch (err) {
                console.error("Dashboard loading error:", err);
                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const totalCitations = papers.reduce(
        (sum, paper) =>
            sum +
            Number(
                paper.citations_count ??
                paper.citation_count ??
                paper.total_citations ??
                paper.citations ??
                0
            ),
        0
    );

    const totalDownloads = papers.reduce(
        (sum, paper) =>
            sum +
            Number(
                paper.downloads_count ??
                paper.download_count ??
                paper.total_downloads ??
                paper.downloads ??
                0
            ),
        0
    );

    const recentPapers = [...papers]
        .sort(
            (a, b) =>
                Number(b.publication_year ?? b.year ?? 0) -
                Number(a.publication_year ?? a.year ?? 0)
        )
        .slice(0, 6);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="loading-state">
                    Loading ResearchSphere...
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <section className="dashboard-hero">
                <div>
                    <p className="eyebrow">RESEARCH WORKSPACE</p>

                    <h1>
                        Welcome back{user?.email ? `, ${user.email}` : ""} 👋
                    </h1>

                    <p className="hero-subtitle">
                        Discover research, explore authors, and track
                        knowledge across your research repository.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => {
                        window.location.href = "/discover";
                    }}
                >
                    Explore Research →
                </button>
            </section>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            <section className="stats-grid">

                <div className="stat-card">
                    <div className="stat-icon">📄</div>
                    <div>
                        <p>Total Papers</p>
                        <h2>{papers.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div>
                        <p>Total Authors</p>
                        <h2>{authors.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔗</div>
                    <div>
                        <p>Total Citations</p>
                        <h2>{totalCitations}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⬇</div>
                    <div>
                        <p>Total Downloads</p>
                        <h2>{totalDownloads}</h2>
                    </div>
                </div>

            </section>

            <div className="dashboard-columns">

                <section className="dashboard-panel">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">DISCOVERY</p>
                            <h2>Recent Research</h2>
                        </div>

                        <a href="/discover" className="view-all">
                            View all →
                        </a>
                    </div>

                    <div className="paper-list">

                        {recentPapers.length === 0 ? (
                            <div className="empty-state">
                                No research papers available.
                            </div>
                        ) : (
                            recentPapers.map((paper, index) => (
                                <div
                                    className="dashboard-paper"
                                    key={
                                        paper.paper_id ??
                                        paper.id ??
                                        index
                                    }
                                >
                                    <div className="paper-main">

                                        <span className="paper-type">
                                            {paper.paper_type ??
                                                paper.type ??
                                                "RESEARCH PAPER"}
                                        </span>

                                        <h3>
                                            {paper.title ??
                                                "Untitled Research Paper"}
                                        </h3>

                                        <p className="paper-meta">
                                            {paper.publication_year ??
                                                paper.year ??
                                                "Year unavailable"}
                                            {" • "}
                                            {paper.venue_name ??
                                                paper.venue ??
                                                "Publication venue unavailable"}
                                        </p>

                                        <div className="paper-metrics">
                                            <span>
                                                🔗{" "}
                                                {paper.citations_count ??
                                                    paper.citation_count ??
                                                    paper.citations ??
                                                    0}{" "}
                                                citations
                                            </span>

                                            <span>
                                                ⬇{" "}
                                                {paper.downloads_count ??
                                                    paper.download_count ??
                                                    paper.downloads ??
                                                    0}{" "}
                                                downloads
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="secondary-button"
                                        onClick={() => {
                                            const id =
                                                paper.paper_id ??
                                                paper.id;

                                            if (id) {
                                                window.location.href =
                                                    `/papers/${id}`;
                                            }
                                        }}
                                    >
                                        View
                                    </button>
                                </div>
                            ))
                        )}

                    </div>
                </section>

                <section className="dashboard-panel areas-panel">

                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">KNOWLEDGE MAP</p>
                            <h2>Research Areas</h2>
                        </div>
                    </div>

                    <div className="area-list">

                        {areas.length === 0 ? (
                            <div className="empty-state">
                                No research areas available.
                            </div>
                        ) : (
                            areas.slice(0, 8).map((area, index) => (
                                <div
                                    className="area-item"
                                    key={
                                        area.area_id ??
                                        area.research_area_id ??
                                        index
                                    }
                                >
                                    <div className="area-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <div>
                                        <strong>
                                            {area.area_name ??
                                                area.name ??
                                                area.research_area ??
                                                "Research Area"}
                                        </strong>

                                        <span>
                                            {area.paper_count ??
                                                area.total_papers ??
                                                area.papers_count ??
                                                0}{" "}
                                            papers
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Dashboard;