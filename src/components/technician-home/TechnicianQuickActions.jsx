function TechnicianQuickActions() {
    return (
        <section className="technician-panel-card">
            <div className="technician-panel-card__header">
                <h2 className="technician-panel-card__title">Acciones rápidas</h2>
            </div>

            <div className="technician-quick-actions">
                <button type="button" className="technician-quick-actions__button" disabled>
                    Editar perfil
                </button>

                <button type="button" className="technician-quick-actions__button" disabled>
                    Buscar clientes
                </button>

                <button type="button" className="technician-quick-actions__button" disabled>
                    Ver reseñas
                </button>

                <button type="button" className="technician-quick-actions__button" disabled>
                    Ver perfil público
                </button>
            </div>
        </section>
    )
}

export default TechnicianQuickActions