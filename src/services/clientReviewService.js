import axiosClient from '../api/axiosClient'

export async function getClientReviews(clientId) {
    const response = await axiosClient.get(`/reviews/client/${clientId}`)
    return response.data
}