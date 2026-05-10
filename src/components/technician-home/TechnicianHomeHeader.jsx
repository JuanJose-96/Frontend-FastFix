import { useLocation, useNavigate } from 'react-router-dom'

function TechnicianHomeHeader({
    technicianName,
    technicianSurname,
    technicianProfileImageUrl,
}) {
    const navigate = useNavigate()
    const location = useLocation()

    function handleGoHome() {
        if (location.pathname === '/technician/home') return
        navigate('/technician/home')
    }

    function handleGoSearchClients() {
        if (location.pathname === '/technician/clients') return
        navigate('/technician/clients')
    }

    function handleGoJobs() {
        if (location.pathname === '/technician/jobs') return
        navigate('/technician/jobs')
    }

    function handleGoProfile() {
        if (location.pathname === '/technician/profile') return
        navigate('/technician/profile')
    }

    function handleLogout() {
        localStorage.removeItem('technicianSession')
        navigate('/', { replace: true })
    }

    function getInitials() {
        const firstInitial = technicianName?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = technicianSurname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'T'
    }

    return (
        <header className="technician-home-header">
            <div className="technician-home-header__brand">FastFix</div>

            <nav className="technician-home-header__nav">
                <button
                    type="button"
                    className="technician-home-header__link"
                    onClick={handleGoHome}
                >
                    Inicio
                </button>

                <button
                    type="button"
                    className="technician-home-header__link"
                    onClick={handleGoSearchClients}
                >
                    Buscar clientes
                </button>

                <button
                    type="button"
                    className="technician-home-header__link"
                    onClick={handleGoJobs}
                    disabled
                >
                    Mis trabajos
                </button>

                <button
                    type="button"
                    className="technician-home-header__link"
                    onClick={handleGoProfile}
                >
                    Perfil
                </button>
            </nav>

            <div className="technician-home-header__actions">
                <div className="technician-home-header__user">
                    <span className="technician-home-header__welcome">
                        Hola, {technicianName || 'técnico'}
                    </span>

                    <div className="technician-home-header__avatar">
                        {technicianProfileImageUrl ? (
                            <img
                                src={technicianProfileImageUrl}
                                alt={`Foto de perfil de ${technicianName}`}
                                className="technician-home-header__avatar-image"
                            />
                        ) : (
                            <span className="technician-home-header__avatar-initials">
                                {getInitials()}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    className="technician-home-header__logout"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    )
}

export default TechnicianHomeHeader