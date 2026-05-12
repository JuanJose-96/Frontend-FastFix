function ClientTechnicianReviewsSummary({ reviews }) {
    const totalReviews = reviews.length

    const averageRating =
        totalReviews > 0
            ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews
            : 0

    function getCountByRating(starValue) {
        return reviews.filter((review) => Number(review.rating) === starValue).length
    }

    function getPercentage(starValue) {
        if (totalReviews === 0) return 0
        return (getCountByRating(starValue) / totalReviews) * 100
    }

    return (
        <section className="client-technician-reviews-summary">
            <div className="client-technician-reviews-summary__overview">
                <div className="client-technician-reviews-summary__score">
                    <span className="client-technician-reviews-summary__rating-number">
                        {averageRating.toFixed(1)}
                    </span>
                    <span className="client-technician-reviews-summary__rating-star">★</span>
                </div>

                <p className="client-technician-reviews-summary__text">
                    Basado en {totalReviews} reseña{totalReviews === 1 ? '' : 's'}
                </p>
            </div>

            <div className="client-technician-reviews-summary__bars">
                {[5, 4, 3, 2, 1].map((starValue) => {
                    const count = getCountByRating(starValue)
                    const percentage = getPercentage(starValue)

                    return (
                        <div
                            key={starValue}
                            className="client-technician-reviews-summary__bar-row"
                        >
                            <span className="client-technician-reviews-summary__bar-label">
                                {starValue} estrellas
                            </span>

                            <div className="client-technician-reviews-summary__bar-track">
                                <div
                                    className="client-technician-reviews-summary__bar-fill"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <span className="client-technician-reviews-summary__bar-count">
                                {count}
                            </span>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default ClientTechnicianReviewsSummary