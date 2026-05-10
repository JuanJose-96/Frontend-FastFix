function TechnicianProfileForm({
    isEditing,
    profileData,
    editForm,
    provinces,
    cities,
    sectors,
    fieldErrors,
    savingProfile,
    onFieldChange,
    onStartEditing,
    onCancelEditing,
    onSaveProfile,
}) {
    const currentValues = isEditing ? editForm : profileData

    function getFieldClassName(fieldName) {
        return fieldErrors[fieldName] ? 'technician-profile-form__control--error' : ''
    }

    return (
        <section className="technician-profile-form-card">
            <div className="technician-profile-form-card__header">
                <div>
                    <h2 className="technician-profile-form-card__title">Mi perfil profesional</h2>
                    <p className="technician-profile-form-card__subtitle">
                        Consulta tu información pública y edita los datos que verán los clientes.
                    </p>
                </div>

                {!isEditing ? (
                    <button
                        type="button"
                        className="technician-profile-form-card__edit-button"
                        onClick={onStartEditing}
                    >
                        ✏ Editar perfil
                    </button>
                ) : (
                    <div className="technician-profile-form-card__edit-actions">
                        <button
                            type="button"
                            className="technician-profile-form-card__cancel-button"
                            onClick={onCancelEditing}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className="technician-profile-form-card__save-button"
                            onClick={onSaveProfile}
                            disabled={savingProfile}
                        >
                            {savingProfile ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                )}
            </div>

            <div className="technician-profile-form">
                <div className="technician-profile-form__field">
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={currentValues.name || ''}
                        onChange={onFieldChange}
                        readOnly={!isEditing}
                        className={`technician-profile-form__control ${!isEditing ? 'technician-profile-form__control--readonly' : ''
                            } ${getFieldClassName('name')}`}
                    />
                    {fieldErrors.name && (
                        <span className="technician-profile-form__error-text">{fieldErrors.name}</span>
                    )}
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="surname">Apellidos</label>
                    <input
                        id="surname"
                        name="surname"
                        type="text"
                        value={currentValues.surname || ''}
                        onChange={onFieldChange}
                        readOnly={!isEditing}
                        className={`technician-profile-form__control ${!isEditing ? 'technician-profile-form__control--readonly' : ''
                            } ${getFieldClassName('surname')}`}
                    />
                    {fieldErrors.surname && (
                        <span className="technician-profile-form__error-text">{fieldErrors.surname}</span>
                    )}
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={currentValues.email || ''}
                        readOnly
                        className="technician-profile-form__control technician-profile-form__control--readonly"
                    />
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="phone">Teléfono</label>
                    <div className="technician-profile-form__phone-wrapper">
                        <span className="technician-profile-form__phone-prefix">+34</span>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={currentValues.phone || ''}
                            onChange={onFieldChange}
                            readOnly={!isEditing}
                            className={`technician-profile-form__control technician-profile-form__control--phone ${!isEditing ? 'technician-profile-form__control--readonly' : ''
                                } ${getFieldClassName('phone')}`}
                        />
                    </div>
                    {fieldErrors.phone && (
                        <span className="technician-profile-form__error-text">{fieldErrors.phone}</span>
                    )}
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="province">Provincia</label>
                    <select
                        id="province"
                        name="province"
                        value={currentValues.province || ''}
                        onChange={onFieldChange}
                        disabled={!isEditing}
                        className={`technician-profile-form__control ${!isEditing ? 'technician-profile-form__control--readonly' : ''
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
                        <span className="technician-profile-form__error-text">{fieldErrors.province}</span>
                    )}
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="city">Ciudad</label>
                    <select
                        key={currentValues.province || 'technician-profile-city-empty'}
                        id="city"
                        name="city"
                        value={currentValues.city || ''}
                        onChange={onFieldChange}
                        disabled={!isEditing || !currentValues.province}
                        className={`technician-profile-form__control ${!isEditing ? 'technician-profile-form__control--readonly' : ''
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
                        <span className="technician-profile-form__error-text">{fieldErrors.city}</span>
                    )}
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="sectorId">Sector principal</label>
                    <select
                        id="sectorId"
                        name="sectorId"
                        value={String(currentValues.sectorId || '')}
                        onChange={onFieldChange}
                        disabled={!isEditing}
                        className={`technician-profile-form__control ${!isEditing ? 'technician-profile-form__control--readonly' : ''
                            } ${getFieldClassName('sectorId')}`}
                    >
                        <option value="">Selecciona un sector</option>
                        {sectors.map((sector) => (
                            <option key={sector.id} value={String(sector.id)}>
                                {sector.name}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.sectorId && (
                        <span className="technician-profile-form__error-text">{fieldErrors.sectorId}</span>
                    )}
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="averageRating">Valoración media</label>
                    <input
                        id="averageRating"
                        name="averageRating"
                        type="text"
                        value={Number(currentValues.averageRating || 0).toFixed(1)}
                        readOnly
                        className="technician-profile-form__control technician-profile-form__control--readonly"
                    />
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="totalReviews">Reseñas</label>
                    <input
                        id="totalReviews"
                        name="totalReviews"
                        type="text"
                        value={String(currentValues.totalReviews || 0)}
                        readOnly
                        className="technician-profile-form__control technician-profile-form__control--readonly"
                    />
                </div>

                <div className="technician-profile-form__field">
                    <label htmlFor="priceDescription">Precios</label>
                    <input
                        id="priceDescription"
                        name="priceDescription"
                        type="text"
                        value={currentValues.priceDescription || ''}
                        onChange={onFieldChange}
                        readOnly={!isEditing}
                        className={`technician-profile-form__control ${!isEditing ? 'technician-profile-form__control--readonly' : ''
                            }`}
                    />
                </div>

                <div className="technician-profile-form__field technician-profile-form__field--full">
                    <label htmlFor="scheduleAvailability">Disponibilidad horaria</label>
                    <input
                        id="scheduleAvailability"
                        name="scheduleAvailability"
                        type="text"
                        value={currentValues.scheduleAvailability || ''}
                        onChange={onFieldChange}
                        readOnly={!isEditing}
                        className={`technician-profile-form__control ${!isEditing ? 'technician-profile-form__control--readonly' : ''
                            }`}
                    />
                </div>

                <div className="technician-profile-form__field technician-profile-form__field--full">
                    <label htmlFor="aboutMe">Sobre mí</label>
                    <textarea
                        id="aboutMe"
                        name="aboutMe"
                        rows="5"
                        value={currentValues.aboutMe || ''}
                        onChange={onFieldChange}
                        readOnly={!isEditing}
                        className={`technician-profile-form__control technician-profile-form__textarea ${!isEditing ? 'technician-profile-form__control--readonly' : ''
                            }`}
                    />
                </div>

                <div className="technician-profile-form__field technician-profile-form__field--full technician-profile-form__toggles">
                    <label className="technician-profile-form__checkbox-label">
                        <input
                            type="checkbox"
                            name="emergencyAvailability"
                            checked={Boolean(currentValues.emergencyAvailability)}
                            onChange={onFieldChange}
                            disabled={!isEditing}
                        />
                        Disponible para urgencias
                    </label>

                    <label className="technician-profile-form__checkbox-label">
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

export default TechnicianProfileForm