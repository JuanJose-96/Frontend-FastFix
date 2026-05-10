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
    function getFieldClassName(fieldName) {
        return fieldErrors[fieldName] ? 'technician-jobs-form__control--error' : ''
    }

    return (
        <section className="technician-jobs-form-card">
            <div className="technician-jobs-form-card__header">
                <h2 className="technician-jobs-form-card__title">
                    {isEditing ? 'Editar trabajo' : 'Nuevo trabajo'}
                </h2>

                <p className="technician-jobs-form-card__subtitle">
                    Completa la información del servicio realizado.
                </p>
            </div>

            <form className="technician-jobs-form" onSubmit={onSubmit} noValidate>
                <div className="technician-jobs-form__field">
                    <label htmlFor="clientName">Nombre y apellidos del cliente</label>
                    <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        value={formData.clientName}
                        onChange={onFieldChange}
                        className={`technician-jobs-form__control ${getFieldClassName('clientName')}`}
                        placeholder="Introduce el nombre completo del cliente"
                    />
                    {fieldErrors.clientName && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.clientName}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="province">Provincia</label>
                    <select
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={onFieldChange}
                        className={`technician-jobs-form__control ${getFieldClassName('province')}`}
                    >
                        <option value="">Selecciona una provincia</option>
                        {provinces.map((province) => (
                            <option key={province.code} value={province.label}>
                                {province.label}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.province && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.province}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="city">Ciudad</label>
                    <select
                        key={formData.province || 'technician-jobs-city-empty'}
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={onFieldChange}
                        disabled={!formData.province}
                        className={`technician-jobs-form__control ${getFieldClassName('city')}`}
                    >
                        <option value="">
                            {!formData.province
                                ? 'Selecciona primero una provincia'
                                : 'Selecciona una ciudad'}
                        </option>
                        {cities.map((city) => (
                            <option key={`${city.parent_code}-${city.code}`} value={city.label}>
                                {city.label}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.city && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.city}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="startDate">Fecha de inicio</label>
                    <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={onFieldChange}
                        className={`technician-jobs-form__control ${getFieldClassName('startDate')}`}
                    />
                    {fieldErrors.startDate && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.startDate}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="endDate">Fecha de fin</label>
                    <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={onFieldChange}
                        className={`technician-jobs-form__control ${getFieldClassName('endDate')}`}
                    />
                    {fieldErrors.endDate && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.endDate}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field">
                    <label htmlFor="totalPrice">Precio total</label>
                    <input
                        id="totalPrice"
                        name="totalPrice"
                        type="text"
                        value={formData.totalPrice}
                        onChange={onFieldChange}
                        className={`technician-jobs-form__control ${getFieldClassName('totalPrice')}`}
                        placeholder="Ej. 120 €"
                    />
                    {fieldErrors.totalPrice && (
                        <span className="technician-jobs-form__error-text">
                            {fieldErrors.totalPrice}
                        </span>
                    )}
                </div>

                <div className="technician-jobs-form__field technician-jobs-form__field--full">
                    <label htmlFor="serviceDescription">Descripción breve del servicio</label>
                    <textarea
                        id="serviceDescription"
                        name="serviceDescription"
                        rows="4"
                        value={formData.serviceDescription}
                        onChange={onFieldChange}
                        className="technician-jobs-form__control technician-jobs-form__textarea"
                        placeholder="Describe brevemente el trabajo realizado"
                    />
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
                                : 'Guardando...'
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