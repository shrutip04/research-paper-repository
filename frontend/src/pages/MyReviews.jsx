import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Page from "../components/Page";
import Stars from "../components/Stars";

function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [editing, setEditing] = useState(null); // { id, rating, comment }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get("/reviews/me");
                setReviews(res.data?.data || []);
            } catch (err) {
                console.error(err);
                setError("Could not load your reviews.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const save = async () => {
        try {
            setError("");
            const res = await api.put(`/reviews/${editing.id}`, {
                rating: Number(editing.rating),
                comment: editing.comment,
            });
            const updated = res.data?.data;
            setReviews((prev) =>
                prev.map((r) =>
                    r.review_id === updated.review_id
                        ? { ...r, rating: updated.rating, comment: updated.comment }
                        : r
                )
            );
            setEditing(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Could not update the review.");
        }
    };

    return (
        <Page
            eyebrow="LIBRARY"
            title="My Reviews"
            subtitle="Ratings and comments you have written."
            loading={loading}
            error={error}
        >
            {reviews.length === 0 ? (
                <div className="empty-state">
                    You have not reviewed any papers yet. <Link to="/discover">Find a paper →</Link>
                </div>
            ) : (
                <div className="paper-list">
                    {reviews.map((r) => (
                        <div className="paper-card" key={r.review_id}>
                            <div className="paper-card-content">
                                <h3>
                                    <Link to={`/papers/${r.paper_id}`}>{r.paper_title}</Link>
                                </h3>

                                {editing?.id === r.review_id ? (
                                    <>
                                        <select
                                            value={editing.rating}
                                            onChange={(e) => setEditing({ ...editing, rating: e.target.value })}
                                        >
                                            {[5, 4, 3, 2, 1].map((n) => (
                                                <option key={n} value={n}>{n} ★</option>
                                            ))}
                                        </select>
                                        <textarea
                                            rows={3}
                                            value={editing.comment || ""}
                                            onChange={(e) => setEditing({ ...editing, comment: e.target.value })}
                                        />
                                        <div className="paper-actions">
                                            <button type="button" className="primary-button" onClick={save}>Save</button>
                                            <button type="button" className="secondary-button" onClick={() => setEditing(null)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Stars rating={r.rating} />
                                        {r.comment && <p className="paper-abstract">{r.comment}</p>}
                                        <span className="review-date">{new Date(r.created_at).toLocaleDateString()}</span>
                                        <div className="paper-actions">
                                            <button
                                                type="button"
                                                className="secondary-button"
                                                onClick={() => setEditing({ id: r.review_id, rating: r.rating, comment: r.comment })}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Page>
    );
}

export default MyReviews;
