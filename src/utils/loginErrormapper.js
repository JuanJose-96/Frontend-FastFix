export function mapLoginErrorToSpanish(errorData) {
    if (!errorData) {
        return 'No se pudo iniciar sesión'
    }

    const fieldErrors = errorData.fieldErrors || errorData.errors

    if (fieldErrors?.email) {
        const emailError = String(fieldErrors.email).toLowerCase()

        if (
            emailError.includes('well-formed email') ||
            emailError.includes('valid email') ||
            emailError.includes('invalid')
        ) {
            return 'El formato del email no es válido'
        }

        if (emailError.includes('blank') || emailError.includes('must not be blank')) {
            return 'El email es obligatorio'
        }
    }

    if (fieldErrors?.password) {
        const passwordError = String(fieldErrors.password).toLowerCase()

        if (
            passwordError.includes('blank') ||
            passwordError.includes('must not be blank')
        ) {
            return 'La contraseña es obligatoria'
        }
    }

    const message = String(errorData.message || '').toLowerCase()

    if (message.includes('client not found with email')) {
        return 'Email no encontrado'
    }

    if (message.includes('technician not found with email')) {
        return 'Email no encontrado'
    }

    if (message.includes('invalid password')) {
        return 'Contraseña incorrecta'
    }

    return 'No se pudo iniciar sesión'
}