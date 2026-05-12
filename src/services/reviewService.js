import axiosClient from '../api/axiosClient'

export async function publishReview({ clientId, technicianId, rating, comment }) {
    const response = await axiosClient.post('/reviews', {
        clientId,
        technicianId,
        rating,
        comment,
    })

    return response.data
}

export async function getTechnicianReviews(technicianId) {
    const response = await axiosClient.get(`/reviews/technician/${technicianId}`)
    return response.data
}

export async function getClientReviews(clientId) {
    const response = await axiosClient.get(`/reviews/client/${clientId}`)
    return response.data
}

export async function editReview(reviewId, { clientId, rating, comment }) {
    const response = await axiosClient.patch(`/reviews/${reviewId}`, {
        clientId,
        rating,
        comment,
    })

    return response.data
}

export async function deleteReview(reviewId, clientId) {
    const response = await axiosClient.delete(`/reviews/${reviewId}`, {
        data: {
            clientId,
        },
    })

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