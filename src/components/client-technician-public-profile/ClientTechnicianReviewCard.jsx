function ClientTechnicianReviewCard({ review, client }) {
    function formatDateTime(dateTime) {
        if (!dateTime) return 'Fecha no disponible'

        const date = new Date(dateTime)

        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const fullClientName = [client?.name, client?.surname]
        .filter(Boolean)
        .join(' ')
        .trim()

    const locationText = [client?.city, client?.province]
        .filter(Boolean)
        .join(', ')

    return (
        <article className="client-technician-review-card">
            <div className="client-technician-review-card__header">
                <div>
                    <h3 className="client-technician-review-card__client-name">
                        {fullClientName || 'Cliente'}
                    </h3>

                    <p className="client-technician-review-card__meta">
                        {locationText || 'Ubicación no disponible'} · {formatDateTime(review.createdAt)}
                    </p>
                </div>

                <div className="client-technician-review-card__rating">
                    {'★'.repeat(Number(review.rating || 0))}
                </div>
            </div>

            <div className="client-technician-review-card__body">
                <p className="client-technician-review-card__comment">
                    {review.comment?.trim() ? review.comment : 'Sin comentario.'}
                </p>
            </div>

            {review.technicianReply?.trim() && (
                <div className="client-technician-review-card__reply">
                    <span className="client-technician-review-card__reply-label">
                        Respuesta del técnico
                    </span>
                    <p className="client-technician-review-card__reply-text">
                        {review.technicianReply}
                    </p>
                </div>
            )}
        </article>
    )
}

export default ClientTechnicianReviewCard