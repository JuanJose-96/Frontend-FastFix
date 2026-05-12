import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Toast from '../components/common/Toast'
import TechnicianHomeHeader from '../components/technician-home/TechnicianHomeHeader'
import TechnicianJobsHeader from '../components/technician-jobs/TechnicianJobsHeader'
import TechnicianJobsToolbar from '../components/technician-jobs/TechnicianJobsToolbar'
import TechnicianJobsForm from '../components/technician-jobs/TechnicianJobsForm'
import TechnicianJobsList from '../components/technician-jobs/TechnicianJobsList'
import TechnicianJobsEmptyState from '../components/technician-jobs/TechnicianJobsEmptyState'
import { getLocations, getProvinces } from '../services/locationService'
import {
    createTechnicianWork,
    deleteTechnicianWork,
    getTechnicianWorks,
    updateTechnicianWork,
} from '../services/technicianWorksService'
import '../styles/technician-jobs.css'

const INITIAL_FORM_DATA = {
    clientName: '',
    clientSurname: '',
    clientProvince: '',
    clientCity: '',
    serviceDate: '',
    totalAmount: '',
    serviceDescription: '',
}

const INITIAL_FIELD_ERRORS = {
    clientName: '',
    clientProvince: '',
    clientCity: '',
    serviceDate: '',
    totalAmount: '',
    serviceDescription: '',
}

function TechnicianJobsPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [storedTechnician] = useState(() => {
        const session = localStorage.getItem('technicianSession')

        if (!session) return null

        try {
            return JSON.parse(session)
        } catch (error) {
            console.error('Error leyendo la sesión del técnico:', error)
            return null
        }
    })

    const technicianFromState = location.state?.technician

    const technician = useMemo(() => {
        return technicianFromState || storedTechnician
    }, [technicianFromState, storedTechnician])

    const [jobs, setJobs] = useState([])
    const [loadingJobs, setLoadingJobs] = useState(true)

    const [formData, setFormData] = useState(INITIAL_FORM_DATA)
    const [editingJobId, setEditingJobId] = useState(null)
    const [isCreating, setIsCreating] = useState(false)
    const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS)

    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [loadingFilters, setLoadingFilters] = useState(true)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeletingJobId, setIsDeletingJobId] = useState(null)

    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('error')

    const isEditing = editingJobId !== null

    useEffect(() => {
        if (technicianFromState) {
            localStorage.setItem('technicianSession', JSON.stringify(technicianFromState))
        }
    }, [technicianFromState])

    useEffect(() => {
        if (!technician) {
            navigate('/login', { replace: true })
        }
    }, [technician, navigate])

    async function loadJobs() {
        if (!technician?.id) return

        try {
            setLoadingJobs(true)
            const works = await getTechnicianWorks(technician.id)
            setJobs(works)
        } catch (error) {
            console.error('Error cargando trabajos del técnico:', error)
            setToastType('error')
            setToastMessage('No se pudieron cargar los trabajos')
            setJobs([])
        } finally {
            setLoadingJobs(false)
        }
    }

    useEffect(() => {
        if (!technician?.id) return
        loadJobs()
    }, [technician?.id])

    useEffect(() => {
        async function loadLocationsData() {
            try {
                setLoadingFilters(true)

                const [provincesData, locationsData] = await Promise.all([
                    getProvinces(),
                    getLocations(),
                ])

                const sortedProvinces = [...provincesData].sort((a, b) =>
                    a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
                )

                setProvinces(sortedProvinces)
                setAllLocations(locationsData)
            } catch (error) {
                console.error('Error cargando provincias y ciudades:', error)
                setToastType('error')
                setToastMessage('No se pudieron cargar provincias y ciudades')
            } finally {
                setLoadingFilters(false)
            }
        }

        loadLocationsData()
    }, [])

    useEffect(() => {
        if (!toastMessage) return

        const timeoutId = setTimeout(() => {
            setToastMessage('')
        }, 4000)

        return () => clearTimeout(timeoutId)
    }, [toastMessage])

    const filteredCities = useMemo(() => {
        if (!formData.clientProvince) return []

        const selectedProvince = provinces.find(
            (province) => province.label === formData.clientProvince,
        )

        if (!selectedProvince) return []

        return allLocations
            .filter((location) => location.parent_code === selectedProvince.code)
            .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
    }, [allLocations, formData.clientProvince, provinces])

    function validateForm(currentForm) {
        return {
            clientName: currentForm.clientName.trim()
                ? ''
                : 'Debes indicar el nombre del cliente',
            clientProvince: currentForm.clientProvince
                ? ''
                : 'Debes seleccionar una provincia',
            clientCity: currentForm.clientCity
                ? ''
                : 'Debes seleccionar una ciudad',
            serviceDate: currentForm.serviceDate
                ? ''
                : 'Debes indicar la fecha del servicio',
            totalAmount: currentForm.totalAmount.toString().trim()
                ? ''
                : 'Debes indicar el importe total',
            serviceDescription: currentForm.serviceDescription.trim()
                ? ''
                : 'Debes indicar la descripción del servicio',
        }
    }

    function hasErrors(errors) {
        return Object.values(errors).some((error) => error !== '')
    }

    function resetForm() {
        setFormData(INITIAL_FORM_DATA)
        setEditingJobId(null)
        setIsCreating(false)
        setFieldErrors(INITIAL_FIELD_ERRORS)
    }

    function handleStartCreate() {
        setEditingJobId(null)
        setFormData(INITIAL_FORM_DATA)
        setFieldErrors(INITIAL_FIELD_ERRORS)
        setIsCreating(true)
    }

    function handleCancelForm() {
        resetForm()
    }

    function handleFieldChange(event) {
        const { name, value } = event.target

        setFormData((previousForm) => {
            if (name === 'clientProvince') {
                return {
                    ...previousForm,
                    clientProvince: value,
                    clientCity: '',
                }
            }

            return {
                ...previousForm,
                [name]: value,
            }
        })

        if (fieldErrors[name]) {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                [name]: '',
            }))
        }
    }

    function handleEditJob(job) {
        setIsCreating(false)
        setEditingJobId(job.id)
        setFormData({
            clientName: job.clientName || '',
            clientSurname: job.clientSurname || '',
            clientProvince: job.clientProvince || '',
            clientCity: job.clientCity || '',
            serviceDate: job.serviceDate || '',
            totalAmount: job.totalAmount?.toString() || '',
            serviceDescription: job.serviceDescription || '',
        })
        setFieldErrors(INITIAL_FIELD_ERRORS)
    }

    async function handleDeleteJob(jobId) {
        if (!technician?.id) return

        try {
            setIsDeletingJobId(jobId)
            await deleteTechnicianWork(jobId)
            await loadJobs()

            setToastType('success')
            setToastMessage('Trabajo eliminado correctamente')

            if (editingJobId === jobId) {
                resetForm()
            }
        } catch (error) {
            console.error('Error eliminando trabajo del técnico:', error)
            setToastType('error')
            setToastMessage('No se pudo eliminar el trabajo')
        } finally {
            setIsDeletingJobId(null)
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!technician?.id) return

        const validationErrors = validateForm(formData)
        setFieldErrors(validationErrors)

        if (hasErrors(validationErrors)) {
            setToastType('error')
            setToastMessage('Revisa los campos marcados en rojo')
            return
        }

        const payload = {
            technicianId: technician.id,
            clientId: null,
            clientName: formData.clientName.trim(),
            clientSurname: formData.clientSurname.trim() || null,
            clientProvince: formData.clientProvince,
            clientCity: formData.clientCity,
            serviceDate: formData.serviceDate,
            totalAmount: formData.totalAmount,
            serviceDescription: formData.serviceDescription.trim(),
        }

        try {
            setIsSubmitting(true)

            if (editingJobId) {
                await updateTechnicianWork(editingJobId, payload)
                setToastType('success')
                setToastMessage('Trabajo actualizado correctamente')
            } else {
                await createTechnicianWork(payload)
                setToastType('success')
                setToastMessage('Trabajo guardado correctamente')
            }

            await loadJobs()
            resetForm()
        } catch (error) {
            console.error('Error guardando trabajo del técnico:', error)
            setToastType('error')
            setToastMessage('No se pudo guardar el trabajo')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!technician) {
        return null
    }

    return (
        <div className="technician-jobs-page">
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />

            <TechnicianHomeHeader
                technicianName={technician.name}
                technicianSurname={technician.surname}
                technicianProfileImageUrl={technician.profileImageUrl}
            />

            <main className="technician-jobs-page__main">
                <TechnicianJobsHeader />

                <TechnicianJobsToolbar
                    totalJobs={jobs.length}
                    isCreating={isCreating}
                    isEditing={isEditing}
                    onStartCreate={handleStartCreate}
                    onCancelForm={handleCancelForm}
                />

                {(isCreating || isEditing) && (
                    <TechnicianJobsForm
                        formData={formData}
                        fieldErrors={fieldErrors}
                        provinces={provinces}
                        cities={filteredCities}
                        isSubmitting={isSubmitting}
                        isEditing={isEditing}
                        onFieldChange={handleFieldChange}
                        onSubmit={handleSubmit}
                    />
                )}

                {!isCreating && !isEditing && !loadingJobs && jobs.length === 0 && (
                    <TechnicianJobsEmptyState onCreate={handleStartCreate} />
                )}

                {!loadingJobs && jobs.length > 0 && (
                    <TechnicianJobsList
                        jobs={jobs}
                        deletingJobId={isDeletingJobId}
                        onEdit={handleEditJob}
                        onDelete={handleDeleteJob}
                    />
                )}

                {(loadingFilters || loadingJobs) && (
                    <p className="technician-jobs-page__loading">
                        {loadingJobs
                            ? 'Cargando trabajos...'
                            : 'Cargando provincias y ciudades...'}
                    </p>
                )}
            </main>
        </div>
    )
}

export default TechnicianJobsPage