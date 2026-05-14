import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/common/Toast'
import { loginClient } from '../services/clientAuthService'
import { loginTechnician } from '../services/technicianAuthService'
import { mapLoginClientErrorToSpanish } from '../utils/loginClientErrorMapper'
import { mapLoginTechnicianErrorToSpanish } from '../utils/loginTechnicianErrorMapper'
import '../styles/login.css'

const INITIAL_FORM_DATA = {
    email: '',
    password: '',
}

const INITIAL_FIELD_ERRORS = {
    email: '',
    password: '',
}

function LoginPage() {
    const navigate = useNavigate()

    const [role, setRole] = useState('client')
    const [formData, setFormData] = useState(INITIAL_FORM_DATA)
    const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS)
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        if (!toastMessage) return

        const timeoutId = setTimeout(() => {
            setToastMessage('')
        }, 4000)

        return () => clearTimeout(timeoutId)
    }, [toastMessage])

    function validateRequiredField(fieldName, value) {
        switch (fieldName) {
            case 'email':
                return value.trim() ? '' : 'El email es obligatorio'
            case 'password':
                return value.trim() ? '' : 'La contraseña es obligatoria'
            default:
                return ''
        }
    }

    function validateRequiredFields(currentFormData) {
        return {
            email: validateRequiredField('email', currentFormData.email),
            password: validateRequiredField('password', currentFormData.password),
        }
    }

    function hasValidationErrors(errors) {
        return Object.values(errors).some((error) => error !== '')
    }

    function handleRoleChange(newRole) {
        setRole(newRole)
        setFormData(INITIAL_FORM_DATA)
        setFieldErrors(INITIAL_FIELD_ERRORS)
        setFormError('')
        setToastMessage('')
        setShowPassword(false)
    }

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }))

        if (fieldErrors[name]) {
            setFieldErrors((previousErrors) => ({
                ...previousErrors,
                [name]: validateRequiredField(name, value),
            }))
        }
    }

    function handleBlur(event) {
        const { name, value } = event.target

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            [name]: validateRequiredField(name, value),
        }))
    }

    function getFieldClassName(fieldName) {
        return fieldErrors[fieldName] ? 'input-error' : ''
    }

    async function handleClientLogin() {
        const credentials = {
            email: formData.email.trim(),
            password: formData.password,
        }

        const responseData = await loginClient(credentials)

        navigate('/client/home', {
            replace: true,
            state: {
                client: responseData,
            },
        })
    }

    async function handleTechnicianLogin() {
        const credentials = {
            email: formData.email.trim(),
            password: formData.password,
        }

        const responseData = await loginTechnician(credentials)

        navigate('/technician/home', {
            replace: true,
            state: {
                technician: responseData,
            },
        })
    }

    function mapLoginErrorByRole(errorData, currentRole) {
        return currentRole === 'client'
            ? mapLoginClientErrorToSpanish(errorData)
            : mapLoginTechnicianErrorToSpanish(errorData)
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setFormError('')
        setToastMessage('')

        const validationErrors = validateRequiredFields(formData)
        setFieldErrors(validationErrors)

        if (hasValidationErrors(validationErrors)) {
            setFormError('Revisa los campos obligatorios marcados en rojo')
            return
        }

        try {
            setSubmitting(true)

            if (role === 'client') {
                await handleClientLogin()
            } else {
                await handleTechnicianLogin()
            }
        } catch (err) {
            console.error(`Error en login ${role}:`, err)

            if (err.response) {
                const translatedMessage = mapLoginErrorByRole(err.response.data, role)
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
        <div className="login-page">
            <Toast
                message={toastMessage}
                type="error"
                onClose={() => setToastMessage('')}
            />

            <div className="login-card">
                <div className="login-card__header">
                    <h1 className="login-card__title">Iniciar sesión</h1>
                    <p className="login-card__subtitle">
                        Accede a tu cuenta para continuar en FastFix.
                    </p>
                </div>

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

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="login-form__field">
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
                            autoComplete="email"
                        />
                        {fieldErrors.email && (
                            <span className="field-error-text">{fieldErrors.email}</span>
                        )}
                    </div>

                    <div className="login-form__field">
                        <label htmlFor="password">
                            Contraseña <span className="required-mark">*</span>
                        </label>
                        <div className={`password-input ${getFieldClassName('password')}`}>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Introduce tu contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="current-password"
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

                    <button
                        type="submit"
                        className="login-form__submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Accediendo...' : 'Entrar'}
                    </button>

                    {formError && <p className="login-form__error">{formError}</p>}
                </form>
            </div>
        </div>
    )
}

export default LoginPage