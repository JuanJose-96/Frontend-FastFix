import axiosClient from '../api/axiosClient'

export async function searchTechnicians(filters = {}) {
    const params = {}

    if (filters.sectorId) {
        params.sectorId = filters.sectorId
    }

    if (filters.province) {
        params.province = filters.province
    }

    if (filters.city) {
        params.city = filters.city
    }

    if (filters.rating) {
        params.rating = filters.rating
    }

    const response = await axiosClient.get('/technicians/search', { params })
    return Array.isArray(response.data) ? response.data : []
}