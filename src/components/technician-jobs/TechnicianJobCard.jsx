function TechnicianJobCard({ job, onEdit, onDelete }) {
    function formatDate(dateValue) {
        if (!dateValue) return 'No definida'

        const [year, month, day] = dateValue.split('-')
        if (!year || !month || !day) return dateValue

        return `${day}/${month}/${year}`
    }

    return (
        <article className="technician-job-card">
            <div className="technician-job-card__header">
                <div>
                    <h3 className="technician-job-card__client-name">{job.clientName}</h3>
                    <p className="technician-job-card__location">
                        {job.city}, {job.province}
                    </p>
                </div>

                <span className="technician-job-card__price">{job.totalPrice}</span>
            </div>

            <div className="technician-job-card__dates">
                <div className="technician-job-card__date-item">
                    <span className="technician-job-card__date-label">Inicio</span>
                    <span className="technician-job-card__date-value">
                        {formatDate(job.startDate)}
                    </span>
                </div>

                <div className="technician-job-card__date-item">
                    <span className="technician-job-card__date-label">Fin</span>
                    <span className="technician-job-card__date-value">
                        {formatDate(job.endDate)}
                    </span>
                </div>
            </div>

            <div className="technician-job-card__description-block">
                <span className="technician-job-card__description-label">Servicio</span>
                <p className="technician-job-card__description">
                    {job.serviceDescription || 'Sin descripción añadida.'}
                </p>
            </div>

            <div className="technician-job-card__actions">
                <button
                    type="button"
                    className="technician-job-card__button technician-job-card__button--secondary"
                    onClick={() => onEdit(job)}
                >
                    Editar
                </button>

                <button
                    type="button"
                    className="technician-job-card__button technician-job-card__button--danger"
                    onClick={() => onDelete(job.id)}
                >
                    Eliminar
                </button>
            </div>
        </article>
    )
}

export default TechnicianJobCard