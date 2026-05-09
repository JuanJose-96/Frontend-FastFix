import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/technician-home.css'

function TechnicianHomePage() {
    const location = useLocation()
    const navigate = useNavigate()

    const technician = location.state?.technician

    function handleGoToLanding() {
        navigate('/')
    }

    return (
        <div className="technician-home-page">
            <div className="technician-home-card">
                <h1 className="technician-home-card__title">Bienvenido a FastFix</h1>

                <p className="technician-home-card__subtitle">
                    Has accedido correctamente como técnico.
                </p>

                {technician ? (
                    <div className="technician-home-info">
                        <h2 className="technician-home-info__title">Datos recibidos</h2>

                        <div className="technician-home-info__grid">
                            <div className="technician-home-info__item">
                                <span className="technician-home-info__label">Nombre</span>
                                <span className="technician-home-info__value">{technician.name}</span>
                            </div>

                            <div className="technician-home-info__item">
                                <span className="technician-home-info__label">Apellidos</span>
                                <span className="technician-home-info__value">{technician.surname}</span>
                            </div>

                            <div className="technician-home-info__item">
                                <span className="technician-home-info__label">Email</span>
                                <span className="technician-home-info__value">{technician.email}</span>
                            </div>

                            <div className="technician-home-info__item">
                                <span className="technician-home-info__label">Teléfono</span>
                                <span className="technician-home-info__value">{technician.phone}</span>
                            </div>

                            <div className="technician-home-info__item">
                                <span className="technician-home-info__label">Provincia</span>
                                <span className="technician-home-info__value">{technician.province}</span>
                            </div>

                            <div className="technician-home-info__item">
                                <span className="technician-home-info__label">Ciudad</span>
                                <span className="technician-home-info__value">{technician.city}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="technician-home-empty">
                        <p>
                            No hay datos del técnico en esta navegación. Esta pantalla es temporal
                            y sirve para validar el registro y el login.
                        </p>
                    </div>
                )}

                <div className="technician-home-actions">
                    <button
                        type="button"
                        className="technician-home-actions__button technician-home-actions__button--primary"
                        onClick={handleGoToLanding}
                    >
                        Volver a la landing
                    </button>

                    <Link
                        to="/register"
                        className="technician-home-actions__button technician-home-actions__button--secondary"
                    >
                        Ir a registro
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TechnicianHomePage
