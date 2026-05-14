import { useLocation, useNavigate } from 'react-router-dom'
import { clearClientSession } from '../../utils/clientSession'
import '../../styles/client-header.css'

const NAV_ITEMS = [
    {
        key: 'home',
        label: 'Inicio',
        path: '/client/home',
    },
    {
        key: 'explore',
        label: 'Explorar',
        path: '/client/explore',
    },
    {
        key: 'reviews',
        label: 'Mis reseñas',
        path: '/client/reviews',
    },
    {
        key: 'profile',
        label: 'Perfil',
        path: '/client/profile',
    },
]

function ClientHomeHeader({
    clientName,
    clientSurname,
    clientProfileImageUrl,
}) {
    const navigate = useNavigate()
    const location = useLocation()

    function handleNavigate(path) {
        if (location.pathname === path) return
        navigate(path)
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

            <nav className="client-home-header__nav" aria-label="Navegación cliente">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path

                    return (
                        <button
                            key={item.key}
                            type="button"
                            className={`client-home-header__nav-item ${isActive ? 'client-home-header__nav-item--active' : ''
                                }`}
                            onClick={() => handleNavigate(item.path)}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <span className="client-home-header__nav-label">{item.label}</span>
                        </button>
                    )
                })}
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