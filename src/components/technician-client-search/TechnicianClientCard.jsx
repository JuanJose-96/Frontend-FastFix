function TechnicianClientCard({ client }) {
    const fullName = `${client.name || ''} ${client.surname || ''}`.trim()

    function getInitials() {
        const firstInitial = client.name?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = client.surname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'C'
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
        if (!client.whatsappAvailable || !client.phone) return

        const normalizedPhone = normalizeSpanishPhone(client.phone)
        const message = `Hola ${fullName || ''}, te contacto desde FastFix.`
        const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }

    return (
        <article className="technician-client-card">
            <div className="technician-client-card__avatar">
                {client.profileImageUrl ? (
                    <img
                        src={client.profileImageUrl}
                        alt={`Foto de perfil de ${fullName}`}
                        className="technician-client-card__avatar-image"
                    />
                ) : (
                    <span className="technician-client-card__avatar-initials">
                        {getInitials()}
                    </span>
                )}
            </div>

            <div className="technician-client-card__body">
                <h3 className="technician-client-card__name">{fullName || 'Cliente'}</h3>

                <p className="technician-client-card__location">
                    {client.city || 'Ciudad no definida'}, {client.province || 'Provincia no definida'}
                </p>
            </div>

            <div className="technician-client-card__footer">
                <button
                    type="button"
                    className={`technician-client-card__whatsapp ${client.whatsappAvailable
                            ? 'technician-client-card__whatsapp--available'
                            : 'technician-client-card__whatsapp--unavailable'
                        }`}
                    onClick={handleOpenWhatsApp}
                    disabled={!client.whatsappAvailable || !client.phone}
                    title={
                        client.whatsappAvailable
                            ? 'Abrir conversación de WhatsApp'
                            : 'No disponible por WhatsApp'
                    }
                >
                    <img
                        src="/images/whatsapp-icon.png"
                        alt="WhatsApp"
                        className="technician-client-card__whatsapp-image"
                    />
                    <span className="technician-client-card__whatsapp-text">
                        {client.whatsappAvailable ? 'Disponible' : 'No disponible'}
                    </span>
                </button>
            </div>
        </article>
    )
}

export default TechnicianClientCard