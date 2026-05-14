import { useLocation, useNavigate } from 'react-router-dom'
import '../../styles/technician-header.css'

const NAV_ITEMS = [
    {
        key: 'home',
        label: 'Inicio',
        path: '/technician/home',
    },
    {
        key: 'clients',
        label: 'Buscar clientes',
        path: '/technician/clients',
    },
    {
        key: 'jobs',
        label: 'Mis trabajos',
        path: '/technician/jobs',
    },
    {
        key: 'profile',
        label: 'Perfil',
        path: '/technician/profile',
    },
]

function TechnicianHomeHeader({
    technicianName,
    technicianSurname,
    technicianProfileImageUrl,
}) {
    const navigate = useNavigate()
    const location = useLocation()

    function handleLogout() {
        localStorage.removeItem('technicianSession')
        navigate('/', { replace: true })
    }

    function handleNavigate(path) {
        if (location.pathname === path) return
        navigate(path)
    }

    function isActivePath(path) {
        return location.pathname === path
    }

    function getInitials() {
        const firstInitial = technicianName?.trim()?.charAt(0)?.toUpperCase() || ''
        const secondInitial =
            technicianSurname?.trim()?.charAt(0)?.toUpperCase() || ''

        if (firstInitial && secondInitial) {
            return `${firstInitial}${secondInitial}`
        }

        return firstInitial || 'T'
    }

    return (
        <header className="technician-home-header">
            <div className="technician-home-header__brand">FastFix</div>

            <nav className="technician-home-header__nav" aria-label="Navegación técnico">
                {NAV_ITEMS.map((item) => {
                    const isActive = isActivePath(item.path)

                    return (
                        <button
                            key={item.key}
                            type="button"
                            className={`technician-home-header__nav-item ${isActive ? 'technician-home-header__nav-item--active' : ''
                                }`}
                            onClick={() => handleNavigate(item.path)}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <span className="technician-home-header__nav-label">
                                {item.label}
                            </span>
                        </button>
                    )
                })}
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