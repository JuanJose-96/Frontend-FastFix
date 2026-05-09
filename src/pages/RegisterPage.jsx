import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/common/Toast'
import { getLocations, getProvinces } from '../services/locationService'
import { registerClient } from '../services/clientAuthService'
import { registerTechnician } from '../services/technicianAuthService'
import { getSectors } from '../services/sectorService'
import { mapRegisterClientErrorToSpanish } from '../utils/registerClientErrorMapper'
import { mapRegisterTechnicianErrorToSpanish } from '../utils/registerTechnicianErrorMapper'
import '../styles/register.css'

const INITIAL_FORM_DATA = {
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    province: '',
    city: '',
    aboutMe: '',
    sectorId: '',
    priceDescription: '',
    emergencyAvailability: false,
    scheduleAvailability: '',
}

const INITIAL_CLIENT_FIELD_ERRORS = {
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    province: '',
    city: '',
}

const INITIAL_TECHNICIAN_FIELD_ERRORS = {
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    province: '',
    city: '',
    sectorId: '',
}

function RegisterPage() {
    const navigate = useNavigate()

    const [role, setRole] = useState('client')
    const [formData, setFormData] = useState(INITIAL_FORM_DATA)
    const [fieldErrors, setFieldErrors] = useState(INITIAL_CLIENT_FIELD_ERRORS)
    const [provinceCode, setProvinceCode] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [sectors, setSectors] = useState([])

    const [loadingLocations, setLoadingLocations] = useState(true)
    const [loadingSectors, setLoadingSectors] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [locationError, setLocationError] = useState('')
    const [formError, setFormError] = useState('')
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        async function loadLocationsData() {
            try {
                setLoadingLocations(true)
                setLocationError('')

                const provincesData = await getProvinces()
                const locationsData = await getLocations()

                setProvinces(provincesData)
                setAllLocations(locationsData)
            } catch (err) {
                console.error('Error cargando provincias o poblaciones:', err)
                setLocationError('No se pudieron cargar las provincias y ciudades')
            } finally {
                setLoadingLocations(false)
            }
        }

        async function loadSectorsData() {
            try {
                setLoadingSectors(true)
                const sectorsData = await getSectors()
                setSectors(sectorsData)
            } catch (err) {
                console.error('Error cargando sectores:', err)
            } finally {
                setLoadingSectors(false)
            }
        }

        loadLocationsData()
        loadSectorsData()
    }, [])

    useEffect(() => {
        if (!toastMessage) return

        const timeoutId = setTimeout(() => {
            setToastMessage('')
        }, 4000)

        return () => clearTimeout(timeoutId)
    }, [toastMessage])

    const sortedProvinces = useMemo(() => {
        return [...provinces].sort((a, b) =>
            a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
        )
    }, [provinces])

    const filteredCities = useMemo(() => {
        if (!provinceCode) return []

        return allLocations
            .filter((location) => location.parent_code === provinceCode)
            .sort((a, b) =>
                a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
            )
    }, [allLocations, provinceCode])

    function validateClientField(fieldName, value) {
        switch (fieldName) {
            case 'name':
                return value.trim() ? '' : 'El nombre es obligatorio'
            case 'surname':
                return value.trim() ? '' : 'Los apellidos son obligatorios'
            case 'email':
                return value.trim() ? '' : 'El email es obligatorio'
            case 'password':
                return value.trim() ? '' : 'La contraseña es obligatoria'
            case 'phone':
                if (!value.trim()) return 'El número de teléfono es obligatorio'
                if (value.length !== 9) return 'El número de teléfono debe tener 9 dígitos'
                return ''
            case 'province':
                return value.trim() ? '' : 'Debes seleccionar una provincia'
            case 'city':
                return value.trim() ? '' : 'Debes seleccionar una ciudad'
            default:
                return ''
        }
    }

    function validateTechnicianField(fieldName, value) {
        switch (fieldName) {
            case 'name':
                return value.trim() ? '' : 'El nombre es obligatorio'
            case 'surname':
                return value.trim() ? '' : 'Los apellidos son obligatorios'
            case 'email':
                return value.trim() ? '' : 'El email es obligatorio'
            case 'password':
                if (!value.trim()) return 'La contraseña es obligatoria'
                if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
                return ''
            case 'phone':
                if (!value.trim()) return 'El número de teléfono es obligatorio'
                if (value.length !== 9) return 'El número de teléfono debe tener 9 dígitos'
                return ''
            case 'province':
                return value.trim() ? '' : 'Debes seleccionar una provincia'
            case 'city':
                return value.trim() ? '' : 'Debes seleccionar una ciudad'
            case 'sectorId':
                return value ? '' : 'Debes seleccionar un sector'
            default:
                return ''
        }
    }

    function validateClientForm(currentFormData) {
        return {
            name: validateClientField('name', currentFormData.name),
            surname: validateClientField('surname', currentFormData.surname),
            email: validateClientField('email', currentFormData.email),
            password: validateClientField('password', currentFormData.password),
            phone: validateClientField('phone', currentFormData.phone),
            province: validateClientField('province', currentFormData.province),
            city: validateClientField('city', currentFormData.city),
        }
    }

    function validateTechnicianForm(currentFormData) {
        return {
            name: validateTechnicianField('name', currentFormData.name),
            surname: validateTechnicianField('surname', currentFormData.surname),
            email: validateTechnicianField('email', currentFormData.email),
            password: validateTechnicianField('password', currentFormData.password),
            phone: validateTechnicianField('phone', currentFormData.phone),
            province: validateTechnicianField('province', currentFormData.province),
            city: validateTechnicianField('city', currentFormData.city),
            sectorId: validateTechnicianField('sectorId', currentFormData.sectorId),
        }
    }

    function hasValidationErrors(errors) {
        return Object.values(errors).some((error) => error !== '')
    }

    function getInitialErrorsByRole(newRole) {
        return newRole === 'client'
            ? INITIAL_CLIENT_FIELD_ERRORS
            : INITIAL_TECHNICIAN_FIELD_ERRORS
    }

    function resetLocationFields() {
        setProvinceCode('')

        setFormData((previousData) => ({
            ...previousData,
            province: '',
            city: '',
        }))
    }

    function resetRoleSpecificFields() {
        setFormData((previousData) => ({
            ...previousData,
            aboutMe: '',
            sectorId: '',
            priceDescription: '',
            emergencyAvailability: false,
            scheduleAvailability: '',
        }))
    }

    function handleRoleChange(newRole) {
        setRole(newRole)
        setFormError('')
        setToastMessage('')
        setShowPassword(false)
        setFieldErrors(getInitialErrorsByRole(newRole))

        resetLocationFields()
        resetRoleSpecificFields()
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target
        const nextValue = type === 'checkbox' ? checked : value

        setFormData((previousData) => ({
            ...previousData,
            [name]: nextValue,
        }))

        if (fieldErrors[name] !== undefined) {
            const nextError =
                role === 'client'
                    ? validateClientField(name, nextValue)
                    : validateTechnicianField(name, nextValue)

            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                [name]: nextError,
            }))
        }
    }

    function handlePhoneChange(event) {
        const onlyDigits = event.target.value.replace(/\D/g, '').slice(0, 9)

        setFormData((previousData) => ({
            ...previousData,
            phone: onlyDigits,
        }))

        const phoneError =
            role === 'client'
                ? validateClientField('phone', onlyDigits)
                : validateTechnicianField('phone', onlyDigits)

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            phone: phoneError,
        }))
    }

    function handleProvinceChange(event) {
        const selectedProvinceCode = event.target.value

        const selectedProvince = provinces.find(
            (province) => province.code === selectedProvinceCode,
        )

        const provinceLabel = selectedProvince ? selectedProvince.label : ''

        setProvinceCode(selectedProvinceCode)

        setFormData((previousData) => ({
            ...previousData,
            province: provinceLabel,
            city: '',
        }))

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            province:
                role === 'client'
                    ? validateClientField('province', provinceLabel)
                    : validateTechnicianField('province', provinceLabel),
            city: '',
        }))
    }

    function handleCityChange(event) {
        const selectedCityLabel = event.target.value

        setFormData((previousData) => ({
            ...previousData,
            city: selectedCityLabel,
        }))

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            city:
                role === 'client'
                    ? validateClientField('city', selectedCityLabel)
                    : validateTechnicianField('city', selectedCityLabel),
        }))
    }

    function handleBlur(event) {
        const { name, value } = event.target

        if (fieldErrors[name] === undefined) return

        const nextError =
            role === 'client'
                ? validateClientField(name, value)
                : validateTechnicianField(name, value)

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            [name]: nextError,
        }))
    }

    function getFieldClassName(fieldName) {
        return fieldErrors[fieldName] ? 'input-error' : ''
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setFormError('')
        setToastMessage('')

        if (role === 'client') {
            const validationErrors = validateClientForm(formData)
            setFieldErrors(validationErrors)

            if (hasValidationErrors(validationErrors)) {
                setFormError('Revisa los campos obligatorios marcados en rojo')
                return
            }

            const clientPayload = {
                name: formData.name.trim(),
                surname: formData.surname.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phone: formData.phone,
                province: formData.province,
                city: formData.city,
            }

            try {
                setSubmitting(true)

                const responseData = await registerClient(clientPayload)

                navigate('/client/home', {
                    replace: true,
                    state: {
                        client: responseData,
                    },
                })
            } catch (err) {
                console.error('Error en registro cliente:', err)

                if (err.response) {
                    const translatedMessage = mapRegisterClientErrorToSpanish(err.response.data)
                    setToastMessage(translatedMessage)
                } else if (err.request) {
                    setToastMessage('No se recibió respuesta del servidor')
                } else {
                    setToastMessage('Error al preparar la petición')
                }
            } finally {
                setSubmitting(false)
            }

            return
        }

        const validationErrors = validateTechnicianForm(formData)
        setFieldErrors(validationErrors)

        if (hasValidationErrors(validationErrors)) {
            setFormError('Revisa los campos obligatorios marcados en rojo')
            return
        }

        const technicianPayload = {
            name: formData.name.trim(),
            surname: formData.surname.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone,
            province: formData.province,
            city: formData.city,
            aboutMe: formData.aboutMe.trim() || null,
            sectorId: Number(formData.sectorId),
            priceDescription: formData.priceDescription.trim() || null,
            emergencyAvailability: formData.emergencyAvailability,
            scheduleAvailability: formData.scheduleAvailability.trim() || null,
        }

        try {
            setSubmitting(true)

            const responseData = await registerTechnician(technicianPayload)

            navigate('/technician/home', {
                replace: true,
                state: {
                    technician: responseData,
                },
            })
        } catch (err) {
            console.error('Error en registro técnico:', err)

            if (err.response) {
                const translatedMessage = mapRegisterTechnicianErrorToSpanish(err.response.data)
                setToastMessage(translatedMessage)
            } else if (err.request) {
                setToastMessage('No se recibió respuesta del servidor')
            } else {
                setToastMessage('Error al preparar la petición')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="register-page">
            <Toast
                message={toastMessage}
                type="error"
                onClose={() => setToastMessage('')}
            />

            <div className="register-card">
                <h1 className="register-card__title">Crear cuenta</h1>

                <div className="role-selector">
                    <button
                        type="button"
                        className={`role-selector__button ${role === 'client' ? 'role-selector__button--active' : ''
                            }`}
                        onClick={() => handleRoleChange('client')}
                    >
                        Soy cliente
                    </button>

                    <button
                        type="button"
                        className={`role-selector__button ${role === 'technician' ? 'role-selector__button--active' : ''
                            }`}
                        onClick={() => handleRoleChange('technician')}
                    >
                        Soy técnico
                    </button>
                </div>

                {locationError && <p className="register-form__error">{locationError}</p>}

                <form className="register-form" onSubmit={handleSubmit} noValidate>
                    <div className="register-grid">
                        <div className="register-form__field">
                            <label htmlFor="name">
                                Nombre <span className="required-mark">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Introduce tu nombre"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getFieldClassName('name')}
                            />
                            {fieldErrors.name && (
                                <span className="field-error-text">{fieldErrors.name}</span>
                            )}
                        </div>

                        <div className="register-form__field">
                            <label htmlFor="surname">
                                Apellidos <span className="required-mark">*</span>
                            </label>
                            <input
                                id="surname"
                                name="surname"
                                type="text"
                                placeholder="Introduce tus apellidos"
                                value={formData.surname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getFieldClassName('surname')}
                            />
                            {fieldErrors.surname && (
                                <span className="field-error-text">{fieldErrors.surname}</span>
                            )}
                        </div>

                        <div className="register-form__field">
                            <label htmlFor="email">
                                Email <span className="required-mark">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Introduce tu email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getFieldClassName('email')}
                            />
                            {fieldErrors.email && (
                                <span className="field-error-text">{fieldErrors.email}</span>
                            )}
                        </div>

                        <div className="register-form__field">
                            <label htmlFor="phone">
                                Número de teléfono <span className="required-mark">*</span>
                            </label>
                            <div className={`phone-input ${getFieldClassName('phone')}`}>
                                <span className="phone-input__prefix">+34</span>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="600123123"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {fieldErrors.phone && (
                                <span className="field-error-text">{fieldErrors.phone}</span>
                            )}
                        </div>

                        <div className="register-form__field register-form__field--full">
                            <label htmlFor="password">
                                Contraseña <span className="required-mark">*</span>
                            </label>
                            <div className={`password-input ${getFieldClassName('password')}`}>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Crea una contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <button
                                    type="button"
                                    className="password-input__toggle"
                                    onClick={() => setShowPassword((previous) => !previous)}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? '🙈' : '👁'}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <span className="field-error-text">{fieldErrors.password}</span>
                            )}
                        </div>

                        <div className="register-form__field">
                            <label htmlFor="province">
                                Provincia <span className="required-mark">*</span>
                            </label>
                            <select
                                id="province"
                                name="province"
                                value={provinceCode}
                                onChange={handleProvinceChange}
                                onBlur={() =>
                                    handleBlur({
                                        target: {
                                            name: 'province',
                                            value: formData.province,
                                        },
                                    })
                                }
                                disabled={loadingLocations}
                                className={getFieldClassName('province')}
                            >
                                <option value="">
                                    {loadingLocations ? 'Cargando provincias...' : 'Selecciona tu provincia'}
                                </option>

                                {sortedProvinces.map((province) => (
                                    <option key={province.code} value={province.code}>
                                        {province.label}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.province && (
                                <span className="field-error-text">{fieldErrors.province}</span>
                            )}
                        </div>

                        <div className="register-form__field">
                            <label htmlFor="city">
                                Ciudad <span className="required-mark">*</span>
                            </label>
                            <select
                                key={provinceCode || 'city-select-empty'}
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleCityChange}
                                onBlur={() =>
                                    handleBlur({
                                        target: {
                                            name: 'city',
                                            value: formData.city,
                                        },
                                    })
                                }
                                disabled={!provinceCode || loadingLocations}
                                className={getFieldClassName('city')}
                            >
                                <option value="">
                                    {!provinceCode
                                        ? 'Selecciona primero una provincia'
                                        : 'Selecciona tu ciudad'}
                                </option>

                                {filteredCities.map((city) => (
                                    <option key={`${city.parent_code}-${city.code}`} value={city.label}>
                                        {city.label}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.city && (
                                <span className="field-error-text">{fieldErrors.city}</span>
                            )}
                        </div>

                        {role === 'technician' && (
                            <>
                                <div className="register-form__field register-form__field--full">
                                    <label htmlFor="sectorId">
                                        Sector <span className="required-mark">*</span>
                                    </label>
                                    <select
                                        id="sectorId"
                                        name="sectorId"
                                        value={formData.sectorId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={loadingSectors}
                                        className={getFieldClassName('sectorId')}
                                    >
                                        <option value="">
                                            {loadingSectors ? 'Cargando sectores...' : 'Selecciona tu sector'}
                                        </option>

                                        {sectors.map((sector) => (
                                            <option key={sector.id} value={String(sector.id)}>
                                                {sector.name}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.sectorId && (
                                        <span className="field-error-text">{fieldErrors.sectorId}</span>
                                    )}
                                </div>

                                <div className="register-form__field register-form__field--full">
                                    <label htmlFor="aboutMe">
                                        Sobre mí <span className="optional-text">(opcional)</span>
                                    </label>
                                    <textarea
                                        id="aboutMe"
                                        name="aboutMe"
                                        placeholder="Cuéntanos algo sobre tu experiencia"
                                        value={formData.aboutMe}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>

                                <div className="register-form__field register-form__field--full">
                                    <label htmlFor="priceDescription">
                                        Descripción de precios <span className="optional-text">(opcional)</span>
                                    </label>
                                    <input
                                        id="priceDescription"
                                        name="priceDescription"
                                        type="text"
                                        placeholder="Ejemplo: Desde 30€ por servicio"
                                        value={formData.priceDescription}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="register-form__field register-form__field--full">
                                    <label htmlFor="scheduleAvailability">
                                        Disponibilidad horaria <span className="optional-text">(opcional)</span>
                                    </label>
                                    <input
                                        id="scheduleAvailability"
                                        name="scheduleAvailability"
                                        type="text"
                                        placeholder="Ejemplo: Lunes a viernes de 9:00 a 18:00"
                                        value={formData.scheduleAvailability}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="register-form__field register-form__field--full register-form__checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="emergencyAvailability"
                                            checked={formData.emergencyAvailability}
                                            onChange={handleChange}
                                        />
                                        Disponible para urgencias <span className="optional-text">(opcional)</span>
                                    </label>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="register-form__submit"
                        disabled={submitting || loadingLocations}
                    >
                        {submitting
                            ? 'Registrando...'
                            : `Crear cuenta como ${role === 'client' ? 'cliente' : 'técnico'}`}
                    </button>

                    {formError && <p className="register-form__error">{formError}</p>}
                </form>
            </div>
        </div>
    )
}

export default RegisterPage
