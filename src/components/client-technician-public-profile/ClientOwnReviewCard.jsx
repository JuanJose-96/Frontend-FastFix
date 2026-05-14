import ClientReviewForm from './ClientReviewForm'

function ClientOwnReviewCard({
    review,
    isEditing,
    isSubmitting,
    isDeleting,
    formData,
    formError,
    onFieldChange,
    onStartEditing,
    onCancelEditing,
    onSubmit,
    onDelete,
}) {
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

    if (isEditing) {
        return (
            <div className="client-own-review-card">
                <ClientReviewForm
                    title="Editar tu reseña"
                    submitLabel="Guardar cambios"
                    isSubmitting={isSubmitting}
                    formData={formData}
                    formError={formError}
                    onFieldChange={onFieldChange}
                    onSubmit={onSubmit}
                />

                <div className="client-own-review-card__actions">
                    <button
                        type="button"
                        className="client-own-review-card__button client-own-review-card__button--secondary"
                        onClick={onCancelEditing}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="client-own-review-card__button client-own-review-card__button--danger"
                        onClick={onDelete}
                        disabled={isDeleting || isSubmitting}
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar reseña'}
                    </button>
                </div>
            </div>
        )
    }

    const hasTechnicianReply = Boolean(review.technicianReply?.trim())

    return (
        <article className="client-own-review-card">
            <div className="client-own-review-card__header">
                <div>
                    <h3 className="client-own-review-card__title">Tu reseña</h3>
                    <p className="client-own-review-card__date">
                        {formatDateTime(review.createdAt)}
                    </p>
                </div>

                <div className="client-own-review-card__rating">
                    {'★'.repeat(Number(review.rating || 0))}
                </div>
            </div>

            <div className="client-own-review-card__body">
                <p className="client-own-review-card__comment">
                    {review.comment?.trim()
                        ? review.comment
                        : 'No dejaste comentario. Solo has valorado con estrellas.'}
                </p>
            </div>

            {hasTechnicianReply && (
                <div className="client-own-review-card__reply">
                    <span className="client-own-review-card__reply-label">
                        Respuesta del técnico
                    </span>

                    {review.technicianReplyDate && (
                        <p className="client-own-review-card__reply-date">
                            {formatDateTime(review.technicianReplyDate)}
                        </p>
                    )}

                    <p className="client-own-review-card__reply-text">
                        {review.technicianReply}
                    </p>
                </div>
            )}

            <div className="client-own-review-card__actions">
                <button
                    type="button"
                    className="client-own-review-card__button client-own-review-card__button--secondary"
                    onClick={onStartEditing}
                >
                    Editar reseña
                </button>

                <button
                    type="button"
                    className="client-own-review-card__button client-own-review-card__button--danger"
                    onClick={onDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Eliminando...' : 'Eliminar reseña'}
                </button>
            </div>
        </article>
    )
}

export default ClientOwnReviewCard