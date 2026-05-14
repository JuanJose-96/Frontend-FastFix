import axiosClient from '../api/axiosClient'

export async function registerClient(clientData) {
    const response = await axiosClient.post('/client/auth/register', clientData)
    return response.data
}

export async function loginClient(credentials) {
    const response = await axiosClient.post('/client/auth/login', credentials)
    return response.data
}