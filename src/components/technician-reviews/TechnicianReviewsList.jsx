import TechnicianReviewCard from './TechnicianReviewCard'

function TechnicianReviewsList({
    reviews,
    clientMap,
    technicianId,
    submittingReviewId,
    deletingReplyId,
    onReplySubmit,
    onDeleteReply,
}) {
    return (
        <section className="technician-reviews-list">
            <div className="technician-reviews-list__grid">
                {reviews.map((review) => (
                    <TechnicianReviewCard
                        key={review.id}
                        review={review}
                        clientDisplay={clientMap[review.clientId]}
                        technicianId={technicianId}
                        submittingReviewId={submittingReviewId}
                        deletingReplyId={deletingReplyId}
                        onReplySubmit={onReplySubmit}
                        onDeleteReply={onDeleteReply}
                    />
                ))}
            </div>
        </section>
    )
}

export default TechnicianReviewsList