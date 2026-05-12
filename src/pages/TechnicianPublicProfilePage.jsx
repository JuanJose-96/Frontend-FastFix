import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TechnicianHomeHeader from '../components/technician-home/TechnicianHomeHeader'
import TechnicianReviewsSummary from '../components/technician-reviews/TechnicianReviewsSummary'
import TechnicianReviewsList from '../components/technician-reviews/TechnicianReviewsList'
import TechnicianReviewsEmptyState from '../components/technician-reviews/TechnicianReviewsEmptyState'
import {
    deleteReviewReply,
    getTechnicianReviews,
    replyToReview,
} from '../services/reviewService'
import { resolveReviewClients } from '../services/reviewClientResolverService'
import { getTechnicianProfile } from '../services/technicianProfileService'
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

    const technicianSession = useMemo(() => {
        return technicianFromState || storedTechnician
    }, [technicianFromState, storedTechnician])

    const [technician, setTechnician] = useState(technicianSession)
    const [reviews, setReviews] = useState([])
    const [clientMap, setClientMap] = useState({})
    const [loadingReviews, setLoadingReviews] = useState(true)
    const [reviewsError, setReviewsError] = useState('')
    const [submittingReviewId, setSubmittingReviewId] = useState(null)
    const [deletingReplyId, setDeletingReplyId] = useState(null)

    useEffect(() => {
        if (!technicianSession) {
            navigate('/technician/home', { replace: true })
        }
    }, [technicianSession, navigate])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto',
        })
    }, [])

    async function loadTechnicianAndReviews() {
        if (!technicianSession?.id) return

        try {
            setLoadingReviews(true)
            setReviewsError('')

            const freshTechnician = await getTechnicianProfile(technicianSession.id)
            const reviewResponses = await getTechnicianReviews(technicianSession.id)

            const sortedReviews = [...reviewResponses].sort((a, b) => {
                const firstDate = a.createdAt || ''
                const secondDate = b.createdAt || ''
                return secondDate.localeCompare(firstDate)
            })

            const resolvedClientMap = await resolveReviewClients(sortedReviews)

            setTechnician(freshTechnician)
            setReviews(sortedReviews)
            setClientMap(resolvedClientMap)
            localStorage.setItem('technicianSession', JSON.stringify(freshTechnician))
        } catch (error) {
            console.error('Error cargando reseñas del técnico:', error)
            setReviewsError('No se pudieron cargar las reseñas')
            setReviews([])
            setClientMap({})
        } finally {
            setLoadingReviews(false)
        }
    }

    useEffect(() => {
        loadTechnicianAndReviews()
    }, [technicianSession?.id])

    function getInitials() {
        const firstInitial = technician?.name?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = technician?.surname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'T'
    }

    async function handleReplySubmit(reviewId, technicianId, replyText) {
        try {
            setSubmittingReviewId(reviewId)
            await replyToReview(reviewId, technicianId, replyText)
            await loadTechnicianAndReviews()
        } catch (error) {
            console.error('Error respondiendo reseña:', error)
            setReviewsError('No se pudo guardar la respuesta')
        } finally {
            setSubmittingReviewId(null)
        }
    }

    async function handleDeleteReply(reviewId, technicianId) {
        try {
            setDeletingReplyId(reviewId)
            await deleteReviewReply(reviewId, technicianId)
            await loadTechnicianAndReviews()
        } catch (error) {
            console.error('Error eliminando respuesta:', error)
            setReviewsError('No se pudo eliminar la respuesta')
        } finally {
            setDeletingReplyId(null)
        }
    }

    if (!technicianSession || !technician) {
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
                                    <span className="technician-public-profile-card__whatsapp-text">
                                        {technician.whatsappAvailable ? 'Disponible' : 'No disponible'}
                                    </span>
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
                            Aquí puedes ver la valoración global, el detalle de cada reseña y
                            responder como profesional cuando el cliente haya dejado comentario.
                        </p>
                    </div>

                    {reviewsError && (
                        <p className="technician-public-reviews-card__error">{reviewsError}</p>
                    )}

                    {loadingReviews ? (
                        <div className="technician-public-reviews-card__loading">
                            Cargando reseñas...
                        </div>
                    ) : reviews.length === 0 ? (
                        <TechnicianReviewsEmptyState />
                    ) : (
                        <>
                            <TechnicianReviewsSummary reviews={reviews} />

                            <TechnicianReviewsList
                                reviews={reviews}
                                clientMap={clientMap}
                                technicianId={technician.id}
                                submittingReviewId={submittingReviewId}
                                deletingReplyId={deletingReplyId}
                                onReplySubmit={handleReplySubmit}
                                onDeleteReply={handleDeleteReply}
                            />
                        </>
                    )}
                </section>
            </main>
        </div>
    )
}

export default TechnicianPublicProfilePage