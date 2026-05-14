import { getClientProfile } from './clientProfileService'

function buildTemporaryClientDisplay(clientId) {
    return {
        id: clientId,
        name: 'Cliente',
        surname: '',
        province: 'No disponible',
        city: 'No disponible',
        profileImageUrl: '',
    }
}

export async function resolveReviewClients(reviewResponses) {
    const uniqueClientIds = [...new Set(reviewResponses.map((review) => review.clientId))]

    const resolvedClients = await Promise.all(
        uniqueClientIds.map(async (clientId) => {
            try {
                const client = await getClientProfile(clientId)

                return [
                    clientId,
                    {
                        id: client.id,
                        name: client.name || 'Cliente',
                        surname: client.surname || '',
                        province: client.province || 'No disponible',
                        city: client.city || 'No disponible',
                        profileImageUrl: client.profileImageUrl || '',
                    },
                ]
            } catch (error) {
                console.error(`Error resolviendo cliente ${clientId} para reseña:`, error)
                return [clientId, buildTemporaryClientDisplay(clientId)]
            }
        }),
    )

    return Object.fromEntries(resolvedClients)
}