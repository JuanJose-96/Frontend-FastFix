import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Toast from '../components/common/Toast'
import TechnicianHomeHeader from '../components/technician-home/TechnicianHomeHeader'
import TechnicianProfileAvatar from '../components/technician-profile/TechnicianProfileAvatar'
import TechnicianProfileForm from '../components/technician-profile/TechnicianProfileForm'
import { getLocations, getProvinces } from '../services/locationService'
import { getSectors } from '../services/sectorService'
import {
    deleteTechnicianProfileImage,
    getTechnicianProfile,
    updateTechnicianProfile,
    uploadTechnicianProfileImage,
} from '../services/technicianProfileService'
import '../styles/technician-profile.css'

const INITIAL_FIELD_ERRORS = {
    name: '',
    surname: '',
    phone: '',
    province: '',
    city: '',
    sectorId: '',
}

function TechnicianProfilePage() {
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

    const technicianSession = useMemo(() => {
        return technicianFromState || storedTechnician
    }, [technicianFromState, storedTechnician])

    const [profileData, setProfileData] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [sectors, setSectors] = useState([])
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [loadingAuxData, setLoadingAuxData] = useState(true)

    const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS)
    const [savingProfile, setSavingProfile] = useState(false)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [previewImageUrl, setPreviewImageUrl] = useState('')
    const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('error')

    useEffect(() => {
        if (technicianFromState) {
            localStorage.setItem('technicianSession', JSON.stringify(technicianFromState))
        }
    }, [technicianFromState])

    useEffect(() => {
        if (!technicianSession) {
            navigate('/login', { replace: true })
        }
    }, [technicianSession, navigate])

    useEffect(() => {
        if (!technicianSession?.id) return

        async function loadTechnicianProfile() {
            try {
                setLoadingProfile(true)
                const technicianProfile = await getTechnicianProfile(technicianSession.id)

                setProfileData(technicianProfile)
                setEditForm({
                    name: technicianProfile.name || '',
                    surname: technicianProfile.surname || '',
                    phone: technicianProfile.phone || '',
                    province: technicianProfile.province || '',
                    city: technicianProfile.city || '',
                    aboutMe: technicianProfile.aboutMe || '',
                    sectorId: technicianProfile.sectorId ? String(technicianProfile.sectorId) : '',
                    priceDescription: technicianProfile.priceDescription || '',
                    emergencyAvailability: Boolean(technicianProfile.emergencyAvailability),
                    scheduleAvailability: technicianProfile.scheduleAvailability || '',
                    whatsappAvailable: Boolean(technicianProfile.whatsappAvailable),
                })

                localStorage.setItem('technicianSession', JSON.stringify(technicianProfile))
            } catch (error) {
                console.error('Error cargando el perfil del técnico:', error)
                setToastType('error')
                setToastMessage('No se pudo cargar el perfil del técnico')
            } finally {
                setLoadingProfile(false)
            }
        }

        loadTechnicianProfile()
    }, [technicianSession?.id])

    useEffect(() => {
        async function loadAuxiliaryData() {
            try {
                setLoadingAuxData(true)

                const [provincesData, locationsData, sectorsData] = await Promise.all([
                    getProvinces(),
                    getLocations(),
                    getSectors(),
                ])

                const sortedProvinces = [...provincesData].sort((a, b) =>
                    a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
                )

                setProvinces(sortedProvinces)
                setAllLocations(locationsData)
                setSectors(sectorsData)
            } catch (error) {
                console.error('Error cargando datos auxiliares del perfil técnico:', error)
                setToastType('error')
                setToastMessage('No se pudieron cargar provincias, ciudades y sectores')
            } finally {
                setLoadingAuxData(false)
            }
        }

        loadAuxiliaryData()
    }, [])

    useEffect(() => {
        if (!toastMessage) return

        const timeoutId = setTimeout(() => {
            setToastMessage('')
        }, 4000)

        return () => clearTimeout(timeoutId)
    }, [toastMessage])

    useEffect(() => {
        return () => {
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl)
            }
        }
    }, [previewImageUrl])

    const filteredCities = useMemo(() => {
        if (!editForm?.province) return []

        const selectedProvince = provinces.find(
            (province) => province.label === editForm.province,
        )

        if (!selectedProvince) return []

        return allLocations
            .filter((location) => location.parent_code === selectedProvince.code)
            .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
    }, [allLocations, editForm?.province, provinces])

    function validateForm(currentForm) {
        return {
            name: currentForm.name.trim() ? '' : 'El nombre es obligatorio',
            surname: currentForm.surname.trim() ? '' : 'Los apellidos son obligatorios',
            phone: /^\d{9}$/.test(currentForm.phone)
                ? ''
                : 'El número de teléfono debe tener 9 dígitos',
            province: currentForm.province ? '' : 'Debes seleccionar una provincia',
            city: currentForm.city ? '' : 'Debes seleccionar una ciudad',
            sectorId: currentForm.sectorId ? '' : 'Debes seleccionar un sector',
        }
    }

    function hasErrors(errors) {
        return Object.values(errors).some((error) => error !== '')
    }

    function resetImageSelection() {
        if (previewImageUrl) {
            URL.revokeObjectURL(previewImageUrl)
        }

        setSelectedImageFile(null)
        setPreviewImageUrl('')
        setImageMarkedForDeletion(false)
    }

    function handleStartEditing() {
        if (!profileData) return

        setEditForm({
            name: profileData.name || '',
            surname: profileData.surname || '',
            phone: profileData.phone || '',
            province: profileData.province || '',
            city: profileData.city || '',
            aboutMe: profileData.aboutMe || '',
            sectorId: profileData.sectorId ? String(profileData.sectorId) : '',
            priceDescription: profileData.priceDescription || '',
            emergencyAvailability: Boolean(profileData.emergencyAvailability),
            scheduleAvailability: profileData.scheduleAvailability || '',
            whatsappAvailable: Boolean(profileData.whatsappAvailable),
        })

        setFieldErrors(INITIAL_FIELD_ERRORS)
        resetImageSelection()
        setIsEditing(true)
    }

    function handleCancelEditing() {
        if (!profileData) return

        setEditForm({
            name: profileData.name || '',
            surname: profileData.surname || '',
            phone: profileData.phone || '',
            province: profileData.province || '',
            city: profileData.city || '',
            aboutMe: profileData.aboutMe || '',
            sectorId: profileData.sectorId ? String(profileData.sectorId) : '',
            priceDescription: profileData.priceDescription || '',
            emergencyAvailability: Boolean(profileData.emergencyAvailability),
            scheduleAvailability: profileData.scheduleAvailability || '',
            whatsappAvailable: Boolean(profileData.whatsappAvailable),
        })

        setFieldErrors(INITIAL_FIELD_ERRORS)
        resetImageSelection()
        setIsEditing(false)
    }

    function handleFieldChange(event) {
        const { name, value, type, checked } = event.target

        setEditForm((previousForm) => {
            if (!previousForm) return previousForm

            if (name === 'province') {
                return {
                    ...previousForm,
                    province: value,
                    city: '',
                }
            }

            if (name === 'phone') {
                return {
                    ...previousForm,
                    phone: value.replace(/\D/g, '').slice(0, 9),
                }
            }

            return {
                ...previousForm,
                [name]: type === 'checkbox' ? checked : value,
            }
        })

        if (fieldErrors[name]) {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                [name]: '',
            }))
        }
    }

    async function handleSaveProfile() {
        if (!profileData || !editForm) return

        const validationErrors = validateForm(editForm)
        setFieldErrors(validationErrors)

        if (hasErrors(validationErrors)) {
            setToastType('error')
            setToastMessage('Revisa los campos marcados en rojo')
            return
        }

        try {
            setSavingProfile(true)

            const updatedTechnician = await updateTechnicianProfile(profileData.id, {
                name: editForm.name.trim(),
                surname: editForm.surname.trim(),
                phone: editForm.phone,
                province: editForm.province,
                city: editForm.city,
                aboutMe: editForm.aboutMe.trim(),
                sectorId: Number(editForm.sectorId),
                priceDescription: editForm.priceDescription.trim(),
                emergencyAvailability: editForm.emergencyAvailability,
                scheduleAvailability: editForm.scheduleAvailability.trim(),
                whatsappAvailable: editForm.whatsappAvailable,
            })

            let finalTechnician = updatedTechnician

            if (imageMarkedForDeletion) {
                finalTechnician = await deleteTechnicianProfileImage(profileData.id)
            } else if (selectedImageFile) {
                finalTechnician = await uploadTechnicianProfileImage(
                    profileData.id,
                    selectedImageFile,
                )
            }

            setProfileData(finalTechnician)
            localStorage.setItem('technicianSession', JSON.stringify(finalTechnician))

            setEditForm({
                name: finalTechnician.name || '',
                surname: finalTechnician.surname || '',
                phone: finalTechnician.phone || '',
                province: finalTechnician.province || '',
                city: finalTechnician.city || '',
                aboutMe: finalTechnician.aboutMe || '',
                sectorId: finalTechnician.sectorId ? String(finalTechnician.sectorId) : '',
                priceDescription: finalTechnician.priceDescription || '',
                emergencyAvailability: Boolean(finalTechnician.emergencyAvailability),
                scheduleAvailability: finalTechnician.scheduleAvailability || '',
                whatsappAvailable: Boolean(finalTechnician.whatsappAvailable),
            })

            resetImageSelection()
            setIsEditing(false)
            setFieldErrors(INITIAL_FIELD_ERRORS)
            setToastType('success')
            setToastMessage('Perfil actualizado correctamente')
        } catch (error) {
            console.error('Error actualizando perfil del técnico:', error)
            setToastType('error')
            setToastMessage('No se pudo actualizar el perfil')
        } finally {
            setSavingProfile(false)
        }
    }

    function handleImageChange(event) {
        const file = event.target.files?.[0] || null
        if (!file) return

        if (previewImageUrl) {
            URL.revokeObjectURL(previewImageUrl)
        }

        setSelectedImageFile(file)
        setPreviewImageUrl(URL.createObjectURL(file))
        setImageMarkedForDeletion(false)
    }

    function handleDeleteImage() {
        if (!profileData?.profileImageUrl && !previewImageUrl) return

        if (previewImageUrl) {
            URL.revokeObjectURL(previewImageUrl)
        }

        setSelectedImageFile(null)
        setPreviewImageUrl('')
        setImageMarkedForDeletion(true)
    }

    if (!technicianSession || !profileData || !editForm) {
        return null
    }

    return (
        <div className="technician-profile-page">
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />

            <TechnicianHomeHeader
                technicianName={profileData.name}
                technicianSurname={profileData.surname}
                technicianProfileImageUrl={profileData.profileImageUrl}
            />

            <main className="technician-profile-page__main">
                <div className="technician-profile-page__layout">
                    <TechnicianProfileAvatar
                        technicianName={profileData.name}
                        technicianSurname={profileData.surname}
                        profileImageUrl={imageMarkedForDeletion ? '' : profileData.profileImageUrl}
                        previewImageUrl={previewImageUrl}
                        isEditing={isEditing}
                        onImageChange={handleImageChange}
                        onDeleteImage={handleDeleteImage}
                    />

                    <TechnicianProfileForm
                        isEditing={isEditing}
                        profileData={profileData}
                        editForm={editForm}
                        provinces={provinces}
                        cities={filteredCities}
                        sectors={sectors}
                        fieldErrors={fieldErrors}
                        savingProfile={savingProfile}
                        onFieldChange={handleFieldChange}
                        onStartEditing={handleStartEditing}
                        onCancelEditing={handleCancelEditing}
                        onSaveProfile={handleSaveProfile}
                    />
                </div>

                {(loadingProfile || loadingAuxData) && (
                    <p className="technician-profile-page__loading">
                        Cargando información del perfil...
                    </p>
                )}
            </main>
        </div>
    )
}

export default TechnicianProfilePage