import axiosClient from '../api/axiosClient'

export async function getTechnicianReviews(technicianId) {
    const response = await axiosClient.get(`/reviews/technician/${technicianId}`)
    return response.data
}

export async function replyToReview(reviewId, technicianId, technicianReply) {
    const response = await axiosClient.patch(`/reviews/${reviewId}/reply`, {
        technicianId,
        technicianReply,
    })

    return response.data
}

export async function deleteReviewReply(reviewId, technicianId) {
    const response = await axiosClient.delete(`/reviews/${reviewId}/reply`, {
        data: {
            technicianId,
        },
    })

    return response.data
}