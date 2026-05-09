import axiosClient from '../api/axiosClient'

export async function updateClientProfile(clientId, profileData) {
    const response = await axiosClient.put(`/client/profile/${clientId}`, profileData)
    return response.data
}

export async function uploadClientProfileImage(clientId, imageFile) {
    const formData = new FormData()
    formData.append('clientImage', imageFile)

    const response = await axiosClient.post(`/client/profile/${clientId}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    return response.data
}