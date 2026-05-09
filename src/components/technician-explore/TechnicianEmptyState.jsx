function TechnicianEmptyState({ onClearFilters }) {
    return (
        <section className="technician-empty-state">
            <h2 className="technician-empty-state__title">
                No hemos encontrado técnicos con esos filtros
            </h2>

            <p className="technician-empty-state__description">
                Prueba a cambiar la provincia, la ciudad, el sector o la valoración mínima.
            </p>

            <button
                type="button"
                className="technician-empty-state__button"
                onClick={onClearFilters}
            >
                Limpiar filtros
            </button>
        </section>
    )
}

export default TechnicianEmptyState