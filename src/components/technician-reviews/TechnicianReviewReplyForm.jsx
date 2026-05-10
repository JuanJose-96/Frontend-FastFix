import { useEffect, useState } from 'react'

function TechnicianReviewReplyForm({
    initialValue = '',
    isSubmitting,
    mode,
    onSubmit,
    onCancel,
}) {
    const [replyText, setReplyText] = useState(initialValue)
    const [error, setError] = useState('')

    useEffect(() => {
        setReplyText(initialValue)
    }, [initialValue])

    function handleSubmit(event) {
        event.preventDefault()

        const trimmedReply = replyText.trim()

        if (!trimmedReply) {
            setError('Debes escribir una respuesta')
            return
        }

        setError('')
        onSubmit(trimmedReply)
    }

    function handleChange(event) {
        setReplyText(event.target.value)

        if (error) {
            setError('')
        }
    }

    return (
        <form className="technician-review-reply-form" onSubmit={handleSubmit}>
            <textarea
                value={replyText}
                onChange={handleChange}
                rows="4"
                className={`technician-review-reply-form__textarea ${error ? 'technician-review-reply-form__textarea--error' : ''
                    }`}
                placeholder="Escribe tu respuesta como profesional"
            />

            {error && (
                <span className="technician-review-reply-form__error">{error}</span>
            )}

            <div className="technician-review-reply-form__actions">
                <button
                    type="button"
                    className="technician-review-reply-form__cancel"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    className="technician-review-reply-form__submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? mode === 'edit'
                            ? 'Guardando...'
                            : 'Respondiendo...'
                        : mode === 'edit'
                            ? 'Guardar cambios'
                            : 'Responder'}
                </button>
            </div>
        </form>
    )
}

export default TechnicianReviewReplyForm