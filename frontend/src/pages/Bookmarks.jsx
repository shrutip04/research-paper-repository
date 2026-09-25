import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";

function Bookmarks() {
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        try {
            setError("");
            const res = await api.get(`/users/${user.user_id}/bookmarks`);
            setBookmarks(res.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Could not load your bookmarks.");
        } finally {
            setLoading(false);
        }
    }, [user.user_id]);

    useEffect(() => {
        load();
    }, [load]);

    const remove = async (paperId) => {
        try {
            await api.delete(`/papers/${paperId}/bookmark`);
            setBookmarks((prev) => prev.filter((b) => b.paper_id !== paperId));
        } catch (err) {
            console.error(err);
            setError("Could not remove that bookmark.");
        }
    };

    return (
        <Page
            eyebrow="LIBRARY"
            title="Bookmarks"
            subtitle="Papers you have saved for later."
            loading={loading}
            error={error}
        >
            {bookmarks.length === 0 ? (
                <div className="empty-state">
                    You have not bookmarked any papers yet.{" "}
                    <Link to="/discover">Discover papers →</Link>
                </div>
            ) : (
                <div className="paper-list">
                    {bookmarks.map((b) => (
                        <div className="paper-card" key={b.bookmark_id}>
                            <div className="paper-card-content">
                                <div className="paper-card-top">
                                    <span className="paper-type">{b.paper_type}</span>
                                    <span className="paper-year">{b.publication_year}</span>
                                </div>
                                <h3>{b.title}</h3>
                                <p className="paper-authors">
                                    {b.area_name}
                                    {b.venue_name ? ` · ${b.venue_name}` : ""}
                                </p>
                                <div className="paper-actions">
                                    <Link className="view-paper-button" to={`/papers/${b.paper_id}`}>
                                        View Paper
                                    </Link>
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => remove(b.paper_id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Page>
    );
}

export default Bookmarks;
