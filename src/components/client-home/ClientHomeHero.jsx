function ClientHomeHero({ client }) {
    return (
        <section className="client-home-hero">
            <div className="client-home-hero__content">
                <p className="client-home-hero__eyebrow">Tu área de cliente</p>

                <h1 className="client-home-hero__title">
                    Encuentra técnicos de confianza para tu hogar
                </h1>

                <p className="client-home-hero__description">
                    Busca por sector, provincia, ciudad o valoración. Te mostramos opciones
                    cercanas y perfiles mejor valorados para que encuentres ayuda rápida.
                </p>

                <div className="client-home-hero__search">
                    <input
                        type="text"
                        placeholder="Buscar técnicos, sectores o servicios..."
                        disabled
                    />
                    <button type="button" disabled>
                        Buscar
                    </button>
                </div>

                <div className="client-home-hero__meta">
                    <span>Provincia: {client?.province || 'No disponible'}</span>
                    <span>Ciudad: {client?.city || 'No disponible'}</span>
                </div>
            </div>
        </section>
    )
}

export default ClientHomeHero