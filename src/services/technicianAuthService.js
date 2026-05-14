import axiosClient from '../api/axiosClient'

export async function registerTechnician(technicianData) {
    const response = await axiosClient.post('/technician/auth/register', technicianData)
    return response.data
}

export async function loginTechnician(credentials) {
    const response = await axiosClient.post('/technician/auth/login', credentials)
    return response.data
}
