import { Link, useLocation } from 'react-router-dom'

export default function SiteHeader() {
  const location = useLocation()
  const onCatalog = location.pathname === '/'

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark" aria-hidden="true">&#9779;</span>
          <span className="brand__text">
            <span className="brand__name">Chronicle</span>
            <span className="brand__tagline">History, taught deeply</span>
          </span>
        </Link>
        {!onCatalog && (
          <nav aria-label="Primary">
            <Link to="/" className="btn btn--ghost site-header__back">
              &larr; All courses
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
