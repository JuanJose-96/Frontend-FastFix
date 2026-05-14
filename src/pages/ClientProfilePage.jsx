import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Toast from '../components/common/Toast'
import ClientHomeHeader from '../components/client-home/ClientHomeHeader'
import ClientProfileAvatar from '../components/client-profile/ClientProfileAvatar'
import ClientProfileForm from '../components/client-profile/ClientProfileForm'
import { getLocations, getProvinces } from '../services/locationService'
import {
    deleteClientProfileImage,
    updateClientProfile,
    uploadClientProfileImage,
} from '../services/clientProfileService'
import { getClientSession, saveClientSession } from '../utils/clientSession'
import '../styles/client-profile.css'

const INITIAL_FIELD_ERRORS = {
    name: '',
    surname: '',
    phone: '',
    province: '',
    city: '',
}

function ClientProfilePage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [storedClient] = useState(() => getClientSession())
    const clientFromState = location.state?.client

    const clientSession = useMemo(() => {
        return clientFromState || storedClient
    }, [clientFromState, storedClient])

    const [profileData, setProfileData] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])
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
        if (clientFromState) {
            saveClientSession(clientFromState)
        }
    }, [clientFromState])

    useEffect(() => {
        if (!clientSession) {
            navigate('/login', { replace: true })
        }
    }, [clientSession, navigate])

    useEffect(() => {
        if (!clientSession?.id) return

        setLoadingProfile(true)

        const nextProfile = {
            id: clientSession.id,
            name: clientSession.name || '',
            surname: clientSession.surname || '',
            phone: clientSession.phone || '',
            province: clientSession.province || '',
            city: clientSession.city || '',
            whatsappAvailable: Boolean(clientSession.whatsappAvailable),
            profileImageUrl: clientSession.profileImageUrl || '',
        }

        setProfileData(nextProfile)
        setEditForm({
            name: nextProfile.name,
            surname: nextProfile.surname,
            phone: nextProfile.phone,
            province: nextProfile.province,
            city: nextProfile.city,
            whatsappAvailable: nextProfile.whatsappAvailable,
        })
        setLoadingProfile(false)
    }, [clientSession?.id, clientSession])

    useEffect(() => {
        async function loadAuxiliaryData() {
            try {
                setLoadingAuxData(true)

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
                console.error('Error cargando datos auxiliares del perfil cliente:', error)
                setToastType('error')
                setToastMessage('No se pudieron cargar provincias y ciudades')
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

            const updatedClient = await updateClientProfile(profileData.id, {
                name: editForm.name.trim(),
                surname: editForm.surname.trim(),
                phone: editForm.phone,
                province: editForm.province,
                city: editForm.city,
                whatsappAvailable: editForm.whatsappAvailable,
            })

            let finalClient = updatedClient

            if (imageMarkedForDeletion) {
                finalClient = await deleteClientProfileImage(profileData.id)
            } else if (selectedImageFile) {
                finalClient = await uploadClientProfileImage(profileData.id, selectedImageFile)
            }

            const nextProfile = {
                id: finalClient.id,
                name: finalClient.name || '',
                surname: finalClient.surname || '',
                phone: finalClient.phone || '',
                province: finalClient.province || '',
                city: finalClient.city || '',
                whatsappAvailable: Boolean(finalClient.whatsappAvailable),
                profileImageUrl: finalClient.profileImageUrl || '',
            }

            setProfileData(nextProfile)
            saveClientSession(finalClient)

            setEditForm({
                name: nextProfile.name,
                surname: nextProfile.surname,
                phone: nextProfile.phone,
                province: nextProfile.province,
                city: nextProfile.city,
                whatsappAvailable: nextProfile.whatsappAvailable,
            })

            resetImageSelection()
            setIsEditing(false)
            setFieldErrors(INITIAL_FIELD_ERRORS)
            setToastType('success')
            setToastMessage('Perfil actualizado correctamente')
        } catch (error) {
            console.error('Error actualizando perfil del cliente:', error)
            setToastType('error')
            setToastMessage('No se pudo actualizar el perfil')
        } finally {
            setSavingProfile(false)
        }
    }

    if (!clientSession || !profileData || !editForm) {
        return null
    }

    return (
        <div className="client-profile-page">
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />

            <ClientHomeHeader
                clientName={profileData.name}
                clientSurname={profileData.surname}
                clientProfileImageUrl={profileData.profileImageUrl}
            />

            <main className="client-profile-page__main">
                <div className="client-profile-page__layout">
                    <ClientProfileAvatar
                        clientName={profileData.name}
                        clientSurname={profileData.surname}
                        profileImageUrl={imageMarkedForDeletion ? '' : profileData.profileImageUrl}
                        previewImageUrl={previewImageUrl}
                        isEditing={isEditing}
                        onImageChange={handleImageChange}
                        onDeleteImage={handleDeleteImage}
                    />

                    <ClientProfileForm
                        isEditing={isEditing}
                        profileData={profileData}
                        editForm={editForm}
                        provinces={provinces}
                        cities={filteredCities}
                        fieldErrors={fieldErrors}
                        savingProfile={savingProfile}
                        onFieldChange={handleFieldChange}
                        onStartEditing={handleStartEditing}
                        onCancelEditing={handleCancelEditing}
                        onSaveProfile={handleSaveProfile}
                    />
                </div>

                {(loadingProfile || loadingAuxData) && (
                    <p className="client-profile-page__loading">
                        Cargando información del perfil...
                    </p>
                )}
            </main>
        </div>
    )
}

export default ClientProfilePage