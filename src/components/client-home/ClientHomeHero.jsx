function ClientHomeHero({
    client,
    searchFilters,
    sectors,
    provinces,
    cities,
    loadingSearchBar,
    onSearchFilterChange,
    onQuickSearch,
}) {
    return (
        <section className="client-home-hero">
            <div className="client-home-hero__content">
                <p className="client-home-hero__eyebrow">Tu área de cliente</p>

                <h1 className="client-home-hero__title">
                    Encuentra técnicos de confianza para tu hogar
                </h1>

                <p className="client-home-hero__description">
                    Usa la búsqueda rápida para encontrar profesionales en tu zona o explora
                    con más calma desde la pantalla completa de filtros.
                </p>

                <div className="client-home-hero__quick-search">
                    <div className="client-home-hero__field">
                        <label htmlFor="hero-sectorId">Sector</label>
                        <select
                            id="hero-sectorId"
                            name="sectorId"
                            value={searchFilters.sectorId}
                            onChange={onSearchFilterChange}
                            disabled={loadingSearchBar}
                        >
                            <option value="">Selecciona un sector</option>
                            {sectors.map((sector) => (
                                <option key={sector.id} value={String(sector.id)}>
                                    {sector.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="client-home-hero__field">
                        <label htmlFor="hero-province">Provincia</label>
                        <select
                            id="hero-province"
                            name="province"
                            value={searchFilters.province}
                            onChange={onSearchFilterChange}
                            disabled={loadingSearchBar}
                        >
                            <option value="">Selecciona una provincia</option>
                            {provinces.map((province) => (
                                <option key={province.code} value={province.label}>
                                    {province.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="client-home-hero__field">
                        <label htmlFor="hero-city">Ciudad</label>
                        <select
                            key={searchFilters.province || 'hero-city-empty'}
                            id="hero-city"
                            name="city"
                            value={searchFilters.city}
                            onChange={onSearchFilterChange}
                            disabled={loadingSearchBar || !searchFilters.province}
                        >
                            <option value="">
                                {!searchFilters.province
                                    ? 'Selecciona primero una provincia'
                                    : 'Selecciona una ciudad'}
                            </option>

                            {cities.map((city) => (
                                <option key={`${city.parent_code}-${city.code}`} value={city.label}>
                                    {city.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="client-home-hero__search-action">
                        <button
                            type="button"
                            className="client-home-hero__search-button"
                            onClick={onQuickSearch}
                            disabled={loadingSearchBar}
                        >
                            Buscar
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default ClientHomeHero