import { useMemo, useState } from 'react'
import TechnicianReviewReplyForm from './TechnicianReviewReplyForm'

function TechnicianReviewCard({
    review,
    clientDisplay,
    technicianId,
    onReplySubmit,
    onDeleteReply,
    submittingReviewId,
    deletingReplyId,
}) {
    const [isReplying, setIsReplying] = useState(false)
    const [isEditingReply, setIsEditingReply] = useState(false)

    const hasComment = useMemo(() => {
        return Boolean(review.comment && review.comment.trim())
    }, [review.comment])

    const hasReply = useMemo(() => {
        return Boolean(review.technicianReply && review.technicianReply.trim())
    }, [review.technicianReply])

    const isSubmitting = submittingReviewId === review.id
    const isDeleting = deletingReplyId === review.id

    function formatDateTime(dateValue) {
        if (!dateValue) return 'No disponible'

        const date = new Date(dateValue)

        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    function handleStartReply() {
        setIsEditingReply(false)
        setIsReplying(true)
    }

    function handleStartEditReply() {
        setIsReplying(false)
        setIsEditingReply(true)
    }

    function handleCancelForm() {
        setIsReplying(false)
        setIsEditingReply(false)
    }

    async function handleSubmitReply(replyText) {
        await onReplySubmit(review.id, technicianId, replyText)
        setIsReplying(false)
        setIsEditingReply(false)
    }

    async function handleDeleteReply() {
        await onDeleteReply(review.id, technicianId)
        setIsReplying(false)
        setIsEditingReply(false)
    }

    return (
        <article className="technician-review-card">
            <div className="technician-review-card__header">
                <div className="technician-review-card__client">
                    <h3 className="technician-review-card__client-name">
                        {[clientDisplay?.name, clientDisplay?.surname].filter(Boolean).join(' ') ||
                            `Cliente #${review.clientId}`}
                    </h3>

                    <p className="technician-review-card__client-location">
                        {clientDisplay?.city || 'No disponible'}, {clientDisplay?.province || 'No disponible'}
                    </p>
                </div>

                <div className="technician-review-card__meta">
                    <span className="technician-review-card__rating">
                        {'★'.repeat(Number(review.rating || 0))}
                    </span>

                    <span className="technician-review-card__date">
                        {formatDateTime(review.createdAt)}
                    </span>
                </div>
            </div>

            <div className="technician-review-card__comment-block">
                <span className="technician-review-card__block-label">Reseña del cliente</span>
                <p className="technician-review-card__comment">
                    {hasComment ? review.comment : 'Sin comentario.'}
                </p>
            </div>

            {hasReply && !isEditingReply && (
                <div className="technician-review-card__reply-block">
                    <span className="technician-review-card__block-label">
                        Tu respuesta
                    </span>

                    <p className="technician-review-card__reply-text">{review.technicianReply}</p>

                    {review.technicianReplyDate && (
                        <p className="technician-review-card__reply-date">
                            Respondido el {formatDateTime(review.technicianReplyDate)}
                        </p>
                    )}

                    <div className="technician-review-card__reply-actions">
                        <button
                            type="button"
                            className="technician-review-card__button technician-review-card__button--secondary"
                            onClick={handleStartEditReply}
                            disabled={isSubmitting || isDeleting}
                        >
                            Editar respuesta
                        </button>

                        <button
                            type="button"
                            className="technician-review-card__button technician-review-card__button--danger"
                            onClick={handleDeleteReply}
                            disabled={isSubmitting || isDeleting}
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar respuesta'}
                        </button>
                    </div>
                </div>
            )}

            {!hasReply && hasComment && !isReplying && !isEditingReply && (
                <div className="technician-review-card__reply-actions">
                    <button
                        type="button"
                        className="technician-review-card__button technician-review-card__button--primary"
                        onClick={handleStartReply}
                        disabled={isSubmitting}
                    >
                        Responder
                    </button>
                </div>
            )}

            {(isReplying || isEditingReply) && (
                <TechnicianReviewReplyForm
                    initialValue={isEditingReply ? review.technicianReply || '' : ''}
                    isSubmitting={isSubmitting}
                    mode={isEditingReply ? 'edit' : 'create'}
                    onSubmit={handleSubmitReply}
                    onCancel={handleCancelForm}
                />
            )}
        </article>
    )
}

export default TechnicianReviewCard