import TechnicianCard from '../client-home/TechnicianCard'

function TechnicianResultsGrid({ technicians }) {
    return (
        <section className="technician-results">
            <div className="technician-results__header">
                <h2 className="technician-results__title">Resultados</h2>
                <p className="technician-results__count">
                    {technicians.length} técnico{technicians.length === 1 ? '' : 's'} encontrado
                    {technicians.length === 1 ? '' : 's'}
                </p>
            </div>

            <div className="technician-results__grid">
                {technicians.map((technician) => (
                    <TechnicianCard
                        key={technician.id ?? `${technician.email}-${technician.name}`}
                        technician={technician}
                    />
                ))}
            </div>
        </section>
    )
}

export default TechnicianResultsGrid