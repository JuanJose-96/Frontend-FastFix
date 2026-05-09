function TechnicianCard({ technician }) {
    const fullName = `${technician.name} ${technician.surname}`

    const sectorLabel =
        technician.sector?.name ||
        technician.sectorName ||
        technician.sector ||
        'Sector no disponible'

    return (
        <article className="technician-card">
            <div className="technician-card__avatar technician-card__avatar--large">
                {technician.profileImageUrl ? (
                    <img src={technician.profileImageUrl} alt={fullName} />
                ) : (
                    <span>
                        {technician.name?.charAt(0)}
                        {technician.surname?.charAt(0)}
                    </span>
                )}
            </div>

            <div className="technician-card__body technician-card__body--centered">
                <h3 className="technician-card__name">{fullName}</h3>

                <p className="technician-card__sector">{sectorLabel}</p>

                <p className="technician-card__location">
                    {technician.city}, {technician.province}
                </p>

                <div className="technician-card__footer technician-card__footer--centered">
                    <span className="technician-card__rating">
                        ⭐ {technician.averageRating?.toFixed(1) ?? '0.0'}
                    </span>

                    {technician.emergencyAvailability && (
                        <span className="technician-card__badge">Urgencias</span>
                    )}
                </div>
            </div>
        </article>
    )
}

export default TechnicianCard