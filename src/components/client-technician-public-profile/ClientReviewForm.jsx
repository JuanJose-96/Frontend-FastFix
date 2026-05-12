import { useState } from 'react'

function ClientReviewForm({
    title,
    submitLabel,
    isSubmitting,
    formData,
    formError,
    onFieldChange,
    onSubmit,
}) {
    const [hoveredRating, setHoveredRating] = useState(0)

    function handleStarClick(starValue) {
        onFieldChange('rating', starValue)
    }

    const visibleRating = hoveredRating || Number(formData.rating || 0)

    return (
        <section className="client-review-form-card">
            <div className="client-review-form-card__header">
                <h3 className="client-review-form-card__title">{title}</h3>
                <p className="client-review-form-card__subtitle">
                    Puedes dejar solo estrellas o añadir también un comentario.
                </p>
            </div>

            <div
                className="client-review-form-card__stars"
                onMouseLeave={() => setHoveredRating(0)}
            >
                {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                        key={starValue}
                        type="button"
                        className={`client-review-form-card__star ${starValue <= visibleRating
                                ? 'client-review-form-card__star--active'
                                : ''
                            }`}
                        onMouseEnter={() => setHoveredRating(starValue)}
                        onClick={() => handleStarClick(starValue)}
                        aria-label={`${starValue} estrellas`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <div className="client-review-form-card__comment-block">
                <label
                    htmlFor="client-review-comment"
                    className="client-review-form-card__label"
                >
                    Comentario
                </label>

                <textarea
                    id="client-review-comment"
                    className="client-review-form-card__textarea"
                    rows="4"
                    value={formData.comment}
                    onChange={(event) => onFieldChange('comment', event.target.value)}
                    placeholder="Escribe tu experiencia con este técnico (opcional)"
                />
            </div>

            {formError && (
                <p className="client-review-form-card__error">{formError}</p>
            )}

            <div className="client-review-form-card__actions">
                <button
                    type="button"
                    className="client-review-form-card__submit"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : submitLabel}
                </button>
            </div>
        </section>
    )
}

export default ClientReviewForm