import Header from '../components/landing/Header'
import HeroSection from '../components/landing/HeroSection'
import AboutSection from '../components/landing/AboutSection'
import WhatIsFastFixSection from '../components/landing/WhatIsFastFixSection'
import SectorsSection from '../components/landing/SectorsSection'
import '../styles/landing.css'

function LandingPage() {
    return (
        <div className="landing-page">
            <Header />
            <main>
                <HeroSection />
                <AboutSection />
                <WhatIsFastFixSection />
                <SectorsSection />
            </main>
        </div>
    )
}

export default LandingPage