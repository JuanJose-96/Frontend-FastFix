function buildTemporaryClientDisplay(clientId) {
    return {
        id: clientId,
        name: `Cliente #${clientId}`,
        surname: '',
        province: 'No disponible',
        city: 'No disponible',
        profileImageUrl: '',
    }
}

export async function resolveReviewClients(reviewResponses) {
    const uniqueClientIds = [...new Set(reviewResponses.map((review) => review.clientId))]

    const clientMap = {}

    uniqueClientIds.forEach((clientId) => {
        clientMap[clientId] = buildTemporaryClientDisplay(clientId)
    })

    return clientMap
}