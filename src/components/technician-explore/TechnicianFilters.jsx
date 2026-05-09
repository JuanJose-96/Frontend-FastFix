function TechnicianFilters({
    filters,
    sectors,
    provinces,
    cities,
    loadingFilters,
    onFilterChange,
    onClearFilters,
}) {
    return (
        <section className="technician-filters">
            <div className="technician-filters__grid">
                <div className="technician-filters__field">
                    <label htmlFor="sectorId">Sector</label>
                    <select
                        id="sectorId"
                        name="sectorId"
                        value={filters.sectorId}
                        onChange={onFilterChange}
                        disabled={loadingFilters}
                    >
                        <option value="">Todos los sectores</option>

                        {sectors.map((sector) => (
                            <option key={sector.id} value={String(sector.id)}>
                                {sector.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="technician-filters__field">
                    <label htmlFor="province">Provincia</label>
                    <select
                        id="province"
                        name="province"
                        value={filters.province}
                        onChange={onFilterChange}
                        disabled={loadingFilters}
                    >
                        <option value="">Todas las provincias</option>

                        {provinces.map((province) => (
                            <option key={province.code} value={province.label}>
                                {province.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="technician-filters__field">
                    <label htmlFor="city">Ciudad</label>
                    <select
                        key={filters.province || 'city-empty'}
                        id="city"
                        name="city"
                        value={filters.city}
                        onChange={onFilterChange}
                        disabled={loadingFilters || !filters.province}
                    >
                        <option value="">
                            {!filters.province ? 'Selecciona primero una provincia' : 'Todas las ciudades'}
                        </option>

                        {cities.map((city) => (
                            <option key={`${city.parent_code}-${city.code}`} value={city.label}>
                                {city.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="technician-filters__field">
                    <label htmlFor="rating">Valoración mínima</label>
                    <select
                        id="rating"
                        name="rating"
                        value={filters.rating}
                        onChange={onFilterChange}
                        disabled={loadingFilters}
                    >
                        <option value="">Cualquier valoración</option>
                        <option value="4.5">4.5 o más</option>
                        <option value="4.0">4.0 o más</option>
                        <option value="3.5">3.5 o más</option>
                        <option value="3.0">3.0 o más</option>
                    </select>
                </div>
            </div>

            <div className="technician-filters__actions">
                <button
                    type="button"
                    className="technician-filters__clear"
                    onClick={onClearFilters}
                >
                    Limpiar filtros
                </button>
            </div>
        </section>
    )
}

export default TechnicianFilters