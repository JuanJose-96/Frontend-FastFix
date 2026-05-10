function TechnicianPublicPreviewCard({ technician }) {
    const fullName = `${technician.name || ''} ${technician.surname || ''}`.trim()
    const sectorName =
        technician.sector?.name || technician.sectorName || technician.sector || 'Sector no definido'
    const averageRating = Number(technician.averageRating || 0)

    function getInitials() {
        const firstInitial = technician.name?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = technician.surname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'T'
    }

    return (
        <section className="technician-panel-card">
            <div className="technician-panel-card__header">
                <h2 className="technician-panel-card__title">Así te ven los clientes</h2>
            </div>

            <article className="technician-public-preview">
                <div className="technician-public-preview__avatar">
                    {technician.profileImageUrl ? (
                        <img
                            src={technician.profileImageUrl}
                            alt={`Foto de perfil de ${fullName}`}
                            className="technician-public-preview__avatar-image"
                        />
                    ) : (
                        <span className="technician-public-preview__avatar-initials">
                            {getInitials()}
                        </span>
                    )}
                </div>

                <div className="technician-public-preview__body">
                    <h3 className="technician-public-preview__name">{fullName || 'Técnico'}</h3>

                    <p className="technician-public-preview__sector">{sectorName}</p>

                    <p className="technician-public-preview__location">
                        {technician.city || 'Ciudad no definida'}, {technician.province || 'Provincia no definida'}
                    </p>

                    <div className="technician-public-preview__badges">
                        <span className="technician-public-preview__rating">
                            ★ {averageRating.toFixed(1)}
                        </span>

                        {technician.emergencyAvailability && (
                            <span className="technician-public-preview__badge">Urgencias</span>
                        )}

                        {technician.whatsappAvailable && (
                            <span className="technician-public-preview__badge">WhatsApp</span>
                        )}
                    </div>
                </div>
            </article>
        </section>
    )
}

export default TechnicianPublicPreviewCard