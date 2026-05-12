import axiosClient from '../api/axiosClient'

export async function getTechnicianWorks(technicianId) {
    const response = await axiosClient.get(`/works/technician/${technicianId}`)
    return response.data
}

export async function createTechnicianWork(workData) {
    const response = await axiosClient.post('/works', workData)
    return response.data
}

export async function updateTechnicianWork(workId, workData) {
    const response = await axiosClient.patch(`/works/${workId}`, workData)
    return response.data
}

export async function deleteTechnicianWork(workId) {
    await axiosClient.delete(`/works/${workId}`)
}