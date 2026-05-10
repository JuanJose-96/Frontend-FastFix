function TechnicianJobsToolbar({
    totalJobs,
    isCreating,
    isEditing,
    onStartCreate,
    onCancelForm,
}) {
    return (
        <section className="technician-jobs-toolbar">
            <div>
                <h2 className="technician-jobs-toolbar__title">Listado de trabajos</h2>
                <p className="technician-jobs-toolbar__subtitle">
                    {totalJobs} trabajo{totalJobs === 1 ? '' : 's'} registrado
                    {totalJobs === 1 ? '' : 's'}
                </p>
            </div>

            {!isCreating && !isEditing ? (
                <button
                    type="button"
                    className="technician-jobs-toolbar__primary-button"
                    onClick={onStartCreate}
                >
                    Añadir trabajo
                </button>
            ) : (
                <button
                    type="button"
                    className="technician-jobs-toolbar__secondary-button"
                    onClick={onCancelForm}
                >
                    Cancelar
                </button>
            )}
        </section>
    )
}

export default TechnicianJobsToolbar