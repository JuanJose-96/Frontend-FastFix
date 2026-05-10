import axiosClient from '../api/axiosClient'

export async function searchClients(filters = {}) {
    const params = {}

    if (filters.name) {
        params.name = filters.name.trim().toLowerCase() + '%'
    }

    if (filters.province) {
        params.province = filters.province
    }

    if (filters.city) {
        params.city = filters.city
    }

    const response = await axiosClient.get('/clients/search', { params })
    return response.data
}