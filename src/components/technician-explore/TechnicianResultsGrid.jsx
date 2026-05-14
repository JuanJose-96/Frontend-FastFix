import ClientTechnicianCard from '../client-technicians/ClientTechnicianCard'
import '../../styles/client-technician-section.css'

function TechnicianResultsGrid({ technicians, totalElements, highlightEmergencyOnly }) {
    return (
        <section className="client-technician-section">
            <div className="client-technician-section__header">
                <h2 className="client-technician-section__title">Resultados</h2>
                <p className="client-technician-section__description">
                    {totalElements} técnico{totalElements === 1 ? '' : 's'} encontrado
                    {totalElements === 1 ? '' : 's'}
                </p>
            </div>

            <div className="client-technician-section__grid">
                {technicians.map((technician) => (
                    <ClientTechnicianCard
                        key={technician.id}
                        technician={technician}
                        isVisuallyMuted={
                            highlightEmergencyOnly && !technician.emergencyAvailability
                        }
                    />
                ))}
            </div>
        </section>
    )
}

export default TechnicianResultsGrid