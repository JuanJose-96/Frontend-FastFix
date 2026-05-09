export function mapBackendErrorToSpanish(rawMessage) {
    if (!rawMessage) {
        return 'Se produjo un error inesperado'
    }

    const message = rawMessage.toLowerCase()

    if (
        message.includes('email already exists') ||
        message.includes('email already registered') ||
        message.includes('client with this email already exists') ||
        message.includes('technician with this email already exists') ||
        message.includes('duplicate') ||
        message.includes('unique constraint') ||
        message.includes('could not execute statement')
    ) {
        return 'Ya existe una cuenta con ese email'
    }

    if (
        message.includes('invalid email') ||
        message.includes('must be a well-formed email address')
    ) {
        return 'El formato del email no es válido'
    }

    if (
        message.includes('password') &&
        message.includes('blank')
    ) {
        return 'La contraseña es obligatoria'
    }

    if (
        message.includes('name') &&
        message.includes('blank')
    ) {
        return 'El nombre es obligatorio'
    }

    if (
        message.includes('surname') &&
        message.includes('blank')
    ) {
        return 'Los apellidos son obligatorios'
    }

    if (
        message.includes('phone') &&
        message.includes('blank')
    ) {
        return 'El número de teléfono es obligatorio'
    }

    if (
        message.includes('province') &&
        message.includes('blank')
    ) {
        return 'La provincia es obligatoria'
    }

    if (
        message.includes('city') &&
        message.includes('blank')
    ) {
        return 'La ciudad es obligatoria'
    }

    return 'No se pudo completar el registro'
}
