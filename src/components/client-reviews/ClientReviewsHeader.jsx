function ClientReviewsHeader() {
    return (
        <section className="client-reviews-header">
            <p className="client-reviews-header__eyebrow">Área del cliente</p>

            <h1 className="client-reviews-header__title">Mis reseñas</h1>

            <p className="client-reviews-header__description">
                Aquí puedes ver los técnicos a los que ya has reseñado. La lista aparece
                ordenada del rating más alto al más bajo según la valoración que tú les has dado.
            </p>
        </section>
    )
}

export default ClientReviewsHeader