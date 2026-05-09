export function mapLoginClientErrorToSpanish(errorData) {
    if (!errorData) {
        return 'No se pudo iniciar sesión'
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

    if (message.includes('client not found with email')) {
        return 'Email no encontrado'
    }

    if (message.includes('invalid password')) {
        return 'Contraseña incorrecta'
    }

    return 'No se pudo iniciar sesión'
}