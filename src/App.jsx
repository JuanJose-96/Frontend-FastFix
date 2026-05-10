import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ClientHomePage from './pages/ClientHomePage'
import TechnicianHomePage from './pages/TechnicianHomePage'
import TechnicianExplorePage from './pages/TechnicianExplorePage'
import ClientProfilePage from './pages/ClientProfilePage'
import TechnicianProfilePage from './pages/TechnicianProfilePage'
import TechnicianPublicProfilePage from './pages/TechnicianPublicProfilePage'
import TechnicianClientSearchPage from './pages/TechnicianClientSearchPage'
import TechnicianJobsPage from './pages/TechnicianJobsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/client/home" element={<ClientHomePage />} />
      <Route path="/client/explore" element={<TechnicianExplorePage />} />
      <Route path="/client/profile" element={<ClientProfilePage />} />
      <Route path="/technician/home" element={<TechnicianHomePage />} />
      <Route path="/technician/profile" element={<TechnicianProfilePage />} />
      <Route
        path="/technician/public-profile"
        element={<TechnicianPublicProfilePage />}
      />
      <Route
        path="/technician/clients"
        element={<TechnicianClientSearchPage />}
      />
      <Route path="/technician/jobs" element={<TechnicianJobsPage />} />
    </Routes>
  )
}

export default App