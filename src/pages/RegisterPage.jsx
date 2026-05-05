import { useState } from 'react'
import '../styles/register.css'

function RegisterPage() {
    const [role, setRole] = useState('client')

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-card__title">Regístrate</h1>

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
                        <label htmlFor="name">Nombre</label>
                        <input id="name" type="text" placeholder="Introduce tu nombre" />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="Introduce tu email" />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Crea una contraseña"
                        />
                    </div>

                    <button type="submit" className="auth-form__submit">
                        Crear cuenta como {role === 'client' ? 'cliente' : 'técnico'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage