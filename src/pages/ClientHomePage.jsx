import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/client-home.css'

function ClientHomePage() {
    const location = useLocation()
    const navigate = useNavigate()

    const client = location.state?.client

    function handleGoToLanding() {
        navigate('/')
    }

    return (
        <div className="client-home-page">
            <div className="client-home-card">
                <h1 className="client-home-card__title">Bienvenido a FastFix</h1>

                <p className="client-home-card__subtitle">
                    Has accedido correctamente como cliente.
                </p>

                {client ? (
                    <div className="client-home-info">
                        <h2 className="client-home-info__title">Datos recibidos</h2>

                        <div className="client-home-info__grid">
                            <div className="client-home-info__item">
                                <span className="client-home-info__label">Nombre</span>
                                <span className="client-home-info__value">{client.name}</span>
                            </div>

                            <div className="client-home-info__item">
                                <span className="client-home-info__label">Apellidos</span>
                                <span className="client-home-info__value">{client.surname}</span>
                            </div>

                            <div className="client-home-info__item">
                                <span className="client-home-info__label">Email</span>
                                <span className="client-home-info__value">{client.email}</span>
                            </div>

                            <div className="client-home-info__item">
                                <span className="client-home-info__label">Teléfono</span>
                                <span className="client-home-info__value">{client.phone}</span>
                            </div>

                            <div className="client-home-info__item">
                                <span className="client-home-info__label">Provincia</span>
                                <span className="client-home-info__value">{client.province}</span>
                            </div>

                            <div className="client-home-info__item">
                                <span className="client-home-info__label">Ciudad</span>
                                <span className="client-home-info__value">{client.city}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="client-home-empty">
                        <p>
                            No hay datos del cliente en esta navegación. Esta pantalla es temporal
                            y sirve para validar el registro y el login.
                        </p>
                    </div>
                )}

                <div className="client-home-actions">
                    <button
                        type="button"
                        className="client-home-actions__button client-home-actions__button--primary"
                        onClick={handleGoToLanding}
                    >
                        Volver a la landing
                    </button>

                    <Link
                        to="/register"
                        className="client-home-actions__button client-home-actions__button--secondary"
                    >
                        Ir a registro
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ClientHomePage