import '../../styles/client-technician-card.css'

function ClientTechnicianCard({ technician, reviewMeta }) {
    const fullName = `${technician.name || ''} ${technician.surname || ''}`.trim()
    const sectorName =
        technician.sectorName || technician.sector?.name || 'Sector no definido'

    function getInitials() {
        const firstInitial = technician.name?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial =
            technician.surname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'T'
    }

    function normalizeSpanishPhone(phone) {
        if (!phone) return ''

        const digitsOnly = String(phone).replace(/\D/g, '')

        if (digitsOnly.startsWith('34')) {
            return digitsOnly
        }

        return `34${digitsOnly}`
    }

    function handleOpenWhatsApp() {
        if (!technician.whatsappAvailable || !technician.phone) return

        const normalizedPhone = normalizeSpanishPhone(technician.phone)
        const message = `Hola ${fullName}, te contacto desde FastFix.`
        const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }

    return (
        <article className="client-technician-card">
            <div className="client-technician-card__avatar">
                {technician.profileImageUrl ? (
                    <img
                        src={technician.profileImageUrl}
                        alt={`Foto de perfil de ${fullName}`}
                        className="client-technician-card__avatar-image"
                    />
                ) : (
                    <span className="client-technician-card__avatar-initials">
                        {getInitials()}
                    </span>
                )}
            </div>

            <div className="client-technician-card__body">
                <h3 className="client-technician-card__name">{fullName || 'Técnico'}</h3>

                <p className="client-technician-card__sector">{sectorName}</p>

                <p className="client-technician-card__location">
                    {technician.city || 'Ciudad no definida'}, {technician.province || 'Provincia no definida'}
                </p>

                <div className="client-technician-card__badges">
                    <span className="client-technician-card__rating">
                        ★ {Number(technician.averageRating || 0).toFixed(1)}
                    </span>

                    {technician.emergencyAvailability && (
                        <span className="client-technician-card__badge">Urgencias</span>
                    )}
                </div>

                {reviewMeta && (
                    <div className="client-technician-card__review-meta">
                        <span className="client-technician-card__review-label">Tu reseña</span>
                        <span className="client-technician-card__review-value">
                            {'★'.repeat(Number(reviewMeta.rating || 0))}
                        </span>
                        {reviewMeta.comment?.trim() && (
                            <p className="client-technician-card__review-comment">
                                {reviewMeta.comment}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="client-technician-card__footer">
                <button
                    type="button"
                    className={`client-technician-card__whatsapp ${technician.whatsappAvailable
                            ? 'client-technician-card__whatsapp--available'
                            : 'client-technician-card__whatsapp--unavailable'
                        }`}
                    onClick={handleOpenWhatsApp}
                    disabled={!technician.whatsappAvailable || !technician.phone}
                    title={
                        technician.whatsappAvailable
                            ? 'Abrir conversación de WhatsApp'
                            : 'No disponible por WhatsApp'
                    }
                >
                    <img
                        src="/images/whatsapp-icon.png"
                        alt="WhatsApp"
                        className="client-technician-card__whatsapp-image"
                    />
                    <span className="client-technician-card__whatsapp-text">
                        {technician.whatsappAvailable ? 'Disponible' : 'No disponible'}
                    </span>
                </button>
            </div>
        </article>
    )
}

export default ClientTechnicianCard