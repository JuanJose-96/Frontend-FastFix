import { useState } from 'react'
import '../styles/login.css'

function LoginPage() {
    const [role, setRole] = useState('client')

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-card__title">Iniciar sesión</h1>

                <div className="role-selector">
                    <button
                        type="button"
                        className={`role-selector__button ${role === 'client' ? 'role-selector__button--active' : ''}`}
                        onClick={() => setRole('client')}
                    >
                        Soy cliente
                    </button>

                    <button
                        type="button"
                        className={`role-selector__button ${role === 'technician' ? 'role-selector__button--active' : ''}`}
                        onClick={() => setRole('technician')}
                    >
                        Soy técnico
                    </button>
                </div>

                <form className="auth-form">
                    <div className="auth-form__field">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="Introduce tu email" />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Introduce tu contraseña"
                        />
                    </div>

                    <button type="submit" className="auth-form__submit">
                        Entrar como {role === 'client' ? 'cliente' : 'técnico'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage