function Toast({ message, type = 'error', onClose }) {
    if (!message) return null

    return (
        <div className={`toast toast--${type}`} role="alert" aria-live="assertive">
            <span className="toast__message">{message}</span>

            <button
                type="button"
                className="toast__close"
                onClick={onClose}
                aria-label="Cerrar notificación"
            >
                ×
            </button>
        </div>
    )
}

export default Toast
