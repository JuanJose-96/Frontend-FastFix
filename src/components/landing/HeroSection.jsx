import { useNavigate } from 'react-router-dom'
import heroImage from '../../assets/landing-family-techs.png'

function HeroSection() {
    const navigate = useNavigate()

    return (
        <section className="hero-section">
            <div className="hero-section__inner">
                <div className="hero-section__image-wrapper">
                    <img
                        src={heroImage}
                        alt="Técnicos guiando a una familia con confianza"
                        className="hero-section__image"
                    />
                </div>

                <div className="hero-section__card">
                    <p className="hero-section__eyebrow">Servicios del hogar de confianza</p>

                    <h1 className="hero-section__title">
                        Tu hogar en las mejores manos. Tu confianza no tiene precio.
                    </h1>

                    <p className="hero-section__description">
                        Encuentra técnicos de confianza para electricidad, fontanería,
                        pintura, cerrajería y mucho más.
                    </p>

                    <div className="hero-section__actions">
                        <button
                            type="button"
                            className="hero-section__button hero-section__button--primary"
                            onClick={() => navigate('/register')}
                        >
                            Regístrate
                        </button>

                        <button
                            type="button"
                            className="hero-section__button hero-section__button--secondary"
                            onClick={() => navigate('/login')}
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection