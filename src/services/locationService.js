import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export async function getProvinces() {
    const response = await axios.get(`${API_BASE_URL}/data/provincias.json`)
    return Array.isArray(response.data) ? response.data : []
}

export async function getLocations() {
    const response = await axios.get(`${API_BASE_URL}/data/poblaciones.json`)
    return Array.isArray(response.data) ? response.data : []
}