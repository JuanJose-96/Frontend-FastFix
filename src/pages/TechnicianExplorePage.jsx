import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import ClientHomeHeader from '../components/client-home/ClientHomeHeader'
import TechnicianExploreHeader from '../components/technician-explore/TechnicianExploreHeader'
import TechnicianFilters from '../components/technician-explore/TechnicianFilters'
import TechnicianResultsGrid from '../components/technician-explore/TechnicianResultsGrid'
import TechnicianEmptyState from '../components/technician-explore/TechnicianEmptyState'
import { getLocations, getProvinces } from '../services/locationService'
import { getSectors } from '../services/sectorService'
import { searchTechnicians } from '../services/technicianSearchService'
import { getClientSession, saveClientSession } from '../utils/ClientSession'
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
    const [searchParams, setSearchParams] = useSearchParams()

    const [storedClient] = useState(() => getClientSession())

    const [filters, setFilters] = useState(INITIAL_FILTERS)
    const [sectors, setSectors] = useState([])
    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])

    const [technicians, setTechnicians] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(false)

    const [highlightEmergencyOnly, setHighlightEmergencyOnly] = useState(false)

    const [loadingFilters, setLoadingFilters] = useState(true)
    const [isRefreshingResults, setIsRefreshingResults] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [pageError, setPageError] = useState('')
    const [hasLoadedResultsOnce, setHasLoadedResultsOnce] = useState(false)
    const [hasInitializedFromQueryParams, setHasInitializedFromQueryParams] =
        useState(false)

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

    useEffect(() => {
        if (loadingFilters) return
        if (hasInitializedFromQueryParams) return

        setFilters({
            sectorId: searchParams.get('sectorId') || '',
            province: searchParams.get('province') || '',
            city: searchParams.get('city') || '',
            rating: searchParams.get('rating') || '',
        })

        setHasInitializedFromQueryParams(true)
    }, [loadingFilters, hasInitializedFromQueryParams, searchParams])

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
        if (!hasInitializedFromQueryParams) return

        const debounceId = setTimeout(() => {
            async function loadFirstPage() {
                const currentRequestId = ++requestIdRef.current

                try {
                    setIsRefreshingResults(true)
                    setPageError('')

                    const searchFilters = {
                        sectorId: filters.sectorId ? Number(filters.sectorId) : undefined,
                        province: filters.province || undefined,
                        city: filters.city || undefined,
                        rating: filters.rating ? Number(filters.rating) : undefined,
                        page: 0,
                    }

                    const pagedResult = await searchTechnicians(searchFilters)

                    if (currentRequestId !== requestIdRef.current) {
                        return
                    }

                    setTechnicians(pagedResult.content)
                    setCurrentPage(pagedResult.currentPage)
                    setTotalPages(pagedResult.totalPages)
                    setTotalElements(pagedResult.totalElements)
                    setHasNextPage(pagedResult.hasNext)
                    setHasLoadedResultsOnce(true)
                } catch (error) {
                    if (currentRequestId !== requestIdRef.current) {
                        return
                    }

                    console.error('Error cargando técnicos:', error)
                    setPageError('No se pudieron cargar los técnicos')
                    setTechnicians([])
                    setCurrentPage(0)
                    setTotalPages(0)
                    setTotalElements(0)
                    setHasNextPage(false)
                    setHasLoadedResultsOnce(true)
                } finally {
                    if (currentRequestId === requestIdRef.current) {
                        setIsRefreshingResults(false)
                    }
                }
            }

            loadFirstPage()
        }, 250)

        return () => clearTimeout(debounceId)
    }, [client, filters, hasInitializedFromQueryParams])

    useEffect(() => {
        if (!hasInitializedFromQueryParams) return

        const nextSearchParams = new URLSearchParams()

        if (filters.sectorId) {
            nextSearchParams.set('sectorId', filters.sectorId)
        }

        if (filters.province) {
            nextSearchParams.set('province', filters.province)
        }

        if (filters.city) {
            nextSearchParams.set('city', filters.city)
        }

        if (filters.rating) {
            nextSearchParams.set('rating', filters.rating)
        }

        setSearchParams(nextSearchParams, { replace: true })
    }, [filters, hasInitializedFromQueryParams, setSearchParams])

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

    function handleToggleEmergencyHighlight() {
        setHighlightEmergencyOnly((previousValue) => !previousValue)
    }

    async function handleLoadMore() {
        if (isLoadingMore || !hasNextPage) return

        try {
            setIsLoadingMore(true)
            setPageError('')

            const nextPage = currentPage + 1

            const searchFilters = {
                sectorId: filters.sectorId ? Number(filters.sectorId) : undefined,
                province: filters.province || undefined,
                city: filters.city || undefined,
                rating: filters.rating ? Number(filters.rating) : undefined,
                page: nextPage,
            }

            const pagedResult = await searchTechnicians(searchFilters)

            setTechnicians((previousTechnicians) => [
                ...previousTechnicians,
                ...pagedResult.content,
            ])
            setCurrentPage(pagedResult.currentPage)
            setTotalPages(pagedResult.totalPages)
            setTotalElements(pagedResult.totalElements)
            setHasNextPage(pagedResult.hasNext)
        } catch (error) {
            console.error('Error cargando más técnicos:', error)
            setPageError('No se pudieron cargar más técnicos')
        } finally {
            setIsLoadingMore(false)
        }
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
                        <>
                            <div className="technician-explore-page__visual-tools">
                                <label className="technician-explore-page__checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={highlightEmergencyOnly}
                                        onChange={handleToggleEmergencyHighlight}
                                    />
                                    <span>Resaltar técnicos con urgencias</span>
                                </label>
                            </div>

                            <TechnicianResultsGrid
                                technicians={technicians}
                                totalElements={totalElements}
                                highlightEmergencyOnly={highlightEmergencyOnly}
                            />

                            {hasNextPage && (
                                <div className="technician-explore-page__load-more">
                                    <button
                                        type="button"
                                        className="technician-explore-page__load-more-button"
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                    >
                                        {isLoadingMore ? 'Cargando...' : 'Cargar más'}
                                    </button>
                                </div>
                            )}
                        </>
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