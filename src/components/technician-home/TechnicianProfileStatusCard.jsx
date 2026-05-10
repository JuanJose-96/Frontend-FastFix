function TechnicianProfileStatusCard({ technician }) {
    const aboutMeText = technician.aboutMe?.trim()
        ? technician.aboutMe
        : 'Todavía no has añadido una descripción profesional.'

    const priceText = technician.priceDescription?.trim()
        ? technician.priceDescription
        : 'Todavía no has añadido una referencia de precios.'

    const scheduleText = technician.scheduleAvailability?.trim()
        ? technician.scheduleAvailability
        : 'Todavía no has indicado tu disponibilidad horaria.'

    return (
        <section className="technician-panel-card">
            <div className="technician-panel-card__header">
                <h2 className="technician-panel-card__title">Estado de tu perfil</h2>
            </div>

            <div className="technician-status-grid">
                <div className="technician-status-item">
                    <span className="technician-status-item__label">Urgencias</span>
                    <span className="technician-status-item__value">
                        {technician.emergencyAvailability ? 'Activadas' : 'Desactivadas'}
                    </span>
                </div>

                <div className="technician-status-item">
                    <span className="technician-status-item__label">WhatsApp</span>
                    <span className="technician-status-item__value">
                        {technician.whatsappAvailable ? 'Disponible' : 'No disponible'}
                    </span>
                </div>

                <div className="technician-status-item technician-status-item--full">
                    <span className="technician-status-item__label">Disponibilidad horaria</span>
                    <span className="technician-status-item__value">{scheduleText}</span>
                </div>

                <div className="technician-status-item technician-status-item--full">
                    <span className="technician-status-item__label">Precios</span>
                    <span className="technician-status-item__value">{priceText}</span>
                </div>

                <div className="technician-status-item technician-status-item--full">
                    <span className="technician-status-item__label">Sobre mí</span>
                    <span className="technician-status-item__value">{aboutMeText}</span>
                </div>
            </div>
        </section>
    )
}

export default TechnicianProfileStatusCard