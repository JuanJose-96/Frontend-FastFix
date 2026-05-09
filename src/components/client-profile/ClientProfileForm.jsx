function ClientProfileForm({
    isEditing,
    profileData,
    editForm,
    provinces,
    cities,
    fieldErrors,
    savingProfile,
    onFieldChange,
    onStartEditing,
    onCancelEditing,
    onSaveProfile,
}) {
    const currentValues = isEditing ? editForm : profileData

    function getFieldClassName(fieldName) {
        return fieldErrors[fieldName] ? 'client-profile-form__control--error' : ''
    }

    return (
        <section className="client-profile-form-card">
            <div className="client-profile-form-card__header">
                <div>
                    <h2 className="client-profile-form-card__title">Mi perfil</h2>
                    <p className="client-profile-form-card__subtitle">
                        Consulta tus datos o edita la información que quieras mantener actualizada.
                    </p>
                </div>

                {!isEditing ? (
                    <button
                        type="button"
                        className="client-profile-form-card__edit-button"
                        onClick={onStartEditing}
                    >
                        ✏ Editar perfil
                    </button>
                ) : (
                    <div className="client-profile-form-card__edit-actions">
                        <button
                            type="button"
                            className="client-profile-form-card__cancel-button"
                            onClick={onCancelEditing}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className="client-profile-form-card__save-button"
                            onClick={onSaveProfile}
                            disabled={savingProfile}
                        >
                            {savingProfile ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                )}
            </div>

            <div className="client-profile-form">
                <div className="client-profile-form__field">
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={currentValues.name || ''}
                        onChange={onFieldChange}
                        readOnly={!isEditing}
                        className={`client-profile-form__control ${!isEditing ? 'client-profile-form__control--readonly' : ''
                            } ${getFieldClassName('name')}`}
                    />
                    {fieldErrors.name && (
                        <span className="client-profile-form__error-text">{fieldErrors.name}</span>
                    )}
                </div>

                <div className="client-profile-form__field">
                    <label htmlFor="surname">Apellidos</label>
                    <input
                        id="surname"
                        name="surname"
                        type="text"
                        value={currentValues.surname || ''}
                        onChange={onFieldChange}
                        readOnly={!isEditing}
                        className={`client-profile-form__control ${!isEditing ? 'client-profile-form__control--readonly' : ''
                            } ${getFieldClassName('surname')}`}
                    />
                    {fieldErrors.surname && (
                        <span className="client-profile-form__error-text">{fieldErrors.surname}</span>
                    )}
                </div>

                <div className="client-profile-form__field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={currentValues.email || ''}
                        readOnly
                        className="client-profile-form__control client-profile-form__control--readonly"
                    />
                </div>

                <div className="client-profile-form__field">
                    <label htmlFor="phone">Teléfono</label>
                    <div className="client-profile-form__phone-wrapper">
                        <span className="client-profile-form__phone-prefix">+34</span>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={currentValues.phone || ''}
                            onChange={onFieldChange}
                            readOnly={!isEditing}
                            className={`client-profile-form__control client-profile-form__control--phone ${!isEditing ? 'client-profile-form__control--readonly' : ''
                                } ${getFieldClassName('phone')}`}
                        />
                    </div>
                    {fieldErrors.phone && (
                        <span className="client-profile-form__error-text">{fieldErrors.phone}</span>
                    )}
                </div>

                <div className="client-profile-form__field">
                    <label htmlFor="province">Provincia</label>
                    <select
                        id="province"
                        name="province"
                        value={currentValues.province || ''}
                        onChange={onFieldChange}
                        disabled={!isEditing}
                        className={`client-profile-form__control ${!isEditing ? 'client-profile-form__control--readonly' : ''
                            } ${getFieldClassName('province')}`}
                    >
                        <option value="">Selecciona una provincia</option>
                        {provinces.map((province) => (
                            <option key={province.code} value={province.label}>
                                {province.label}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.province && (
                        <span className="client-profile-form__error-text">{fieldErrors.province}</span>
                    )}
                </div>

                <div className="client-profile-form__field">
                    <label htmlFor="city">Ciudad</label>
                    <select
                        key={currentValues.province || 'profile-city-empty'}
                        id="city"
                        name="city"
                        value={currentValues.city || ''}
                        onChange={onFieldChange}
                        disabled={!isEditing || !currentValues.province}
                        className={`client-profile-form__control ${!isEditing ? 'client-profile-form__control--readonly' : ''
                            } ${getFieldClassName('city')}`}
                    >
                        <option value="">
                            {!currentValues.province
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
                        <span className="client-profile-form__error-text">{fieldErrors.city}</span>
                    )}
                </div>

                <div className="client-profile-form__field client-profile-form__field--full">
                    <label className="client-profile-form__checkbox-label">
                        <input
                            type="checkbox"
                            name="whatsappAvailable"
                            checked={Boolean(currentValues.whatsappAvailable)}
                            onChange={onFieldChange}
                            disabled={!isEditing}
                        />
                        Disponible por WhatsApp
                    </label>
                </div>
            </div>
        </section>
    )
}

export default ClientProfileForm