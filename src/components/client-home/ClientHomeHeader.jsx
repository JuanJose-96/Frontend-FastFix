import { useLocation, useNavigate } from 'react-router-dom'
import { clearClientSession } from '../../utils/clientSession'

function ClientHomeHeader({
    clientName,
    clientSurname,
    clientProfileImageUrl,
}) {
    const navigate = useNavigate()
    const location = useLocation()

    function handleGoHome() {
        if (location.pathname === '/client/home') return
        navigate('/client/home')
    }

    function handleGoExplore() {
        if (location.pathname === '/client/explore') return
        navigate('/client/explore')
    }

    function handleGoProfile() {
        if (location.pathname === '/client/profile') return
        navigate('/client/profile')
    }

    function handleLogout() {
        clearClientSession()
        navigate('/', { replace: true })
    }

    function getInitials() {
        const firstInitial = clientName?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial = clientSurname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'C'
    }

    return (
        <header className="client-home-header">
            <div className="client-home-header__brand">FastFix</div>

            <nav className="client-home-header__nav">
                <button
                    type="button"
                    className="client-home-header__link"
                    onClick={handleGoHome}
                >
                    Inicio
                </button>

                <button
                    type="button"
                    className="client-home-header__link"
                    onClick={handleGoExplore}
                >
                    Explorar
                </button>

                <button
                    type="button"
                    className="client-home-header__link"
                    onClick={handleGoProfile}
                >
                    Perfil
                </button>
            </nav>

            <div className="client-home-header__actions">
                <div className="client-home-header__user">
                    <span className="client-home-header__welcome">
                        Hola, {clientName || 'cliente'}
                    </span>

                    <div className="client-home-header__avatar">
                        {clientProfileImageUrl ? (
                            <img
                                src={clientProfileImageUrl}
                                alt={`Foto de perfil de ${clientName}`}
                                className="client-home-header__avatar-image"
                            />
                        ) : (
                            <span className="client-home-header__avatar-initials">
                                {getInitials()}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    className="client-home-header__logout"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    )
}

export default ClientHomeHeader