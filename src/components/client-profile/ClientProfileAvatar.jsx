function ClientProfileAvatar({
    clientName,
    clientSurname,
    profileImageUrl,
    previewImageUrl,
    isEditing,
    onImageChange,
}) {
    function getInitials() {
        const firstInitial = clientName?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = clientSurname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'C'
    }

    const imageToShow = previewImageUrl || profileImageUrl

    return (
        <div className="client-profile-avatar">
            <div className="client-profile-avatar__circle">
                {imageToShow ? (
                    <img
                        src={imageToShow}
                        alt={`Foto de perfil de ${clientName}`}
                        className="client-profile-avatar__image"
                    />
                ) : (
                    <span className="client-profile-avatar__initials">{getInitials()}</span>
                )}
            </div>

            {isEditing && (
                <div className="client-profile-avatar__actions">
                    <label className="client-profile-avatar__action-button client-profile-avatar__action-button--primary">
                        Subir imagen
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className="client-profile-avatar__file-input"
                        />
                    </label>

                    <button
                        type="button"
                        className="client-profile-avatar__action-button client-profile-avatar__action-button--secondary client-profile-avatar__action-button--disabled"
                        disabled
                        title="Pendiente hasta que exista endpoint en backend"
                    >
                        Borrar imagen
                    </button>
                </div>
            )}
        </div>
    )
}

export default ClientProfileAvatar