import { useLocation, useNavigate } from 'react-router-dom'
import { clearClientSession } from '../../utils/clientSession'

function ClientHomeHeader({ clientName }) {
    const navigate = useNavigate()
    const location = useLocation()

    function handleGoHome() {
        if (location.pathname === '/client/home') {
            return
        }

        navigate('/client/home')
    }

    function handleLogout() {
        clearClientSession()
        navigate('/', { replace: true })
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

                <button type="button" className="client-home-header__link" disabled>
                    Explorar
                </button>

                <button type="button" className="client-home-header__link" disabled>
                    Perfil
                </button>
            </nav>

            <div className="client-home-header__actions">
                <span className="client-home-header__welcome">
                    Hola, {clientName || 'cliente'}
                </span>

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