function SectorSection({ sectors }) {
    return (
        <section className="sector-section">
            <div className="sector-section__header">
                <h2 className="sector-section__title">Explora por sector</h2>
                <p className="sector-section__description">
                    Accesos rápidos para encontrar el tipo de profesional que necesitas.
                </p>
            </div>

            <div className="sector-section__grid">
                {sectors.map((sector) => (
                    <button key={sector.id} type="button" className="sector-card" disabled>
                        {sector.name}
                    </button>
                ))}
            </div>
        </section>
    )
}

export default SectorSection