export function mapRegisterTechnicianErrorToSpanish(errorData) {
    if (!errorData) {
        return 'No se pudo completar el registro'
    }

    const fieldErrors = errorData.fields || errorData.fieldErrors || errorData.errors || {}

    if (fieldErrors.email) {
        const emailError = String(fieldErrors.email).toLowerCase()

        if (
            emailError.includes('format is not valid') ||
            emailError.includes('well-formed email') ||
            emailError.includes('invalid email') ||
            emailError.includes('valid email')
        ) {
            return 'El formato del email no es válido'
        }
    }

    const message = String(errorData.message || '').toLowerCase()

    if (message.includes('email already exists')) {
        return 'El email introducido ya existe'
    }

    return 'No se pudo completar el registro'
}