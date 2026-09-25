function Stars({ rating }) {
    const value = Math.round(Number(rating) || 0);

    return (
        <span className="review-rating" aria-label={`${value} out of 5`}>
            {"★".repeat(value)}
            {"☆".repeat(5 - value)}
        </span>
    );
}

export default Stars;
