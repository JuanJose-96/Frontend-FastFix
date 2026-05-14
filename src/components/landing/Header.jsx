function Header() {
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId)

        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <header className="landing-header">
            <div className="landing-header__inner">
                <div className="landing-header__brand">FastFix</div>

                <nav className="landing-header__nav">
                    <button
                        type="button"
                        className="landing-header__link"
                        onClick={() => scrollToSection('about')}
                    >
                        ¿Quiénes somos?
                    </button>

                    <button
                        type="button"
                        className="landing-header__link"
                        onClick={() => scrollToSection('what-is-fastfix')}
                    >
                        ¿Por qué FastFix?
                    </button>

                    <button
                        type="button"
                        className="landing-header__link"
                        onClick={() => scrollToSection('sectors')}
                    >
                        Tipos de sectores
                    </button>
                </nav>
            </div>
        </header>
    )
}

export default Header