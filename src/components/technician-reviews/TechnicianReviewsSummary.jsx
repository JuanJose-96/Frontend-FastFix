function TechnicianReviewsSummary({ reviews }) {
    const totalReviews = reviews.length

    const averageRating =
        totalReviews === 0
            ? 0
            : reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
            totalReviews

    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    }

    reviews.forEach((review) => {
        const rating = Number(review.rating || 0)
        if (ratingCounts[rating] !== undefined) {
            ratingCounts[rating] += 1
        }
    })

    function getPercentage(rating) {
        if (totalReviews === 0) return 0
        return (ratingCounts[rating] / totalReviews) * 100
    }

    return (
        <section className="technician-reviews-summary">
            <div className="technician-reviews-summary__left">
                <div className="technician-reviews-summary__score-row">
                    <span className="technician-reviews-summary__score">
                        {averageRating.toFixed(1)}
                    </span>
                    <span className="technician-reviews-summary__star">★</span>
                </div>

                <p className="technician-reviews-summary__total">
                    Basado en {totalReviews} reseña{totalReviews === 1 ? '' : 's'}
                </p>
            </div>

            <div className="technician-reviews-summary__right">
                {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="technician-reviews-summary__bar-row">
                        <span className="technician-reviews-summary__bar-label">
                            {rating} estrellas
                        </span>

                        <div className="technician-reviews-summary__bar-track">
                            <div
                                className="technician-reviews-summary__bar-fill"
                                style={{ width: `${getPercentage(rating)}%` }}
                            />
                        </div>

                        <span className="technician-reviews-summary__bar-count">
                            {ratingCounts[rating]}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default TechnicianReviewsSummary
