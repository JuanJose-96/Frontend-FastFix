import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TechnicianHomeHeader from '../components/technician-home/TechnicianHomeHeader'
import TechnicianWelcomeCard from '../components/technician-home/TechnicianWelcomeCard'
import TechnicianProfileStatusCard from '../components/technician-home/TechnicianProfileStatusCard'
import TechnicianReputationCard from '../components/technician-home/TechnicianReputationCard'
import TechnicianPublicPreviewCard from '../components/technician-home/TechnicianPublicPreviewCard'
import { getTechnicianProfile } from '../services/technicianProfileService'
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

    const technicianSession = useMemo(() => {
        return technicianFromState || storedTechnician
    }, [technicianFromState, storedTechnician])

    const [technician, setTechnician] = useState(technicianSession)

    useEffect(() => {
        if (technicianFromState) {
            localStorage.setItem('technicianSession', JSON.stringify(technicianFromState))
        }
    }, [technicianFromState])

    useEffect(() => {
        if (!technicianSession) {
            navigate('/login', { replace: true })
        }
    }, [technicianSession, navigate])

    useEffect(() => {
        if (!technicianSession?.id) return

        async function loadFreshTechnicianProfile() {
            try {
                const freshTechnician = await getTechnicianProfile(technicianSession.id)
                setTechnician(freshTechnician)
                localStorage.setItem('technicianSession', JSON.stringify(freshTechnician))
            } catch (error) {
                console.error('Error cargando perfil actualizado del técnico en home:', error)
                setTechnician(technicianSession)
            }
        }

        loadFreshTechnicianProfile()
    }, [technicianSession])

    function handleOpenPublicProfile() {
        navigate('/technician/public-profile', {
            state: {
                technician,
            },
        })
    }

    if (!technicianSession || !technician) {
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

                    <TechnicianPublicPreviewCard
                        technician={technician}
                        onOpenPublicProfile={handleOpenPublicProfile}
                    />
                </div>
            </main>
        </div>
    )
}

export default TechnicianHomePage