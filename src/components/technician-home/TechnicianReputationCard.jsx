function TechnicianReputationCard({ technician }) {
    const averageRating = Number(technician.averageRating || 0)
    const totalReviews = Number(technician.totalReviews || 0)

    return (
        <section className="technician-panel-card technician-panel-card--compact">
            <div className="technician-panel-card__header">
                <h2 className="technician-panel-card__title">Reputación</h2>
            </div>

            <div className="technician-reputation">
                <div className="technician-reputation__score">
                    <span className="technician-reputation__rating">
                        {averageRating.toFixed(1)}
                    </span>
                    <span className="technician-reputation__stars">★</span>
                </div>

                <p className="technician-reputation__reviews">
                    {totalReviews > 0
                        ? `${totalReviews} reseña${totalReviews === 1 ? '' : 's'} recibida${totalReviews === 1 ? '' : 's'}`
                        : 'Todavía no tienes reseñas'}
                </p>
            </div>
        </section>
    )
}

export default TechnicianReputationCard