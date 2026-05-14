function SectorsSection() {
    const sectors = [
        'Electricidad',
        'Fontanería',
        'Carpintería',
        'Pintura',
        'Cerrajería',
        'Climatización',
        'Albañileria',
        'Limpieza',
    ]

    return (
        <section id="sectors" className="landing-section">
            <div className="landing-section__inner">
                <h2 className="landing-section__title">Tipos de sectores</h2>

                <div className="sectors-grid">
                    {sectors.map((sector) => (
                        <div key={sector} className="sector-card">
                            {sector}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SectorsSection