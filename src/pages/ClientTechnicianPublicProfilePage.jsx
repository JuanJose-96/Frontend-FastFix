import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ClientHomeHeader from '../components/client-home/ClientHomeHeader'
import ClientTechnicianReviewsSummary from '../components/client-technician-public-profile/ClientTechnicianReviewsSummary'
import ClientTechnicianReviewsList from '../components/client-technician-public-profile/ClientTechnicianReviewsList'
import ClientTechnicianReviewsEmptyState from '../components/client-technician-public-profile/ClientTechnicianReviewsEmptyState'
import ClientTechnicianFirstReviewNotice from '../components/client-technician-public-profile/ClientTechnicianFirstReviewNotice'
import ClientReviewForm from '../components/client-technician-public-profile/ClientReviewForm'
import ClientOwnReviewCard from '../components/client-technician-public-profile/ClientOwnReviewCard'
import {
    deleteReview,
    editReview,
    getClientReviews,
    getTechnicianReviews,
    publishReview,
} from '../services/reviewService'
import { resolveReviewClients } from '../services/reviewClientResolverService'
import { getClientSession } from '../utils/clientSession'
import '../styles/client-technician-public-profile.css'

const INITIAL_REVIEW_FORM = {
    rating: 0,
    comment: '',
}

function ClientTechnicianPublicProfilePage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [storedClient] = useState(() => getClientSession())

    const client = useMemo(() => storedClient, [storedClient])

    const technicianFromState = location.state?.technician

    const technician = useMemo(() => {
        return technicianFromState || null
    }, [technicianFromState])

    const [reviews, setReviews] = useState([])
    const [clientMap, setClientMap] = useState({})
    const [loadingReviews, setLoadingReviews] = useState(true)
    const [reviewsError, setReviewsError] = useState('')

    const [clientOwnReview, setClientOwnReview] = useState(null)
    const [isEditingOwnReview, setIsEditingOwnReview] = useState(false)
    const [reviewForm, setReviewForm] = useState(INITIAL_REVIEW_FORM)
    const [reviewFormError, setReviewFormError] = useState('')
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const [isDeletingReview, setIsDeletingReview] = useState(false)

    useEffect(() => {
        if (!client) {
            navigate('/login', { replace: true })
            return
        }

        if (!technician) {
            navigate('/client/home', { replace: true })
        }
    }, [client, technician, navigate])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto',
        })
    }, [])

    async function loadReviewsData() {
        if (!technician?.id || !client?.id) return

        try {
            setLoadingReviews(true)
            setReviewsError('')

            const [technicianReviewResponses, clientReviewResponses] = await Promise.all([
                getTechnicianReviews(technician.id),
                getClientReviews(client.id),
            ])

            const sortedTechnicianReviews = [...technicianReviewResponses].sort((a, b) => {
                const firstDate = a.createdAt || ''
                const secondDate = b.createdAt || ''
                return secondDate.localeCompare(firstDate)
            })

            const resolvedClientMap = await resolveReviewClients(sortedTechnicianReviews)

            const existingOwnReview =
                clientReviewResponses.find(
                    (review) => Number(review.technicianId) === Number(technician.id),
                ) || null

            setReviews(sortedTechnicianReviews)
            setClientMap(resolvedClientMap)
            setClientOwnReview(existingOwnReview)

            if (existingOwnReview) {
                setReviewForm({
                    rating: Number(existingOwnReview.rating || 0),
                    comment: existingOwnReview.comment || '',
                })
            } else {
                setReviewForm(INITIAL_REVIEW_FORM)
            }

            setIsEditingOwnReview(false)
            setReviewFormError('')
        } catch (error) {
            console.error('Error cargando reseñas del técnico para cliente:', error)
            setReviewsError('No se pudieron cargar las reseñas')
            setReviews([])
            setClientMap({})
            setClientOwnReview(null)
        } finally {
            setLoadingReviews(false)
        }
    }

    useEffect(() => {
        loadReviewsData()
    }, [technician?.id, client?.id])

    function getInitials() {
        const firstInitial = technician?.name?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = technician?.surname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'T'
    }

    function normalizeSpanishPhone(phone) {
        if (!phone) return ''

        const digitsOnly = String(phone).replace(/\D/g, '')

        if (digitsOnly.startsWith('34')) {
            return digitsOnly
        }

        return `34${digitsOnly}`
    }

    function handleOpenWhatsApp() {
        if (!technician?.whatsappAvailable || !technician?.phone) return

        const fullName = `${technician.name || ''} ${technician.surname || ''}`.trim()
        const normalizedPhone = normalizeSpanishPhone(technician.phone)
        const message = `Hola ${fullName}, te contacto desde FastFix.`
        const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }

    function handleReviewFieldChange(fieldName, value) {
        setReviewForm((previousForm) => ({
            ...previousForm,
            [fieldName]: value,
        }))

        if (reviewFormError) {
            setReviewFormError('')
        }
    }

    function handleStartEditingOwnReview() {
        if (!clientOwnReview) return

        setReviewForm({
            rating: Number(clientOwnReview.rating || 0),
            comment: clientOwnReview.comment || '',
        })
        setReviewFormError('')
        setIsEditingOwnReview(true)
    }

    function handleCancelEditingOwnReview() {
        if (clientOwnReview) {
            setReviewForm({
                rating: Number(clientOwnReview.rating || 0),
                comment: clientOwnReview.comment || '',
            })
        } else {
            setReviewForm(INITIAL_REVIEW_FORM)
        }

        setReviewFormError('')
        setIsEditingOwnReview(false)
    }

    async function handleSubmitReview() {
        if (!client?.id || !technician?.id) return

        if (!reviewForm.rating || Number(reviewForm.rating) < 1 || Number(reviewForm.rating) > 5) {
            setReviewFormError('Debes seleccionar una valoración entre 1 y 5 estrellas')
            return
        }

        try {
            setIsSubmittingReview(true)
            setReviewFormError('')

            const payload = {
                clientId: client.id,
                technicianId: technician.id,
                rating: Number(reviewForm.rating),
                comment: reviewForm.comment.trim() || '',
            }

            if (clientOwnReview) {
                await editReview(clientOwnReview.id, {
                    clientId: client.id,
                    rating: Number(reviewForm.rating),
                    comment: reviewForm.comment.trim() || '',
                })
            } else {
                await publishReview(payload)
            }

            await loadReviewsData()
        } catch (error) {
            console.error('Error guardando reseña del cliente:', error)
            setReviewFormError('No se pudo guardar tu reseña')
        } finally {
            setIsSubmittingReview(false)
        }
    }

    async function handleDeleteOwnReview() {
        if (!client?.id || !clientOwnReview?.id) return

        try {
            setIsDeletingReview(true)
            setReviewFormError('')

            await deleteReview(clientOwnReview.id, client.id)
            await loadReviewsData()
        } catch (error) {
            console.error('Error eliminando reseña del cliente:', error)
            setReviewFormError('No se pudo eliminar tu reseña')
        } finally {
            setIsDeletingReview(false)
        }
    }

    if (!client || !technician) {
        return null
    }

    const fullName = `${technician.name || ''} ${technician.surname || ''}`.trim()
    const sectorName =
        technician.sectorName || technician.sector?.name || 'Sector no definido'

    const totalReviews = reviews.length
    const averageRating =
        totalReviews > 0
            ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews
            : 0

    const publicReviews = clientOwnReview
        ? reviews.filter((review) => Number(review.id) !== Number(clientOwnReview.id))
        : reviews

    const hasNoReviews = reviews.length === 0
    const isFirstReviewer = Boolean(clientOwnReview) && reviews.length === 1

    return (
        <div className="client-technician-public-profile-page">
            <ClientHomeHeader
                clientName={client.name}
                clientSurname={client.surname}
                clientProfileImageUrl={client.profileImageUrl}
            />

            <main className="client-technician-public-profile-page__main">
                <section className="client-technician-public-profile-card">
                    <div className="client-technician-public-profile-card__top">
                        <div className="client-technician-public-profile-card__avatar">
                            {technician.profileImageUrl ? (
                                <img
                                    src={technician.profileImageUrl}
                                    alt={`Foto de perfil de ${fullName}`}
                                    className="client-technician-public-profile-card__avatar-image"
                                />
                            ) : (
                                <span className="client-technician-public-profile-card__avatar-initials">
                                    {getInitials()}
                                </span>
                            )}
                        </div>

                        <div className="client-technician-public-profile-card__summary">
                            <p className="client-technician-public-profile-card__eyebrow">
                                Perfil del técnico
                            </p>

                            <h1 className="client-technician-public-profile-card__name">
                                {fullName || 'Técnico'}
                            </h1>

                            <p className="client-technician-public-profile-card__sector">
                                {sectorName}
                            </p>

                            <p className="client-technician-public-profile-card__location">
                                {technician.city || 'Ciudad no definida'},{' '}
                                {technician.province || 'Provincia no definida'}
                            </p>

                            <div className="client-technician-public-profile-card__badges">
                                <span className="client-technician-public-profile-card__rating">
                                    ★ {averageRating.toFixed(1)}
                                </span>

                                <span className="client-technician-public-profile-card__reviews">
                                    {totalReviews} reseña{totalReviews === 1 ? '' : 's'}
                                </span>

                                {technician.emergencyAvailability && (
                                    <span className="client-technician-public-profile-card__badge">
                                        Urgencias
                                    </span>
                                )}

                                <button
                                    type="button"
                                    className={`client-technician-public-profile-card__whatsapp ${technician.whatsappAvailable
                                            ? 'client-technician-public-profile-card__whatsapp--available'
                                            : 'client-technician-public-profile-card__whatsapp--unavailable'
                                        }`}
                                    onClick={handleOpenWhatsApp}
                                    disabled={!technician.whatsappAvailable || !technician.phone}
                                    title={
                                        technician.whatsappAvailable
                                            ? 'Abrir conversación de WhatsApp'
                                            : 'No disponible por WhatsApp'
                                    }
                                >
                                    <img
                                        src="/images/whatsapp-icon.png"
                                        alt="WhatsApp"
                                        className="client-technician-public-profile-card__whatsapp-image"
                                    />
                                    <span className="client-technician-public-profile-card__whatsapp-text">
                                        {technician.whatsappAvailable ? 'Disponible' : 'No disponible'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="client-technician-public-profile-card__sections">
                        <section className="client-technician-public-profile-card__section">
                            <h2>Sobre mí</h2>
                            <p>
                                {technician.aboutMe?.trim()
                                    ? technician.aboutMe
                                    : 'Este técnico todavía no ha añadido una descripción profesional.'}
                            </p>
                        </section>

                        <section className="client-technician-public-profile-card__section">
                            <h2>Precios</h2>
                            <p>
                                {technician.priceDescription?.trim()
                                    ? technician.priceDescription
                                    : 'Este técnico todavía no ha añadido una referencia de precios.'}
                            </p>
                        </section>

                        <section className="client-technician-public-profile-card__section">
                            <h2>Disponibilidad</h2>
                            <p>
                                {technician.scheduleAvailability?.trim()
                                    ? technician.scheduleAvailability
                                    : 'Este técnico todavía no ha indicado su disponibilidad horaria.'}
                            </p>
                        </section>
                    </div>
                </section>

                <section className="client-technician-public-reviews-card">
                    <div className="client-technician-public-reviews-card__header">
                        <h2>Reseñas</h2>
                        <p>
                            Aquí puedes ver la valoración global, el detalle de las reseñas y
                            dejar tu propia valoración sobre este técnico.
                        </p>
                    </div>

                    {reviewsError && (
                        <p className="client-technician-public-reviews-card__error">
                            {reviewsError}
                        </p>
                    )}

                    {loadingReviews ? (
                        <div className="client-technician-public-reviews-card__loading">
                            Cargando reseñas...
                        </div>
                    ) : (
                        <>
                            <ClientTechnicianReviewsSummary reviews={reviews} />

                            {clientOwnReview ? (
                                <ClientOwnReviewCard
                                    review={clientOwnReview}
                                    isEditing={isEditingOwnReview}
                                    isSubmitting={isSubmittingReview}
                                    isDeleting={isDeletingReview}
                                    formData={reviewForm}
                                    formError={reviewFormError}
                                    onFieldChange={handleReviewFieldChange}
                                    onStartEditing={handleStartEditingOwnReview}
                                    onCancelEditing={handleCancelEditingOwnReview}
                                    onSubmit={handleSubmitReview}
                                    onDelete={handleDeleteOwnReview}
                                />
                            ) : (
                                <ClientReviewForm
                                    title="Valora a este técnico"
                                    submitLabel="Publicar reseña"
                                    isSubmitting={isSubmittingReview}
                                    formData={reviewForm}
                                    formError={reviewFormError}
                                    onFieldChange={handleReviewFieldChange}
                                    onSubmit={handleSubmitReview}
                                />
                            )}

                            {hasNoReviews ? (
                                <ClientTechnicianReviewsEmptyState />
                            ) : isFirstReviewer ? (
                                <ClientTechnicianFirstReviewNotice />
                            ) : (
                                <ClientTechnicianReviewsList
                                    reviews={publicReviews}
                                    clientMap={clientMap}
                                />
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
    )
}

export default ClientTechnicianPublicProfilePage