import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ClientHomeHeader from '../components/client-home/ClientHomeHeader'
import ClientReviewsHeader from '../components/client-reviews/ClientReviewsHeader'
import ClientReviewedTechniciansEmptyState from '../components/client-reviews/ClientReviewedTechniciansEmptyState'
import ClientTechnicianCard from '../components/client-technicians/ClientTechnicianCard'
import { getClientReviews } from '../services/clientReviewService'
import { getTechnicianProfile } from '../services/technicianProfileService'
import { getClientSession, saveClientSession } from '../utils/clientSession'
import '../styles/client-reviews.css'
import '../styles/client-technician-section.css'

function ClientReviewsPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [storedClient] = useState(() => getClientSession())
    const [reviewedTechnicians, setReviewedTechnicians] = useState([])
    const [loadingPage, setLoadingPage] = useState(true)
    const [pageError, setPageError] = useState('')

    const clientFromState = location.state?.client

    const client = useMemo(() => {
        return clientFromState || storedClient
    }, [clientFromState, storedClient])

    useEffect(() => {
        if (clientFromState) {
            saveClientSession(clientFromState)
        }
    }, [clientFromState])

    useEffect(() => {
        if (!client) {
            navigate('/login', { replace: true })
        }
    }, [client, navigate])

    useEffect(() => {
        if (!client?.id) return

        async function loadReviewedTechnicians() {
            try {
                setLoadingPage(true)
                setPageError('')

                const reviews = await getClientReviews(client.id)

                const sortedReviews = [...reviews].sort((a, b) => {
                    const ratingDifference = Number(b.rating || 0) - Number(a.rating || 0)

                    if (ratingDifference !== 0) {
                        return ratingDifference
                    }

                    const firstDate = a.createdAt || ''
                    const secondDate = b.createdAt || ''

                    return secondDate.localeCompare(firstDate)
                })

                const resolvedTechnicians = await Promise.all(
                    sortedReviews.map(async (review) => {
                        const technician = await getTechnicianProfile(review.technicianId)

                        return {
                            technician,
                            reviewMeta: {
                                rating: review.rating,
                                comment: review.comment,
                                createdAt: review.createdAt,
                            },
                        }
                    }),
                )

                setReviewedTechnicians(resolvedTechnicians)
            } catch (error) {
                console.error('Error cargando las reseñas del cliente:', error)
                setPageError('No se pudieron cargar tus reseñas')
                setReviewedTechnicians([])
            } finally {
                setLoadingPage(false)
            }
        }

        loadReviewedTechnicians()
    }, [client?.id])

    if (!client) {
        return null
    }

    return (
        <div className="client-reviews-page">
            <ClientHomeHeader
                clientName={client.name}
                clientSurname={client.surname}
                clientProfileImageUrl={client.profileImageUrl}
            />

            <main className="client-reviews-page__main">
                <ClientReviewsHeader />

                {pageError && <p className="client-reviews-page__error">{pageError}</p>}

                {loadingPage ? (
                    <div className="client-reviews-page__loading">Cargando reseñas...</div>
                ) : reviewedTechnicians.length === 0 ? (
                    <ClientReviewedTechniciansEmptyState />
                ) : (
                    <section className="client-technician-section">
                        <div className="client-technician-section__header">
                            <h2 className="client-technician-section__title">Técnicos reseñados</h2>
                            <p className="client-technician-section__description">
                                Ordenados de mayor a menor según la valoración que tú les has dado.
                            </p>
                        </div>

                        <div className="client-technician-section__grid">
                            {reviewedTechnicians.map(({ technician, reviewMeta }) => (
                                <ClientTechnicianCard
                                    key={`${technician.id}-${reviewMeta.createdAt}`}
                                    technician={technician}
                                    reviewMeta={reviewMeta}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

export default ClientReviewsPage