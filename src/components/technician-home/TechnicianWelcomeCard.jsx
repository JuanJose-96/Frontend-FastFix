function TechnicianWelcomeCard({ technician }) {
    const fullName = `${technician.name || ''} ${technician.surname || ''}`.trim()
    const sectorName =
        technician.sector?.name || technician.sectorName || technician.sector || 'Sector no definido'

    return (
        <section className="technician-welcome-card">
            <div className="technician-welcome-card__content">
                <p className="technician-welcome-card__eyebrow">Área profesional</p>

                <h1 className="technician-welcome-card__title">
                    Bienvenido, {fullName || 'técnico'}
                </h1>

                <p className="technician-welcome-card__description">
                    Aquí puedes revisar cómo está configurado tu perfil profesional y acceder
                    rápidamente a las funciones principales.
                </p>

                <div className="technician-welcome-card__meta">
                    <span>{sectorName}</span>
                    <span>
                        {technician.city || 'Ciudad no definida'}, {technician.province || 'Provincia no definida'}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default TechnicianWelcomeCard