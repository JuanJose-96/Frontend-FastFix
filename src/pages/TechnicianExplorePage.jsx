import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ClientHomeHeader from '../components/client-home/ClientHomeHeader'
import TechnicianExploreHeader from '../components/technician-explore/TechnicianExploreHeader'
import TechnicianFilters from '../components/technician-explore/TechnicianFilters'
import TechnicianResultsGrid from '../components/technician-explore/TechnicianResultsGrid'
import TechnicianEmptyState from '../components/technician-explore/TechnicianEmptyState'
import { getLocations, getProvinces } from '../services/locationService'
import { getSectors } from '../services/sectorService'
import { searchTechnicians } from '../services/technicianSearchService'
import { getClientSession, saveClientSession } from '../utils/clientSession'
import '../styles/technician-explore.css'

const INITIAL_FILTERS = {
    sectorId: '',
    province: '',
    city: '',
    rating: '',
}

function TechnicianExplorePage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [storedClient] = useState(() => getClientSession())

    const [filters, setFilters] = useState(INITIAL_FILTERS)
    const [sectors, setSectors] = useState([])
    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [technicians, setTechnicians] = useState([])

    const [loadingFilters, setLoadingFilters] = useState(true)
    const [isRefreshingResults, setIsRefreshingResults] = useState(true)
    const [pageError, setPageError] = useState('')
    const [hasLoadedResultsOnce, setHasLoadedResultsOnce] = useState(false)

    const requestIdRef = useRef(0)

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
        async function loadFilterData() {
            try {
                setLoadingFilters(true)
                setPageError('')

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
            } catch (error) {
                console.error('Error cargando filtros de exploración:', error)
                setPageError('No se pudieron cargar los filtros de búsqueda')
            } finally {
                setLoadingFilters(false)
            }
        }

        loadFilterData()
    }, [])

    const filteredCities = useMemo(() => {
        if (!filters.province) return []

        const selectedProvince = provinces.find(
            (province) => province.label === filters.province,
        )

        if (!selectedProvince) return []

        return allLocations
            .filter((location) => location.parent_code === selectedProvince.code)
            .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
    }, [allLocations, filters.province, provinces])

    useEffect(() => {
        if (!client) return

        const debounceId = setTimeout(() => {
            async function loadTechnicians() {
                const currentRequestId = ++requestIdRef.current

                try {
                    setIsRefreshingResults(true)
                    setPageError('')

                    const searchFilters = {
                        sectorId: filters.sectorId ? Number(filters.sectorId) : undefined,
                        province: filters.province || undefined,
                        city: filters.city || undefined,
                        rating: filters.rating ? Number(filters.rating) : undefined,
                    }

                    const techniciansData = await searchTechnicians(searchFilters)

                    if (currentRequestId !== requestIdRef.current) {
                        return
                    }

                    const sortedTechnicians = [...techniciansData].sort((a, b) => {
                        const ratingA = a.averageRating || 0
                        const ratingB = b.averageRating || 0

                        if (ratingB !== ratingA) {
                            return ratingB - ratingA
                        }

                        const nameA = `${a.name || ''} ${a.surname || ''}`.trim().toLowerCase()
                        const nameB = `${b.name || ''} ${b.surname || ''}`.trim().toLowerCase()

                        return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' })
                    })

                    setTechnicians(sortedTechnicians)
                    setHasLoadedResultsOnce(true)
                } catch (error) {
                    if (currentRequestId !== requestIdRef.current) {
                        return
                    }

                    console.error('Error cargando técnicos:', error)
                    setPageError('No se pudieron cargar los técnicos')
                    setTechnicians([])
                    setHasLoadedResultsOnce(true)
                } finally {
                    if (currentRequestId === requestIdRef.current) {
                        setIsRefreshingResults(false)
                    }
                }
            }

            loadTechnicians()
        }, 250)

        return () => clearTimeout(debounceId)
    }, [client, filters])

    function handleFilterChange(event) {
        const { name, value } = event.target

        setFilters((previousFilters) => {
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

    function handleClearFilters() {
        setFilters(INITIAL_FILTERS)
    }

    if (!client) {
        return null
    }

    const showEmptyState =
        hasLoadedResultsOnce && !isRefreshingResults && technicians.length === 0 && !pageError

    return (
        <div className="technician-explore-page">
            <ClientHomeHeader
                clientName={client.name}
                clientSurname={client.surname}
                clientProfileImageUrl={client.profileImageUrl}
            />

            <main className="technician-explore-page__main">
                <TechnicianExploreHeader />

                {pageError && <p className="technician-explore-page__error">{pageError}</p>}

                <TechnicianFilters
                    filters={filters}
                    sectors={sectors}
                    provinces={provinces}
                    cities={filteredCities}
                    loadingFilters={loadingFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                <section className="technician-explore-page__results-area">
                    <div className="technician-explore-page__results-status">
                        {isRefreshingResults && hasLoadedResultsOnce && (
                            <span className="technician-explore-page__results-loading">
                                Actualizando resultados...
                            </span>
                        )}
                    </div>

                    {technicians.length > 0 && (
                        <TechnicianResultsGrid technicians={technicians} />
                    )}

                    {showEmptyState && (
                        <TechnicianEmptyState onClearFilters={handleClearFilters} />
                    )}

                    {!hasLoadedResultsOnce && isRefreshingResults && (
                        <div className="technician-explore-page__initial-loading">
                            Cargando técnicos...
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default TechnicianExplorePage