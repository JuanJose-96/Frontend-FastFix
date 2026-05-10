function TechnicianJobsEmptyState({ onCreate }) {
    return (
        <section className="technician-jobs-empty-state">
            <h2 className="technician-jobs-empty-state__title">
                Todavía no tienes trabajos registrados
            </h2>

            <p className="technician-jobs-empty-state__description">
                Añade tu primer trabajo para empezar a organizar los servicios realizados con
                tus clientes.
            </p>

            <button
                type="button"
                className="technician-jobs-empty-state__button"
                onClick={onCreate}
            >
                Añadir trabajo
            </button>
        </section>
    )
}

export default TechnicianJobsEmptyState