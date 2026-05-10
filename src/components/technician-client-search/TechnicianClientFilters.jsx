function TechnicianClientFilters({
    filters,
    provinces,
    cities,
    loadingFilters,
    onFilterChange,
    onClearFilters,
}) {
    return (
        <section className="technician-client-filters">
            <div className="technician-client-filters__grid">
                <div className="technician-client-filters__field">
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Escribe el nombre del cliente"
                        value={filters.name}
                        onChange={onFilterChange}
                        disabled={loadingFilters}
                        className="technician-client-filters__control"
                    />
                </div>

                <div className="technician-client-filters__field">
                    <label htmlFor="province">Provincia</label>
                    <select
                        id="province"
                        name="province"
                        value={filters.province}
                        onChange={onFilterChange}
                        disabled={loadingFilters}
                        className="technician-client-filters__control"
                    >
                        <option value="">Todas las provincias</option>
                        {provinces.map((province) => (
                            <option key={province.code} value={province.label}>
                                {province.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="technician-client-filters__field">
                    <label htmlFor="city">Ciudad</label>
                    <select
                        key={filters.province || 'technician-client-city-empty'}
                        id="city"
                        name="city"
                        value={filters.city}
                        onChange={onFilterChange}
                        disabled={loadingFilters || !filters.province}
                        className="technician-client-filters__control"
                    >
                        <option value="">
                            {!filters.province
                                ? 'Selecciona primero una provincia'
                                : 'Todas las ciudades'}
                        </option>

                        {cities.map((city) => (
                            <option key={`${city.parent_code}-${city.code}`} value={city.label}>
                                {city.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="technician-client-filters__field">
                    <label htmlFor="whatsappAvailability">WhatsApp</label>
                    <select
                        id="whatsappAvailability"
                        name="whatsappAvailability"
                        value={filters.whatsappAvailability}
                        onChange={onFilterChange}
                        disabled={loadingFilters}
                        className="technician-client-filters__control"
                    >
                        <option value="all">Todos</option>
                        <option value="available">Disponible</option>
                        <option value="unavailable">No disponible</option>
                    </select>
                </div>
            </div>

            <div className="technician-client-filters__actions">
                <button
                    type="button"
                    className="technician-client-filters__clear"
                    onClick={onClearFilters}
                >
                    Limpiar filtros
                </button>
            </div>
        </section>
    )
}

export default TechnicianClientFilters