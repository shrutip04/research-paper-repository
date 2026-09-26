import { Star } from "lucide-react";

// Renders a 5-star rating as crisp SVG icons instead of text glyphs.
function Stars({ rating, size = 15 }) {
    const value = Math.round(Number(rating) || 0);

    return (
        <span
            className="review-rating"
            aria-label={`${value} out of 5`}
        >
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    size={size}
                    className={index < value ? "star-filled" : "star-empty"}
                />
            ))}
        </span>
    );
}

export default Stars;