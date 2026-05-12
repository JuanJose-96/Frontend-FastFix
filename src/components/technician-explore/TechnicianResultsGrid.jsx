import ClientTechnicianCard from '../client-technicians/ClientTechnicianCard'
import '../../styles/client-technician-section.css'

function TechnicianResultsGrid({ technicians }) {
    return (
        <section className="client-technician-section">
            <div className="client-technician-section__header">
                <h2 className="client-technician-section__title">Resultados</h2>
                <p className="client-technician-section__description">
                    {technicians.length} técnico{technicians.length === 1 ? '' : 's'} encontrado
                    {technicians.length === 1 ? '' : 's'}
                </p>
            </div>

            <div className="client-technician-section__grid">
                {technicians.map((technician) => (
                    <ClientTechnicianCard
                        key={technician.id}
                        technician={technician}
                    />
                ))}
            </div>
        </section>
    )
}

export default TechnicianResultsGrid