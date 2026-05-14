import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TechnicianHomeHeader from '../components/technician-home/TechnicianHomeHeader'
import TechnicianClientSearchHeader from '../components/technician-client-search/TechnicianClientSearchHeader'
import TechnicianClientFilters from '../components/technician-client-search/TechnicianClientFilters'
import TechnicianClientResultsGrid from '../components/technician-client-search/TechnicianClientResultsGrid'
import TechnicianClientEmptyState from '../components/technician-client-search/TechnicianClientEmptyState'
import { getLocations, getProvinces } from '../services/locationService'
import { searchClients } from '../services/clientSearchService'
import '../styles/technician-client-search.css'

const INITIAL_FILTERS = {
    name: '',
    province: '',
    city: '',
}

function TechnicianClientSearchPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [storedTechnician] = useState(() => {
        const session = localStorage.getItem('technicianSession')

        if (!session) return null

        try {
            return JSON.parse(session)
        } catch (error) {
            console.error('Error leyendo la sesión del técnico:', error)
            return null
        }
    })

    const technicianFromState = location.state?.technician

    const technician = useMemo(() => {
        return technicianFromState || storedTechnician
    }, [technicianFromState, storedTechnician])

    const [filters, setFilters] = useState(INITIAL_FILTERS)
    const [provinces, setProvinces] = useState([])
    const [allLocations, setAllLocations] = useState([])

    const [clients, setClients] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(false)

    const [loadingFilters, setLoadingFilters] = useState(true)
    const [isRefreshingResults, setIsRefreshingResults] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [pageError, setPageError] = useState('')
    const [hasLoadedResultsOnce, setHasLoadedResultsOnce] = useState(false)

    const requestIdRef = useRef(0)

    useEffect(() => {
        if (technicianFromState) {
            localStorage.setItem('technicianSession', JSON.stringify(technicianFromState))
        }
    }, [technicianFromState])

    useEffect(() => {
        if (!technician) {
            navigate('/login', { replace: true })
        }
    }, [technician, navigate])

    useEffect(() => {
        async function loadFilterData() {
            try {
                setLoadingFilters(true)
                setPageError('')

                const [provincesData, locationsData] = await Promise.all([
                    getProvinces(),
                    getLocations(),
                ])

                const sortedProvinces = [...provincesData].sort((a, b) =>
                    a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
                )

                setProvinces(sortedProvinces)
                setAllLocations(locationsData)
            } catch (error) {
                console.error('Error cargando filtros de clientes:', error)
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
        if (!technician) return

        const debounceId = setTimeout(() => {
            async function loadFirstPage() {
                const currentRequestId = ++requestIdRef.current

                try {
                    setIsRefreshingResults(true)
                    setPageError('')

                    const pagedResult = await searchClients({
                        name: filters.name || undefined,
                        province: filters.province || undefined,
                        city: filters.city || undefined,
                        page: 0,
                    })

                    if (currentRequestId !== requestIdRef.current) {
                        return
                    }

                    setClients(pagedResult.content)
                    setCurrentPage(pagedResult.currentPage)
                    setTotalPages(pagedResult.totalPages)
                    setTotalElements(pagedResult.totalElements)
                    setHasNextPage(pagedResult.hasNext)
                    setHasLoadedResultsOnce(true)
                } catch (error) {
                    if (currentRequestId !== requestIdRef.current) {
                        return
                    }

                    console.error('Error cargando clientes:', error)
                    setPageError('No se pudieron cargar los clientes')
                    setClients([])
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
        }, 300)

        return () => clearTimeout(debounceId)
    }, [technician, filters.name, filters.province, filters.city])

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

    async function handleLoadMore() {
        if (isLoadingMore || !hasNextPage) return

        try {
            setIsLoadingMore(true)
            setPageError('')

            const nextPage = currentPage + 1

            const pagedResult = await searchClients({
                name: filters.name || undefined,
                province: filters.province || undefined,
                city: filters.city || undefined,
                page: nextPage,
            })

            setClients((previousClients) => [
                ...previousClients,
                ...pagedResult.content,
            ])
            setCurrentPage(pagedResult.currentPage)
            setTotalPages(pagedResult.totalPages)
            setTotalElements(pagedResult.totalElements)
            setHasNextPage(pagedResult.hasNext)
        } catch (error) {
            console.error('Error cargando más clientes:', error)
            setPageError('No se pudieron cargar más clientes')
        } finally {
            setIsLoadingMore(false)
        }
    }

    if (!technician) {
        return null
    }

    const showEmptyState =
        hasLoadedResultsOnce &&
        !isRefreshingResults &&
        clients.length === 0 &&
        !pageError

    return (
        <div className="technician-client-search-page">
            <TechnicianHomeHeader
                technicianName={technician.name}
                technicianSurname={technician.surname}
                technicianProfileImageUrl={technician.profileImageUrl}
            />

            <main className="technician-client-search-page__main">
                <TechnicianClientSearchHeader />

                {pageError && (
                    <p className="technician-client-search-page__error">{pageError}</p>
                )}

                <TechnicianClientFilters
                    filters={filters}
                    provinces={provinces}
                    cities={filteredCities}
                    loadingFilters={loadingFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                <section className="technician-client-search-page__results-area">
                    <div className="technician-client-search-page__results-status">
                        {isRefreshingResults && hasLoadedResultsOnce && (
                            <span className="technician-client-search-page__results-loading">
                                Actualizando resultados...
                            </span>
                        )}
                    </div>

                    {clients.length > 0 && (
                        <>
                            <TechnicianClientResultsGrid
                                clients={clients}
                                totalElements={totalElements}
                            />

                            {hasNextPage && (
                                <div className="technician-client-search-page__load-more">
                                    <button
                                        type="button"
                                        className="technician-client-search-page__load-more-button"
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
                        <TechnicianClientEmptyState onClearFilters={handleClearFilters} />
                    )}

                    {!hasLoadedResultsOnce && isRefreshingResults && (
                        <div className="technician-client-search-page__initial-loading">
                            Cargando clientes...
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default TechnicianClientSearchPage