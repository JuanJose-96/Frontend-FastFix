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
    deleteTechnicianJob,
    getTechnicianJobs,
    saveTechnicianJob,
    updateTechnicianJob,
} from '../services/technicianJobsStorageService'
import '../styles/technician-jobs.css'

const INITIAL_FORM_DATA = {
    clientName: '',
    province: '',
    city: '',
    startDate: '',
    endDate: '',
    totalPrice: '',
    serviceDescription: '',
}

const INITIAL_FIELD_ERRORS = {
    clientName: '',
    province: '',
    city: '',
    startDate: '',
    endDate: '',
    totalPrice: '',
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
    const [formData, setFormData] = useState(INITIAL_FORM_DATA)
    const [editingJobId, setEditingJobId] = useState(null)
    const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS)
    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [loadingFilters, setLoadingFilters] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('error')

    const isCreating = editingJobId === null && Object.values(formData).some((value) => value !== '')
    const isEditing = editingJobId !== null

    useEffect(() => {
        if (technicianFromState) {
            localStorage.setItem('technicianSession', JSON.stringify(technicianFromState))
        }
    }, [technicianFromState])

    useEffect(() => {
        if (!technician) {
            navigate('/login', { replace: true })
            return
        }

        setJobs(getTechnicianJobs(technician.id))
    }, [technician, navigate])

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
        if (!formData.province) return []

        const selectedProvince = provinces.find(
            (province) => province.label === formData.province,
        )

        if (!selectedProvince) return []

        return allLocations
            .filter((location) => location.parent_code === selectedProvince.code)
            .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
    }, [allLocations, formData.province, provinces])

    function validateForm(currentForm) {
        const errors = {
            clientName: currentForm.clientName.trim()
                ? ''
                : 'Debes indicar el nombre del cliente',
            province: currentForm.province ? '' : 'Debes seleccionar una provincia',
            city: currentForm.city ? '' : 'Debes seleccionar una ciudad',
            startDate: currentForm.startDate ? '' : 'Debes indicar la fecha de inicio',
            endDate: currentForm.endDate ? '' : 'Debes indicar la fecha de fin',
            totalPrice: currentForm.totalPrice.trim()
                ? ''
                : 'Debes indicar el precio total',
        }

        if (
            currentForm.startDate &&
            currentForm.endDate &&
            currentForm.endDate < currentForm.startDate
        ) {
            errors.endDate = 'La fecha de fin no puede ser anterior a la de inicio'
        }

        return errors
    }

    function hasErrors(errors) {
        return Object.values(errors).some((error) => error !== '')
    }

    function resetForm() {
        setFormData(INITIAL_FORM_DATA)
        setEditingJobId(null)
        setFieldErrors(INITIAL_FIELD_ERRORS)
    }

    function handleStartCreate() {
        resetForm()
    }

    function handleCancelForm() {
        resetForm()
    }

    function handleFieldChange(event) {
        const { name, value } = event.target

        setFormData((previousForm) => {
            if (name === 'province') {
                return {
                    ...previousForm,
                    province: value,
                    city: '',
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
        setEditingJobId(job.id)
        setFormData({
            clientName: job.clientName || '',
            province: job.province || '',
            city: job.city || '',
            startDate: job.startDate || '',
            endDate: job.endDate || '',
            totalPrice: job.totalPrice || '',
            serviceDescription: job.serviceDescription || '',
        })
        setFieldErrors(INITIAL_FIELD_ERRORS)
    }

    function handleDeleteJob(jobId) {
        if (!technician?.id) return

        deleteTechnicianJob(technician.id, jobId)
        setJobs(getTechnicianJobs(technician.id))
        setToastType('success')
        setToastMessage('Trabajo eliminado correctamente')

        if (editingJobId === jobId) {
            resetForm()
        }
    }

    function handleSubmit(event) {
        event.preventDefault()

        if (!technician?.id) return

        const validationErrors = validateForm(formData)
        setFieldErrors(validationErrors)

        if (hasErrors(validationErrors)) {
            setToastType('error')
            setToastMessage('Revisa los campos marcados en rojo')
            return
        }

        try {
            setIsSubmitting(true)

            if (editingJobId) {
                updateTechnicianJob(technician.id, editingJobId, formData)
                setToastType('success')
                setToastMessage('Trabajo actualizado correctamente')
            } else {
                saveTechnicianJob(technician.id, formData)
                setToastType('success')
                setToastMessage('Trabajo guardado correctamente')
            }

            setJobs(getTechnicianJobs(technician.id))
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

                {!isCreating && !isEditing && jobs.length === 0 && (
                    <TechnicianJobsEmptyState onCreate={handleStartCreate} />
                )}

                {jobs.length > 0 && (
                    <TechnicianJobsList
                        jobs={jobs}
                        onEdit={handleEditJob}
                        onDelete={handleDeleteJob}
                    />
                )}

                {loadingFilters && (
                    <p className="technician-jobs-page__loading">
                        Cargando provincias y ciudades...
                    </p>
                )}
            </main>
        </div>
    )
}

export default TechnicianJobsPage