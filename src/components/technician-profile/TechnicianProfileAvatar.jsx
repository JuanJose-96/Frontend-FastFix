function TechnicianProfileAvatar({
    technicianName,
    technicianSurname,
    profileImageUrl,
    previewImageUrl,
    isEditing,
    onImageChange,
    onDeleteImage,
}) {
    function getInitials() {
        const firstInitial = technicianName?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = technicianSurname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'T'
    }

    const imageToShow = previewImageUrl || profileImageUrl

    return (
        <div className="technician-profile-avatar">
            <div className="technician-profile-avatar__circle">
                {imageToShow ? (
                    <img
                        src={imageToShow}
                        alt={`Foto de perfil de ${technicianName}`}
                        className="technician-profile-avatar__image"
                    />
                ) : (
                    <span className="technician-profile-avatar__initials">{getInitials()}</span>
                )}
            </div>

            {isEditing && (
                <div className="technician-profile-avatar__actions">
                    <label className="technician-profile-avatar__action-button technician-profile-avatar__action-button--primary">
                        Subir imagen
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className="technician-profile-avatar__file-input"
                        />
                    </label>

                    <button
                        type="button"
                        className={`technician-profile-avatar__action-button technician-profile-avatar__action-button--secondary ${!imageToShow
                                ? 'technician-profile-avatar__action-button--disabled'
                                : ''
                            }`}
                        onClick={onDeleteImage}
                        disabled={!imageToShow}
                    >
                        Borrar imagen
                    </button>
                </div>
            )}
        </div>
    )
}

export default TechnicianProfileAvatar