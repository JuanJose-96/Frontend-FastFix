function TechnicianJobCard({ job, itemNumber, isDeleting, onEdit, onDelete }) {
    function formatDate(dateValue) {
        if (!dateValue) return 'No disponible'

        const date = new Date(dateValue)

        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    function formatAmount(amount) {
        if (amount === null || amount === undefined || amount === '') {
            return 'No disponible'
        }

        const numericAmount = Number(amount)

        if (Number.isNaN(numericAmount)) {
            return `${amount} €`
        }

        return `${numericAmount.toFixed(2)} €`
    }

    const fullClientName = [job.clientName, job.clientSurname]
        .filter(Boolean)
        .join(' ')
        .trim()

    return (
        <article className="technician-job-card technician-job-card--row">
            <div className="technician-job-card__index">
                {itemNumber}
            </div>

            <div className="technician-job-card__main">
                <div className="technician-job-card__top-row">
                    <div className="technician-job-card__identity">
                        <h3 className="technician-job-card__client-name">
                            {fullClientName || 'Cliente sin nombre'}
                        </h3>

                        <p className="technician-job-card__location">
                            {job.clientCity || 'Ciudad no definida'}, {job.clientProvince || 'Provincia no definida'}
                        </p>
                    </div>

                    <div className="technician-job-card__meta">
                        <div className="technician-job-card__meta-item">
                            <span className="technician-job-card__meta-label">
                                Fecha
                            </span>
                            <span className="technician-job-card__meta-value">
                                {formatDate(job.serviceDate)}
                            </span>
                        </div>

                        <div className="technician-job-card__meta-item">
                            <span className="technician-job-card__meta-label">
                                Importe
                            </span>
                            <span className="technician-job-card__meta-value technician-job-card__meta-value--amount">
                                {formatAmount(job.totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="technician-job-card__bottom-row">
                    <div className="technician-job-card__description-block">
                        <span className="technician-job-card__description-label">
                            Descripción del servicio
                        </span>
                        <p className="technician-job-card__description">
                            {job.serviceDescription || 'Sin descripción'}
                        </p>
                    </div>

                    <div className="technician-job-card__actions technician-job-card__actions--right">
                        <button
                            type="button"
                            className="technician-job-card__button technician-job-card__button--secondary"
                            onClick={() => onEdit(job)}
                            disabled={isDeleting}
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            className="technician-job-card__button technician-job-card__button--danger"
                            onClick={() => onDelete(job.id)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default TechnicianJobCard