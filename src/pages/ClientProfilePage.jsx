import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ClientHomeHeader from '../components/client-home/ClientHomeHeader'
import ClientProfileAvatar from '../components/client-profile/ClientProfileAvatar'
import ClientProfileForm from '../components/client-profile/ClientProfileForm'
import Toast from '../components/common/Toast'
import { getLocations, getProvinces } from '../services/locationService'
import {
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

    const [profileData, setProfileData] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [loadingLocations, setLoadingLocations] = useState(true)

    const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS)
    const [savingProfile, setSavingProfile] = useState(false)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [previewImageUrl, setPreviewImageUrl] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('error')

    const clientFromState = location.state?.client

    const client = useMemo(() => {
        return clientFromState || storedClient
    }, [clientFromState, storedClient])

    useEffect(() => {
        if (clientFromState) {
            saveClientSession(clientFromState)
        }
    }, [clientFromState])

    useEffect(() => {
        if (!client) {
            navigate('/login', { replace: true })
            return
        }

        setProfileData(client)
        setEditForm({
            name: client.name || '',
            surname: client.surname || '',
            phone: client.phone || '',
            province: client.province || '',
            city: client.city || '',
            whatsappAvailable: Boolean(client.whatsappAvailable),
        })
    }, [client, navigate])

    useEffect(() => {
        async function loadLocations() {
            try {
                setLoadingLocations(true)

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
                console.error('Error cargando provincias y ciudades del perfil:', error)
                setToastType('error')
                setToastMessage('No se pudieron cargar provincias y ciudades')
            } finally {
                setLoadingLocations(false)
            }
        }

        loadLocations()
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

            if (selectedImageFile) {
                finalClient = await uploadClientProfileImage(profileData.id, selectedImageFile)
            }

            setProfileData(finalClient)
            saveClientSession(finalClient)

            setEditForm({
                name: finalClient.name || '',
                surname: finalClient.surname || '',
                phone: finalClient.phone || '',
                province: finalClient.province || '',
                city: finalClient.city || '',
                whatsappAvailable: Boolean(finalClient.whatsappAvailable),
            })

            resetImageSelection()
            setIsEditing(false)
            setFieldErrors(INITIAL_FIELD_ERRORS)
            setToastType('success')
            setToastMessage('Perfil actualizado correctamente')
        } catch (error) {
            console.error('Error actualizando perfil:', error)
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
    }

    if (!profileData || !editForm) {
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
                        profileImageUrl={profileData.profileImageUrl}
                        previewImageUrl={previewImageUrl}
                        isEditing={isEditing}
                        onImageChange={handleImageChange}
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

                {loadingLocations && (
                    <p className="client-profile-page__loading">
                        Cargando provincias y ciudades...
                    </p>
                )}
            </main>
        </div>
    )
}

export default ClientProfilePage