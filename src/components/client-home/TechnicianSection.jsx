import { useEffect, useMemo, useState } from 'react'
import TechnicianCard from './TechnicianCard'

const ITEMS_PER_PAGE = 5
const AUTO_SLIDE_INTERVAL_MS = 20000

function TechnicianSection({ title, description, technicians, emptyMessage }) {
    const [currentPage, setCurrentPage] = useState(0)

    const totalPages = Math.ceil(technicians.length / ITEMS_PER_PAGE)

    const pages = useMemo(() => {
        const groupedPages = []

        for (let index = 0; index < technicians.length; index += ITEMS_PER_PAGE) {
            groupedPages.push(technicians.slice(index, index + ITEMS_PER_PAGE))
        }

        return groupedPages
    }, [technicians])

    useEffect(() => {
        setCurrentPage(0)
    }, [technicians])

    useEffect(() => {
        if (totalPages <= 1) return
        if (currentPage >= totalPages - 1) return

        const intervalId = setInterval(() => {
            setCurrentPage((previousPage) => {
                if (previousPage >= totalPages - 1) {
                    return previousPage
                }

                return previousPage + 1
            })
        }, AUTO_SLIDE_INTERVAL_MS)

        return () => clearInterval(intervalId)
    }, [currentPage, totalPages])

    function handlePrevious() {
        if (totalPages <= 1) return

        setCurrentPage((previousPage) => {
            if (previousPage === 0) {
                return 0
            }

            return previousPage - 1
        })
    }

    function handleNext() {
        if (totalPages <= 1) return

        setCurrentPage((previousPage) => {
            if (previousPage >= totalPages - 1) {
                return totalPages - 1
            }

            return previousPage + 1
        })
    }

    return (
        <section className="technician-section">
            <div className="technician-section__header">
                <div>
                    <h2 className="technician-section__title">{title}</h2>
                    <p className="technician-section__description">{description}</p>
                </div>

                {technicians.length > ITEMS_PER_PAGE && (
                    <div className="technician-section__controls">
                        <button
                            type="button"
                            className="technician-section__control-button"
                            onClick={handlePrevious}
                            aria-label={`Ver técnicos anteriores de ${title}`}
                        >
                            ‹
                        </button>

                        <span className="technician-section__page-indicator">
                            {currentPage + 1} / {totalPages}
                        </span>

                        <button
                            type="button"
                            className="technician-section__control-button"
                            onClick={handleNext}
                            aria-label={`Ver siguientes técnicos de ${title}`}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>

            {technicians.length > 0 ? (
                <div className="technician-section__viewport">
                    <div
                        className="technician-section__track"
                        style={{ transform: `translateX(-${currentPage * 100}%)` }}
                    >
                        {pages.map((page, pageIndex) => (
                            <div key={pageIndex} className="technician-section__slide">
                                <div className="technician-section__list">
                                    {page.map((technician) => (
                                        <TechnicianCard
                                            key={technician.id ?? `${technician.email}-${technician.name}`}
                                            technician={technician}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="technician-section__empty">{emptyMessage}</div>
            )}
        </section>
    )
}

export default TechnicianSection