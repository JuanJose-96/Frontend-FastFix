import ClientTechnicianReviewCard from './ClientTechnicianReviewCard'

function ClientTechnicianReviewsList({ reviews, clientMap }) {
    return (
        <div className="client-technician-reviews-list">
            {reviews.map((review) => (
                <ClientTechnicianReviewCard
                    key={review.id}
                    review={review}
                    client={clientMap[review.clientId]}
                />
            ))}
        </div>
    )
}

export default ClientTechnicianReviewsList