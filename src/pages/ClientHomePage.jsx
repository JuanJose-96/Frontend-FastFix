import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ClientHomeHeader from '../components/client-home/ClientHomeHeader'
import ClientHomeHero from '../components/client-home/ClientHomeHero'
import TechnicianSection from '../components/client-home/TechnicianSection'
import { getLocations, getProvinces } from '../services/locationService'
import { getSectors } from '../services/sectorService'
import { searchTechnicians } from '../services/technicianSearchService'
import { getClientSession, saveClientSession } from '../utils/ClientSession'
import '../styles/client-home.css'

const MAX_TECHNICIANS_PER_SECTION = 16
const NEARBY_REFRESH_INTERVAL_MS = 60000
const TOP_RATED_REFRESH_INTERVAL_MS = 35000
const EMERGENCY_REFRESH_INTERVAL_MS = 20000

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

    const nearbyCurrentPageRef = useRef(0)

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

    const loadNearbyRow = useCallback(async (resetToFirstPage = false) => {
        if (!client?.province) {
            setNearbyTechnicians([])
            return
        }

        try {
            if (resetToFirstPage) {
                nearbyCurrentPageRef.current = 0
            }

            const pagedResult = await searchTechnicians({
                province: client.province,
                page: nearbyCurrentPageRef.current,
            })

            const uniqueProvinceTechnicians = getUniqueTechnicians(pagedResult.content)

            setNearbyTechnicians(
                uniqueProvinceTechnicians.slice(0, MAX_TECHNICIANS_PER_SECTION),
            )

            if (pagedResult.totalPages > 1) {
                if (pagedResult.hasNext) {
                    nearbyCurrentPageRef.current = pagedResult.currentPage + 1
                } else {
                    nearbyCurrentPageRef.current = 0
                }
            } else {
                nearbyCurrentPageRef.current = 0
            }
        } catch (error) {
            console.error('Error cargando técnicos cerca de ti:', error)
            setHomeError('No se pudo cargar la información principal')
        }
    }, [client])

    const loadTopRatedRow = useCallback(async () => {
        try {
            const pagedResult = await searchTechnicians({
                rating: 4,
                page: 0,
            })

            const uniqueTopRatedTechnicians = getUniqueTechnicians(pagedResult.content)

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

            setTopRatedTechnicians(sortedTopRated)
        } catch (error) {
            console.error('Error cargando técnicos mejor valorados:', error)
            setHomeError('No se pudo cargar la información principal')
        }
    }, [])

    const loadEmergencyRow = useCallback(async () => {
        if (!client?.province) {
            setEmergencyTechnicians([])
            return
        }

        try {
            const pagedResult = await searchTechnicians({
                province: client.province,
                page: 0,
            })

            const uniqueProvinceTechnicians = getUniqueTechnicians(pagedResult.content)

            const emergencyProvinceTechnicians = uniqueProvinceTechnicians
                .filter((technician) => technician.emergencyAvailability)
                .slice(0, MAX_TECHNICIANS_PER_SECTION)

            setEmergencyTechnicians(emergencyProvinceTechnicians)
        } catch (error) {
            console.error('Error cargando técnicos de urgencias:', error)
            setHomeError('No se pudo cargar la información principal')
        }
    }, [client])

    useEffect(() => {
        if (!client) return

        async function loadInitialHomeRows() {
            try {
                setLoadingHome(true)
                setHomeError('')

                await Promise.all([
                    loadNearbyRow(true),
                    loadTopRatedRow(),
                    loadEmergencyRow(),
                ])
            } finally {
                setLoadingHome(false)
            }
        }

        loadInitialHomeRows()
    }, [client, loadNearbyRow, loadTopRatedRow, loadEmergencyRow])

    useEffect(() => {
        if (!client) return

        const nearbyIntervalId = window.setInterval(() => {
            loadNearbyRow(false)
        }, NEARBY_REFRESH_INTERVAL_MS)

        return () => window.clearInterval(nearbyIntervalId)
    }, [client, loadNearbyRow])

    useEffect(() => {
        if (!client) return

        const topRatedIntervalId = window.setInterval(() => {
            loadTopRatedRow()
        }, TOP_RATED_REFRESH_INTERVAL_MS)

        return () => window.clearInterval(topRatedIntervalId)
    }, [client, loadTopRatedRow])

    useEffect(() => {
        if (!client) return

        const emergencyIntervalId = window.setInterval(() => {
            loadEmergencyRow()
        }, EMERGENCY_REFRESH_INTERVAL_MS)

        return () => window.clearInterval(emergencyIntervalId)
    }, [client, loadEmergencyRow])

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
                            description="Técnicos de tu misma provincia."
                            technicians={nearbyTechnicians}
                            emptyMessage="No hay técnicos disponibles todavía en tu provincia."
                        />

                        <TechnicianSection
                            title="Mejor valorados"
                            description="Técnicos mejor valorados en el país."
                            technicians={topRatedTechnicians}
                            emptyMessage="Todavía no hay suficientes técnicos con valoración igual o superior a 4."
                        />

                        <TechnicianSection
                            title="Urgencias en tu provincia"
                            description="Técnicos de tu provincia que aceptan servicios urgentes."
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