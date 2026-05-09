import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ClientHomePage from './pages/ClientHomePage'
import TechnicianHomePage from './pages/TechnicianHomePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/client/home" element={<ClientHomePage />} />
      <Route path="/technician/home" element={<TechnicianHomePage />} />
    </Routes>
  )
}

export default App