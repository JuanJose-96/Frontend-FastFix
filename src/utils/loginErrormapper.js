export function mapLoginErrorToSpanish(rawMessage) {
    if (!rawMessage) {
        return 'No se pudo iniciar sesión'
    }

    const message = rawMessage.toLowerCase()

    if (
        message.includes('invalid credentials') ||
        message.includes('bad credentials') ||
        message.includes('wrong credentials') ||
        message.includes('incorrect credentials') ||
        message.includes('email or password is incorrect') ||
        message.includes('user not found') ||
        message.includes('invalid password')
    ) {
        return 'Email o contraseña incorrectos'
    }

    if (
        message.includes('email') &&
        message.includes('blank')
    ) {
        return 'El email es obligatorio'
    }

    if (
        message.includes('password') &&
        message.includes('blank')
    ) {
        return 'La contraseña es obligatoria'
    }

    if (
        message.includes('invalid email') ||
        message.includes('must be a well-formed email address')
    ) {
        return 'El formato del email no es válido'
    }

    return 'No se pudo iniciar sesión'
}
