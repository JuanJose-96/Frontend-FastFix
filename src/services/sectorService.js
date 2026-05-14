import axiosClient from '../api/axiosClient'

export async function getSectors() {
    const response = await axiosClient.get('/sectors')
    return Array.isArray(response.data) ? response.data : []
}