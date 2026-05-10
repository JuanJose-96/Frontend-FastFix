import axiosClient from '../api/axiosClient'

export async function getTechnicianProfile(technicianId) {
    const response = await axiosClient.get(`/technician/profile/${technicianId}`)
    return response.data
}

export async function updateTechnicianProfile(technicianId, profileData) {
    const response = await axiosClient.put(
        `/technician/profile/${technicianId}`,
        profileData,
    )
    return response.data
}

export async function uploadTechnicianProfileImage(technicianId, imageFile) {
    const formData = new FormData()
    formData.append('technicianImage', imageFile)

    const response = await axiosClient.post(
        `/technician/profile/${technicianId}/image`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    )

    return response.data
}