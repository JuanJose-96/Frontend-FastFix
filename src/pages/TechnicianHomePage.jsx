import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TechnicianHomeHeader from '../components/technician-home/TechnicianHomeHeader'
import TechnicianWelcomeCard from '../components/technician-home/TechnicianWelcomeCard'
import TechnicianProfileStatusCard from '../components/technician-home/TechnicianProfileStatusCard'
import TechnicianReputationCard from '../components/technician-home/TechnicianReputationCard'
import TechnicianQuickActions from '../components/technician-home/TechnicianQuickActions'
import TechnicianPublicPreviewCard from '../components/technician-home/TechnicianPublicPreviewCard'
import '../styles/technician-home.css'

function TechnicianHomePage() {
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

    if (!technician) {
        return null
    }

    return (
        <div className="technician-home-page">
            <TechnicianHomeHeader
                technicianName={technician.name}
                technicianSurname={technician.surname}
                technicianProfileImageUrl={technician.profileImageUrl}
            />

            <main className="technician-home-page__main">
                <div className="technician-home-page__top-grid">
                    <TechnicianWelcomeCard technician={technician} />
                    <TechnicianReputationCard technician={technician} />
                </div>

                <div className="technician-home-page__content-grid">
                    <TechnicianProfileStatusCard technician={technician} />
                    <TechnicianQuickActions />
                </div>

                <TechnicianPublicPreviewCard technician={technician} />
            </main>
        </div>
    )
}

export default TechnicianHomePage