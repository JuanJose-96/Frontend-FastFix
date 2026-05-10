import TechnicianClientCard from './TechnicianClientCard'

function TechnicianClientResultsGrid({ clients }) {
    return (
        <section className="technician-client-results">
            <div className="technician-client-results__header">
                <h2 className="technician-client-results__title">Resultados</h2>
                <p className="technician-client-results__count">
                    {clients.length} cliente{clients.length === 1 ? '' : 's'} encontrado
                    {clients.length === 1 ? '' : 's'}
                </p>
            </div>

            <div className="technician-client-results__grid">
                {clients.map((client) => (
                    <TechnicianClientCard key={client.id} client={client} />
                ))}
            </div>
        </section>
    )
}

export default TechnicianClientResultsGrid