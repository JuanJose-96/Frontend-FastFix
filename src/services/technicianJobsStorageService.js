const TECHNICIAN_JOBS_STORAGE_KEY = 'technicianJobsByTechnician'

function readJobsMap() {
    const rawValue = localStorage.getItem(TECHNICIAN_JOBS_STORAGE_KEY)

    if (!rawValue) {
        return {}
    }

    try {
        const parsedValue = JSON.parse(rawValue)
        return typeof parsedValue === 'object' && parsedValue !== null ? parsedValue : {}
    } catch (error) {
        console.error('Error leyendo trabajos del técnico desde localStorage:', error)
        return {}
    }
}

function writeJobsMap(jobsMap) {
    localStorage.setItem(TECHNICIAN_JOBS_STORAGE_KEY, JSON.stringify(jobsMap))
}

function sortJobsByStartDateDesc(jobs) {
    return [...jobs].sort((firstJob, secondJob) => {
        const firstDate = firstJob.startDate || ''
        const secondDate = secondJob.startDate || ''
        return secondDate.localeCompare(firstDate)
    })
}

export function getTechnicianJobs(technicianId) {
    if (!technicianId) return []

    const jobsMap = readJobsMap()
    const technicianJobs = jobsMap[String(technicianId)] || []

    return sortJobsByStartDateDesc(technicianJobs)
}

export function saveTechnicianJob(technicianId, jobData) {
    if (!technicianId) {
        throw new Error('No se puede guardar un trabajo sin technicianId')
    }

    const jobsMap = readJobsMap()
    const technicianKey = String(technicianId)
    const currentJobs = jobsMap[technicianKey] || []

    const normalizedJob = {
        id: crypto.randomUUID(),
        clientName: jobData.clientName.trim(),
        province: jobData.province,
        city: jobData.city,
        startDate: jobData.startDate,
        endDate: jobData.endDate,
        totalPrice: jobData.totalPrice.trim(),
        serviceDescription: jobData.serviceDescription.trim(),
        createdAt: new Date().toISOString(),
    }

    jobsMap[technicianKey] = sortJobsByStartDateDesc([...currentJobs, normalizedJob])
    writeJobsMap(jobsMap)

    return normalizedJob
}

export function updateTechnicianJob(technicianId, jobId, jobData) {
    if (!technicianId || !jobId) {
        throw new Error('No se puede actualizar el trabajo')
    }

    const jobsMap = readJobsMap()
    const technicianKey = String(technicianId)
    const currentJobs = jobsMap[technicianKey] || []

    jobsMap[technicianKey] = sortJobsByStartDateDesc(
        currentJobs.map((job) => {
            if (job.id !== jobId) {
                return job
            }

            return {
                ...job,
                clientName: jobData.clientName.trim(),
                province: jobData.province,
                city: jobData.city,
                startDate: jobData.startDate,
                endDate: jobData.endDate,
                totalPrice: jobData.totalPrice.trim(),
                serviceDescription: jobData.serviceDescription.trim(),
            }
        }),
    )

    writeJobsMap(jobsMap)

    return jobsMap[technicianKey].find((job) => job.id === jobId) || null
}

export function deleteTechnicianJob(technicianId, jobId) {
    if (!technicianId || !jobId) {
        throw new Error('No se puede eliminar el trabajo')
    }

    const jobsMap = readJobsMap()
    const technicianKey = String(technicianId)
    const currentJobs = jobsMap[technicianKey] || []

    jobsMap[technicianKey] = currentJobs.filter((job) => job.id !== jobId)
    writeJobsMap(jobsMap)
}