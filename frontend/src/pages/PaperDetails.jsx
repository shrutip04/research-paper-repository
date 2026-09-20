import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function PaperDetails() {
    const { id } = useParams();

    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/papers/${id}`);

                const data =
                    response.data?.paper ||
                    response.data?.data ||
                    response.data;

                setPaper(data);
            } catch (err) {
                console.error("Error fetching paper:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load paper."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPaper();
    }, [id]);

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-state">
                    Loading paper...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="error-state">
                    {error}
                </div>

                <Link to="/discover" className="back-link">
                    ← Back to Discover
                </Link>
            </div>
        );
    }

    if (!paper) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    Paper not found.
                </div>

                <Link to="/discover" className="back-link">
                    ← Back to Discover
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">

            <Link to="/discover" className="back-link">
                ← Back to Discover
            </Link>

            <div className="paper-details-card">

                <div className="paper-details-header">

                    <div>
                        <span className="paper-type-badge">
                            {paper.paper_type || "Research Paper"}
                        </span>

                        <h1>
                            {paper.title}
                        </h1>
                    </div>

                </div>

                <div className="paper-meta">

                    {paper.publication_year && (
                        <span>
                            📅 {paper.publication_year}
                        </span>
                    )}

                    {paper.venue_name && (
                        <span>
                            🏛️ {paper.venue_name}
                        </span>
                    )}

                    {paper.doi && (
                        <span>
                            DOI: {paper.doi}
                        </span>
                    )}

                </div>

                {paper.abstract && (
                    <section className="paper-section">
                        <h2>Abstract</h2>
                        <p>
                            {paper.abstract}
                        </p>
                    </section>
                )}

                <section className="paper-section">
                    <h2>Paper Information</h2>

                    <div className="paper-info-grid">

                        {paper.research_area_name && (
                            <div>
                                <strong>Research Area</strong>
                                <span>
                                    {paper.research_area_name}
                                </span>
                            </div>
                        )}

                        {paper.paper_type && (
                            <div>
                                <strong>Paper Type</strong>
                                <span>
                                    {paper.paper_type}
                                </span>
                            </div>
                        )}

                        {paper.publication_year && (
                            <div>
                                <strong>Publication Year</strong>
                                <span>
                                    {paper.publication_year}
                                </span>
                            </div>
                        )}

                        {paper.doi && (
                            <div>
                                <strong>DOI</strong>
                                <span>
                                    {paper.doi}
                                </span>
                            </div>
                        )}

                    </div>
                </section>

            </div>

        </div>
    );
}

export default PaperDetails;