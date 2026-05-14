import axiosClient from '../api/axiosClient'

export async function searchClients(filters = {}) {
    const params = {}

    if (filters.name) {
        params.name = filters.name.trim()
    }

    if (filters.province) {
        params.province = filters.province
    }

    if (filters.city) {
        params.city = filters.city
    }

    if (typeof filters.page === 'number') {
        params.page = filters.page
    }

    const response = await axiosClient.get('/clients/search', { params })
    const data = response.data

    return {
        content: Array.isArray(data?.content) ? data.content : [],
        currentPage: typeof data?.currentPage === 'number' ? data.currentPage : 0,
        totalPages: typeof data?.totalPages === 'number' ? data.totalPages : 0,
        totalElements: typeof data?.totalElements === 'number' ? data.totalElements : 0,
        hasNext: Boolean(data?.hasNext),
    }
}