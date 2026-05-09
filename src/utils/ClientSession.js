const CLIENT_SESSION_KEY = 'fastfix_client_session'

export function saveClientSession(client) {
    if (!client) return

    localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(client))
}

export function getClientSession() {
    const storedClient = localStorage.getItem(CLIENT_SESSION_KEY)

    if (!storedClient) return null

    try {
        return JSON.parse(storedClient)
    } catch (error) {
        console.error('Error al leer la sesión del cliente:', error)
        localStorage.removeItem(CLIENT_SESSION_KEY)
        return null
    }
}

export function clearClientSession() {
    localStorage.removeItem(CLIENT_SESSION_KEY)
}