import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function PaperDetails() {
    const { id } = useParams();

    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    const [downloadCount, setDownloadCount] = useState(0);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const [citations, setCitations] = useState([]);
    const [citedBy, setCitedBy] = useState([]);
    const [citationStats, setCitationStats] = useState(null);

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                setLoading(true);
                setError("");

                // Fetch paper
                const response = await api.get(`/papers/${id}`);

                const data =
                    response.data?.paper ||
                    response.data?.data ||
                    response.data;

                setPaper(data);

                // Fetch download statistics
                try {
                    const downloadResponse = await api.get(
                        `/papers/${id}/downloads`
                    );

                    const downloadData =
                        downloadResponse.data?.downloads ||
                        downloadResponse.data?.data ||
                        downloadResponse.data;

                    if (Array.isArray(downloadData)) {
                        setDownloadCount(downloadData.length);
                    } else if (typeof downloadData === "number") {
                        setDownloadCount(downloadData);
                    } else if (downloadData?.count !== undefined) {
                        setDownloadCount(downloadData.count);
                    }
                } catch (downloadError) {
                    console.error(
                        "Error fetching downloads:",
                        downloadError
                    );
                }

                // Fetch citation information
                try {
                    const [
                        citationsResponse,
                        citedByResponse,
                        statsResponse,
                    ] = await Promise.all([
                        api.get(`/papers/${id}/citations`),
                        api.get(`/papers/${id}/cited-by`),
                        api.get(`/papers/${id}/citation-stats`),
                    ]);

                    const citationsData =
                        citationsResponse.data?.citations ||
                        citationsResponse.data?.data ||
                        citationsResponse.data;

                    const citedByData =
                        citedByResponse.data?.citedBy ||
                        citedByResponse.data?.cited_by ||
                        citedByResponse.data?.data ||
                        citedByResponse.data;

                    const statsData =
                        statsResponse.data?.stats ||
                        statsResponse.data?.data ||
                        statsResponse.data;

                    if (Array.isArray(citationsData)) {
                        setCitations(citationsData);
                    }

                    if (Array.isArray(citedByData)) {
                        setCitedBy(citedByData);
                    }

                    setCitationStats(statsData);
                } catch (citationError) {
                    console.error(
                        "Error fetching citation data:",
                        citationError
                    );
                }
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

    const handleBookmark = async () => {
        try {
            setBookmarkLoading(true);

            if (!bookmarked) {
                await api.post(`/papers/${id}/bookmark`);
                setBookmarked(true);
            } else {
                await api.delete(`/papers/${id}/bookmark`);
                setBookmarked(false);
            }
        } catch (err) {
            console.error("Bookmark error:", err);

            if (err.response?.status === 409) {
                setBookmarked(true);
            }
        } finally {
            setBookmarkLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloadLoading(true);

            await api.post(`/papers/${id}/download`);

            setDownloadCount((previousCount) => previousCount + 1);
        } catch (err) {
            console.error("Download error:", err);
        } finally {
            setDownloadLoading(false);
        }
    };

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

                        <h1>{paper.title}</h1>
                    </div>

                    <div className="paper-actions">

                        <button
                            type="button"
                            onClick={handleBookmark}
                            disabled={bookmarkLoading}
                            className="bookmark-button"
                        >
                            {bookmarkLoading
                                ? "Saving..."
                                : bookmarked
                                    ? "🔖 Bookmarked"
                                    : "🔖 Bookmark"}
                        </button>

                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={downloadLoading}
                            className="download-button"
                        >
                            {downloadLoading
                                ? "Recording..."
                                : "⬇️ Download"}
                        </button>

                    </div>

                </div>

                <div className="paper-meta">

                    <span>
                        ⬇️ {downloadCount} downloads
                    </span>

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

                <section className="paper-section">

                    <div className="citation-header">

                        <h2>Citation Network</h2>

                        <div className="citation-stats">

                            <div className="citation-stat">

                                <strong>
                                    {citationStats?.citation_count ??
                                        citationStats?.citations ??
                                        citations.length}
                                </strong>

                                <span>
                                    Citations
                                </span>

                            </div>

                            <div className="citation-stat">

                                <strong>
                                    {citationStats?.cited_by_count ??
                                        citationStats?.cited_by ??
                                        citedBy.length}
                                </strong>

                                <span>
                                    Cited By
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="citation-columns">

                        <div>

                            <h3>
                                Papers This Paper Cites
                            </h3>

                            {citations.length === 0 ? (
                                <p className="empty-text">
                                    No citation records found.
                                </p>
                            ) : (
                                <div className="citation-list">

                                    {citations.map(
                                        (citation, index) => (
                                            <div
                                                className="citation-card"
                                                key={
                                                    citation.paper_id ||
                                                    citation.cited_paper_id ||
                                                    citation.id ||
                                                    index
                                                }
                                            >

                                                <strong>
                                                    {citation.title ||
                                                        citation.paper_title ||
                                                        `Paper ${
                                                            citation.cited_paper_id ||
                                                            ""
                                                        }`}
                                                </strong>

                                                {citation.publication_year && (
                                                    <span>
                                                        {
                                                            citation.publication_year
                                                        }
                                                    </span>
                                                )}

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                        <div>

                            <h3>
                                Papers Citing This Paper
                            </h3>

                            {citedBy.length === 0 ? (
                                <p className="empty-text">
                                    No papers currently cite this paper.
                                </p>
                            ) : (
                                <div className="citation-list">

                                    {citedBy.map(
                                        (citation, index) => (
                                            <div
                                                className="citation-card"
                                                key={
                                                    citation.paper_id ||
                                                    citation.citing_paper_id ||
                                                    citation.id ||
                                                    index
                                                }
                                            >

                                                <strong>
                                                    {citation.title ||
                                                        citation.paper_title ||
                                                        `Paper ${
                                                            citation.citing_paper_id ||
                                                            ""
                                                        }`}
                                                </strong>

                                                {citation.publication_year && (
                                                    <span>
                                                        {
                                                            citation.publication_year
                                                        }
                                                    </span>
                                                )}

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default PaperDetails;