function TechnicianJobsForm({
    formData,
    fieldErrors,
    provinces,
    cities,
    isSubmitting,
    isEditing,
    onFieldChange,
    onSubmit,
}) {
    return (
        <section className="technician-jobs-form-card">
            <div className="technician-jobs-form-card__header">
                <h2 className="technician-jobs-form-card__title">
                    {isEditing ? 'Editar trabajo' : 'Nuevo trabajo'}
                </h2>
                <p className="technician-jobs-form-card__subtitle">
                    Guarda un servicio realizado con los datos del cliente y del trabajo.
                </p>
            </div>

            <form className="technician-jobs-form" onSubmit={onSubmit}>
                <div className="technician-jobs-form__field">
                    <label htmlFor="clientName">Nombre del cliente</label>
                    <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        className={`technician-jobs-form__control ${fieldErrors.clientName
                                ? 'technician-jobs-form__control--error'
                                : ''
                            }`}
                        value={formData.clientName}
                        onChange={onFieldChange}
                    />
                    {fieldErrors.clientName && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.clientName}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="clientSurname">Apellidos del cliente</label>
                    <input
                        id="clientSurname"
                        name="clientSurname"
                        type="text"
                        className="technician-jobs-form__control"
                        value={formData.clientSurname}
                        onChange={onFieldChange}
                    />
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="clientProvince">Provincia</label>
                    <select
                        id="clientProvince"
                        name="clientProvince"
                        className={`technician-jobs-form__control ${fieldErrors.clientProvince
                                ? 'technician-jobs-form__control--error'
                                : ''
                            }`}
                        value={formData.clientProvince}
                        onChange={onFieldChange}
                    >
                        <option value="">Selecciona una provincia</option>
                        {provinces.map((province) => (
                            <option
                                key={`${province.code}-${province.label}`}
                                value={province.label}
                            >
                                {province.label}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.clientProvince && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.clientProvince}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="clientCity">Ciudad</label>
                    <select
                        id="clientCity"
                        name="clientCity"
                        className={`technician-jobs-form__control ${fieldErrors.clientCity
                                ? 'technician-jobs-form__control--error'
                                : ''
                            }`}
                        value={formData.clientCity}
                        onChange={onFieldChange}
                        disabled={!formData.clientProvince}
                    >
                        <option value="">
                            {!formData.clientProvince
                                ? 'Selecciona primero una provincia'
                                : 'Selecciona una ciudad'}
                        </option>

                        {cities.map((city, index) => (
                            <option
                                key={`${city.parent_code}-${city.code}-${city.label}-${index}`}
                                value={city.label}
                            >
                                {city.label}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.clientCity && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.clientCity}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="serviceDate">Fecha del servicio</label>
                    <input
                        id="serviceDate"
                        name="serviceDate"
                        type="date"
                        className={`technician-jobs-form__control ${fieldErrors.serviceDate
                                ? 'technician-jobs-form__control--error'
                                : ''
                            }`}
                        value={formData.serviceDate}
                        onChange={onFieldChange}
                    />
                    {fieldErrors.serviceDate && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.serviceDate}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="totalAmount">Importe total</label>
                    <input
                        id="totalAmount"
                        name="totalAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        className={`technician-jobs-form__control ${fieldErrors.totalAmount
                                ? 'technician-jobs-form__control--error'
                                : ''
                            }`}
                        value={formData.totalAmount}
                        onChange={onFieldChange}
                        placeholder="Ejemplo: 85.50"
                    />
                    {fieldErrors.totalAmount && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.totalAmount}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field technician-jobs-form__field--full">
                    <label htmlFor="serviceDescription">Descripción del servicio</label>
                    <textarea
                        id="serviceDescription"
                        name="serviceDescription"
                        rows="4"
                        className={`technician-jobs-form__control technician-jobs-form__textarea ${fieldErrors.serviceDescription
                                ? 'technician-jobs-form__control--error'
                                : ''
                            }`}
                        value={formData.serviceDescription}
                        onChange={onFieldChange}
                        placeholder="Ejemplo: Sustitución de enchufes y revisión del cuadro eléctrico."
                    />
                    {fieldErrors.serviceDescription && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.serviceDescription}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__actions">
                    <button
                        type="submit"
                        className="technician-jobs-form__submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? isEditing
                                ? 'Guardando cambios...'
                                : 'Guardando trabajo...'
                            : isEditing
                                ? 'Guardar cambios'
                                : 'Guardar trabajo'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default TechnicianJobsForm