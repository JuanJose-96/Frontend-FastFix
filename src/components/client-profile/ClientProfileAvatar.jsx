function ClientProfileAvatar({
    clientName,
    clientSurname,
    profileImageUrl,
    previewImageUrl,
    isEditing,
    onImageChange,
    onDeleteImage,
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
        <aside className="client-profile-avatar">
            <div className="client-profile-avatar__circle">
                {imageToShow ? (
                    <img
                        src={imageToShow}
                        alt={`Foto de perfil de ${clientName}`}
                        className="client-profile-avatar__image"
                    />
                ) : (
                    <span className="client-profile-avatar__initials">
                        {getInitials()}
                    </span>
                )}
            </div>

            {isEditing && (
                <div className="client-profile-avatar__actions">
                    <label
                        htmlFor="client-profile-image-input"
                        className="client-profile-avatar__action-button client-profile-avatar__action-button--primary"
                    >
                        Subir imagen
                    </label>

                    <input
                        id="client-profile-image-input"
                        type="file"
                        accept="image/*"
                        className="client-profile-avatar__file-input"
                        onChange={onImageChange}
                    />

                    <button
                        type="button"
                        className={`client-profile-avatar__action-button client-profile-avatar__action-button--secondary ${!imageToShow ? 'client-profile-avatar__action-button--disabled' : ''
                            }`}
                        onClick={onDeleteImage}
                        disabled={!imageToShow}
                    >
                        Borrar imagen
                    </button>
                </div>
            )}
        </aside>
    )
}

export default ClientProfileAvatar