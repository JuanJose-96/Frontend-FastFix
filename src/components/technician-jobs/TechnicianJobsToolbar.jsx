function TechnicianJobsToolbar({
    totalJobs,
    isCreating,
    isEditing,
    onStartCreate,
    onCancelForm,
}) {
    return (
        <section className="technician-jobs-toolbar">
            <div className="technician-jobs-toolbar__summary">
                <span className="technician-jobs-toolbar__summary-label">
                    Total de trabajos
                </span>
                <span className="technician-jobs-toolbar__summary-value">
                    {totalJobs}
                </span>
            </div>

            <div className="technician-jobs-toolbar__actions">
                {!isCreating && !isEditing && (
                    <button
                        type="button"
                        className="technician-jobs-toolbar__button technician-jobs-toolbar__button--primary"
                        onClick={onStartCreate}
                    >
                        Añadir trabajo
                    </button>
                )}

                {(isCreating || isEditing) && (
                    <button
                        type="button"
                        className="technician-jobs-toolbar__button technician-jobs-toolbar__button--secondary"
                        onClick={onCancelForm}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </section>
    )
}

export default TechnicianJobsToolbar