import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocations, getProvinces } from '../services/locationService'
import { registerClient } from '../services/clientAuthService'
import { getSectors } from '../services/sectorService'
import Toast from '../components/common/Toast'
import { mapBackendErrorToSpanish } from '../utils/errorMapper'
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

const INITIAL_FIELD_ERRORS = {
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    province: '',
    city: '',
}

function RegisterPage() {
    const navigate = useNavigate()

    const [role, setRole] = useState('client')
    const [formData, setFormData] = useState(INITIAL_FORM_DATA)
    const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS)
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

    function hasValidationErrors(errors) {
        return Object.values(errors).some((error) => error !== '')
    }

    function resetLocationFields() {
        setProvinceCode('')

        setFormData((previousData) => ({
            ...previousData,
            province: '',
            city: '',
        }))

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
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
        setFieldErrors(INITIAL_FIELD_ERRORS)

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

        if (role === 'client' && Object.hasOwn(INITIAL_FIELD_ERRORS, name)) {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                [name]: validateClientField(name, nextValue),
            }))
        }
    }

    function handlePhoneChange(event) {
        const onlyDigits = event.target.value.replace(/\D/g, '').slice(0, 9)

        setFormData((previousData) => ({
            ...previousData,
            phone: onlyDigits,
        }))

        if (role === 'client') {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                phone: validateClientField('phone', onlyDigits),
            }))
        }
    }

    function handleProvinceChange(event) {
        const selectedProvinceCode = event.target.value

        const selectedProvince = provinces.find(
            (province) => province.code === selectedProvinceCode,
        )

        setProvinceCode(selectedProvinceCode)

        const provinceLabel = selectedProvince ? selectedProvince.label : ''

        setFormData((previousData) => ({
            ...previousData,
            province: provinceLabel,
            city: '',
        }))

        if (role === 'client') {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                province: validateClientField('province', provinceLabel),
                city: '',
            }))
        }
    }

    function handleCityChange(event) {
        const selectedCityLabel = event.target.value

        setFormData((previousData) => ({
            ...previousData,
            city: selectedCityLabel,
        }))

        if (role === 'client') {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                city: validateClientField('city', selectedCityLabel),
            }))
        }
    }

    function handleBlur(event) {
        const { name, value } = event.target

        if (role !== 'client') return
        if (!Object.hasOwn(INITIAL_FIELD_ERRORS, name)) return

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            [name]: validateClientField(name, value),
        }))
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
                    const backendMessage =
                        err.response.data?.message ||
                        err.response.data?.error ||
                        err.response.data ||
                        ''

                    const translatedMessage = mapBackendErrorToSpanish(
                        typeof backendMessage === 'string' ? backendMessage : '',
                    )

                    setToastMessage(translatedMessage)
                } else if (err.request) {
                    setToastMessage('No se recibió respuesta del servidor')
                } else {
                    setToastMessage('Error al preparar la petición')
                }
            } finally {
                setSubmitting(false)
            }
        } else {
            setFormError('El registro de técnico lo haremos después')
        }
    }

    function getFieldClassName(fieldName) {
        return fieldErrors[fieldName] ? 'input-error' : ''
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
                                    <label htmlFor="sectorId">Sector</label>
                                    <select
                                        id="sectorId"
                                        name="sectorId"
                                        value={formData.sectorId}
                                        onChange={handleChange}
                                        disabled={loadingSectors}
                                    >
                                        <option value="">
                                            {loadingSectors ? 'Cargando sectores...' : 'Selecciona tu sector'}
                                        </option>

                                        {sectors.map((sector) => (
                                            <option key={sector.id} value={sector.id}>
                                                {sector.name}
                                            </option>
                                        ))}
                                    </select>
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