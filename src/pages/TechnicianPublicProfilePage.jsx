import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TechnicianHomeHeader from '../components/technician-home/TechnicianHomeHeader'
import '../styles/technician-public-profile.css'

function TechnicianPublicProfilePage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [storedTechnician] = useState(() => {
        const session = localStorage.getItem('technicianSession')

        if (!session) return null

        try {
            return JSON.parse(session)
        } catch (error) {
            console.error('Error leyendo la sesión del técnico:', error)
            return null
        }
    })

    const technicianFromState = location.state?.technician

    const technician = useMemo(() => {
        return technicianFromState || storedTechnician
    }, [technicianFromState, storedTechnician])

    useEffect(() => {
        if (!technician) {
            navigate('/technician/home', { replace: true })
        }
    }, [technician, navigate])

    function getInitials() {
        const firstInitial = technician?.name?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = technician?.surname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'T'
    }

    if (!technician) {
        return null
    }

    const fullName = `${technician.name || ''} ${technician.surname || ''}`.trim()
    const sectorName =
        technician.sectorName || technician.sector?.name || 'Sector no definido'
    const averageRating = Number(technician.averageRating || 0)
    const totalReviews = Number(technician.totalReviews || 0)

    return (
        <div className="technician-public-profile-page">
            <TechnicianHomeHeader
                technicianName={technician.name}
                technicianSurname={technician.surname}
                technicianProfileImageUrl={technician.profileImageUrl}
            />

            <main className="technician-public-profile-page__main">
                <section className="technician-public-profile-card">
                    <div className="technician-public-profile-card__top">
                        <div className="technician-public-profile-card__avatar">
                            {technician.profileImageUrl ? (
                                <img
                                    src={technician.profileImageUrl}
                                    alt={`Foto de perfil de ${fullName}`}
                                    className="technician-public-profile-card__avatar-image"
                                />
                            ) : (
                                <span className="technician-public-profile-card__avatar-initials">
                                    {getInitials()}
                                </span>
                            )}
                        </div>

                        <div className="technician-public-profile-card__summary">
                            <p className="technician-public-profile-card__eyebrow">
                                Perfil público
                            </p>

                            <h1 className="technician-public-profile-card__name">
                                {fullName || 'Técnico'}
                            </h1>

                            <p className="technician-public-profile-card__sector">{sectorName}</p>

                            <p className="technician-public-profile-card__location">
                                {technician.city || 'Ciudad no definida'},{' '}
                                {technician.province || 'Provincia no definida'}
                            </p>

                            <div className="technician-public-profile-card__badges">
                                <span className="technician-public-profile-card__rating">
                                    ★ {averageRating.toFixed(1)}
                                </span>

                                <span className="technician-public-profile-card__reviews">
                                    {totalReviews} reseña{totalReviews === 1 ? '' : 's'}
                                </span>

                                {technician.emergencyAvailability && (
                                    <span className="technician-public-profile-card__badge">
                                        Urgencias
                                    </span>
                                )}

                                <button
                                    type="button"
                                    className={`technician-public-profile-card__whatsapp ${technician.whatsappAvailable
                                            ? 'technician-public-profile-card__whatsapp--available'
                                            : 'technician-public-profile-card__whatsapp--unavailable'
                                        }`}
                                    disabled
                                    title="Vista previa de cómo verán los clientes tu botón de WhatsApp"
                                    aria-label={
                                        technician.whatsappAvailable
                                            ? 'WhatsApp disponible'
                                            : 'WhatsApp no disponible'
                                    }
                                >
                                    <img
                                        src="/images/whatsapp-icon.png"
                                        alt="WhatsApp"
                                        className="technician-public-profile-card__whatsapp-image"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="technician-public-profile-card__sections">
                        <section className="technician-public-profile-card__section">
                            <h2>Sobre mí</h2>
                            <p>
                                {technician.aboutMe?.trim()
                                    ? technician.aboutMe
                                    : 'Todavía no has añadido una descripción profesional.'}
                            </p>
                        </section>

                        <section className="technician-public-profile-card__section">
                            <h2>Precios</h2>
                            <p>
                                {technician.priceDescription?.trim()
                                    ? technician.priceDescription
                                    : 'Todavía no has añadido una referencia de precios.'}
                            </p>
                        </section>

                        <section className="technician-public-profile-card__section">
                            <h2>Disponibilidad</h2>
                            <p>
                                {technician.scheduleAvailability?.trim()
                                    ? technician.scheduleAvailability
                                    : 'Todavía no has indicado tu disponibilidad horaria.'}
                            </p>
                        </section>
                    </div>
                </section>

                <section className="technician-public-reviews-card">
                    <div className="technician-public-reviews-card__header">
                        <h2>Reseñas</h2>
                        <p>
                            Aquí irá el listado detallado de reseñas cuando conectemos esa parte del
                            backend.
                        </p>
                    </div>

                    <div className="technician-public-reviews-card__summary">
                        <div className="technician-public-reviews-card__summary-score">
                            <span className="technician-public-reviews-card__rating-number">
                                {averageRating.toFixed(1)}
                            </span>
                            <span className="technician-public-reviews-card__rating-star">★</span>
                        </div>

                        <span className="technician-public-reviews-card__summary-text">
                            Basado en {totalReviews} reseña{totalReviews === 1 ? '' : 's'}
                        </span>
                    </div>

                    <div className="technician-public-reviews-card__empty">
                        Las reseñas detalladas se mostrarán aquí en formato de listado cuando
                        implementemos esa parte completa.
                    </div>
                </section>
            </main>
        </div>
    )
}

export default TechnicianPublicProfilePage