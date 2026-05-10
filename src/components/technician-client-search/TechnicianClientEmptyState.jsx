function TechnicianClientEmptyState({ onClearFilters }) {
    return (
        <section className="technician-client-empty-state">
            <h2 className="technician-client-empty-state__title">
                No hemos encontrado clientes
            </h2>

            <p className="technician-client-empty-state__description">
                Prueba a cambiar el nombre, la provincia, la ciudad o el filtro de WhatsApp.
            </p>

            <button
                type="button"
                className="technician-client-empty-state__button"
                onClick={onClearFilters}
            >
                Limpiar filtros
            </button>
        </section>
    )
}

export default TechnicianClientEmptyState