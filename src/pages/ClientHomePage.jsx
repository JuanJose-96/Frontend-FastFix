import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ClientHomeHeader from '../components/client-home/ClientHomeHeader'
import ClientHomeHero from '../components/client-home/ClientHomeHero'
import TechnicianSection from '../components/client-home/TechnicianSection'
import { getLocations, getProvinces } from '../services/locationService'
import { getSectors } from '../services/sectorService'
import { searchTechnicians } from '../services/technicianSearchService'
import { getClientSession, saveClientSession } from '../utils/clientSession'
import '../styles/client-home.css'

const MAX_TECHNICIANS_PER_SECTION = 16
const HOME_ROWS_REFRESH_INTERVAL_MS = 10000

const INITIAL_QUICK_SEARCH_FILTERS = {
    sectorId: '',
    province: '',
    city: '',
}

function ClientHomePage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [storedClient] = useState(() => getClientSession())

    const [topRatedTechnicians, setTopRatedTechnicians] = useState([])
    const [nearbyTechnicians, setNearbyTechnicians] = useState([])
    const [emergencyTechnicians, setEmergencyTechnicians] = useState([])
    const [loadingHome, setLoadingHome] = useState(true)
    const [homeError, setHomeError] = useState('')

    const [quickSearchFilters, setQuickSearchFilters] = useState(
        INITIAL_QUICK_SEARCH_FILTERS,
    )
    const [sectors, setSectors] = useState([])
    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [loadingSearchBar, setLoadingSearchBar] = useState(true)

    const clientFromState = location.state?.client

    const client = useMemo(() => {
        return clientFromState || storedClient
    }, [clientFromState, storedClient])

    useEffect(() => {
        if (clientFromState) {
            saveClientSession(clientFromState)
        }
    }, [clientFromState])

    useEffect(() => {
        if (!client) {
            navigate('/login', { replace: true })
        }
    }, [client, navigate])

    useEffect(() => {
        if (!client) return

        async function loadQuickSearchData() {
            try {
                setLoadingSearchBar(true)

                const [sectorsData, provincesData, locationsData] = await Promise.all([
                    getSectors(),
                    getProvinces(),
                    getLocations(),
                ])

                const sortedProvinces = [...provincesData].sort((a, b) =>
                    a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
                )

                setSectors(sectorsData)
                setProvinces(sortedProvinces)
                setAllLocations(locationsData)

                setQuickSearchFilters({
                    sectorId: '',
                    province: client.province || '',
                    city: client.city || '',
                })
            } catch (error) {
                console.error('Error cargando datos de la búsqueda rápida:', error)
            } finally {
                setLoadingSearchBar(false)
            }
        }

        loadQuickSearchData()
    }, [client])

    const filteredQuickSearchCities = useMemo(() => {
        if (!quickSearchFilters.province) return []

        const selectedProvince = provinces.find(
            (province) => province.label === quickSearchFilters.province,
        )

        if (!selectedProvince) return []

        return allLocations
            .filter((location) => location.parent_code === selectedProvince.code)
            .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
    }, [allLocations, quickSearchFilters.province, provinces])

    function handleQuickSearchFilterChange(event) {
        const { name, value } = event.target

        setQuickSearchFilters((previousFilters) => {
            if (name === 'province') {
                return {
                    ...previousFilters,
                    province: value,
                    city: '',
                }
            }

            return {
                ...previousFilters,
                [name]: value,
            }
        })
    }

    function handleQuickSearch() {
        const params = new URLSearchParams()

        if (quickSearchFilters.sectorId) {
            params.set('sectorId', quickSearchFilters.sectorId)
        }

        if (quickSearchFilters.province) {
            params.set('province', quickSearchFilters.province)
        }

        if (quickSearchFilters.city) {
            params.set('city', quickSearchFilters.city)
        }

        navigate(`/client/explore?${params.toString()}`)
    }

    function getUniqueTechnicians(technicians) {
        const seenIds = new Set()

        return technicians.filter((technician) => {
            const uniqueKey =
                technician.id ?? `${technician.email}-${technician.name}-${technician.surname}`

            if (seenIds.has(uniqueKey)) {
                return false
            }

            seenIds.add(uniqueKey)
            return true
        })
    }

    const loadHomeRows = useCallback(async (showInitialLoader = false) => {
        if (!client) return

        try {
            if (showInitialLoader) {
                setLoadingHome(true)
            }

            setHomeError('')

            const [
                provinceTechniciansResponse,
                topRatedTechniciansResponse,
            ] = await Promise.all([
                searchTechnicians({
                    province: client.province || undefined,
                }),
                searchTechnicians({
                    rating: 4,
                }),
            ])

            const uniqueProvinceTechnicians = getUniqueTechnicians(provinceTechniciansResponse)
            const uniqueTopRatedTechnicians = getUniqueTechnicians(topRatedTechniciansResponse)

            const sameProvinceTechnicians = uniqueProvinceTechnicians
                .slice(0, MAX_TECHNICIANS_PER_SECTION)

            const emergencyProvinceTechnicians = uniqueProvinceTechnicians
                .filter((technician) => technician.emergencyAvailability)
                .slice(0, MAX_TECHNICIANS_PER_SECTION)

            const sortedTopRated = [...uniqueTopRatedTechnicians]
                .filter((technician) => Number(technician.averageRating || 0) >= 4)
                .sort((a, b) => {
                    const ratingDifference =
                        Number(b.averageRating || 0) - Number(a.averageRating || 0)

                    if (ratingDifference !== 0) {
                        return ratingDifference
                    }

                    const nameA = `${a.name || ''} ${a.surname || ''}`.trim().toLowerCase()
                    const nameB = `${b.name || ''} ${b.surname || ''}`.trim().toLowerCase()

                    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' })
                })
                .slice(0, MAX_TECHNICIANS_PER_SECTION)

            setNearbyTechnicians(sameProvinceTechnicians)
            setTopRatedTechnicians(sortedTopRated)
            setEmergencyTechnicians(emergencyProvinceTechnicians)
        } catch (error) {
            console.error('Error cargando la home del cliente:', error)
            setHomeError('No se pudo cargar la información principal')
        } finally {
            if (showInitialLoader) {
                setLoadingHome(false)
            }
        }
    }, [client])

    useEffect(() => {
        if (!client) return

        loadHomeRows(true)

        const intervalId = window.setInterval(() => {
            loadHomeRows(false)
        }, HOME_ROWS_REFRESH_INTERVAL_MS)

        return () => window.clearInterval(intervalId)
    }, [client, loadHomeRows])

    if (!client) {
        return null
    }

    return (
        <div className="client-home">
            <ClientHomeHeader
                clientName={client.name}
                clientSurname={client.surname}
                clientProfileImageUrl={client.profileImageUrl}
            />

            <main className="client-home__main">
                <ClientHomeHero
                    client={client}
                    searchFilters={quickSearchFilters}
                    sectors={sectors}
                    provinces={provinces}
                    cities={filteredQuickSearchCities}
                    loadingSearchBar={loadingSearchBar}
                    onSearchFilterChange={handleQuickSearchFilterChange}
                    onQuickSearch={handleQuickSearch}
                />

                {homeError && <p className="client-home__error">{homeError}</p>}

                {!loadingHome && (
                    <>
                        <TechnicianSection
                            title="Técnicos cerca de ti"
                            description="Mostramos hasta 16 técnicos de tu misma provincia."
                            technicians={nearbyTechnicians}
                            emptyMessage="No hay técnicos disponibles todavía en tu provincia."
                        />

                        <TechnicianSection
                            title="Mejor valorados"
                            description="Mostramos hasta 16 técnicos con valoración media igual o superior a 4, en bloques de cuatro."
                            technicians={topRatedTechnicians}
                            emptyMessage="Todavía no hay suficientes técnicos con valoración igual o superior a 4."
                        />

                        <TechnicianSection
                            title="Urgencias en tu provincia"
                            description="Mostramos hasta 16 técnicos de tu provincia que aceptan servicios urgentes."
                            technicians={emergencyTechnicians}
                            emptyMessage="No hay técnicos con servicio de urgencias disponibles en tu provincia."
                        />
                    </>
                )}
            </main>
        </div>
    )
}

export default ClientHomePage