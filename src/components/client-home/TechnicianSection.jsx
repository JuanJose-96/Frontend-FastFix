import { useEffect, useMemo, useState } from 'react'
import ClientTechnicianCard from '../client-technicians/ClientTechnicianCard'
import '../../styles/client-technician-section.css'

const TECHNICIANS_PER_PAGE = 4

function chunkTechnicians(technicians, size) {
    const chunks = []

    for (let index = 0; index < technicians.length; index += size) {
        chunks.push(technicians.slice(index, index + size))
    }

    return chunks
}

function TechnicianSection({
    title,
    description,
    technicians,
    emptyMessage,
}) {
    const [currentPage, setCurrentPage] = useState(0)

    const technicianPages = useMemo(() => {
        return chunkTechnicians(technicians, TECHNICIANS_PER_PAGE)
    }, [technicians])

    const totalPages = technicianPages.length

    useEffect(() => {
        setCurrentPage(0)
    }, [technicians])

    function handlePreviousPage() {
        setCurrentPage((previousPage) => Math.max(previousPage - 1, 0))
    }

    function handleNextPage() {
        setCurrentPage((previousPage) => Math.min(previousPage + 1, totalPages - 1))
    }

    const currentTechnicians = technicianPages[currentPage] || []

    return (
        <section className="client-technician-section">
            <div className="client-technician-section__header">
                <div>
                    <h2 className="client-technician-section__title">{title}</h2>
                    <p className="client-technician-section__description">{description}</p>
                </div>

                {totalPages > 1 && (
                    <div className="client-technician-section__controls">
                        <button
                            type="button"
                            className="client-technician-section__control-button"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                        >
                            ←
                        </button>

                        <span className="client-technician-section__page-indicator">
                            {currentPage + 1} / {totalPages}
                        </span>

                        <button
                            type="button"
                            className="client-technician-section__control-button"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            {technicians.length === 0 ? (
                <div className="client-technician-section__empty">{emptyMessage}</div>
            ) : (
                <div className="client-technician-section__grid">
                    {currentTechnicians.map((technician) => (
                        <ClientTechnicianCard
                            key={technician.id}
                            technician={technician}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default TechnicianSection