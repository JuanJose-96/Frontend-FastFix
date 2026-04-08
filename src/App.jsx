function App() {
  return (
    <div className="container">
      <div className="card">
        <h1>Iniciar sesión</h1>

        <form className="form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Introduce tu email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Introduce tu contraseña"
            />
          </div>

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}

export default App