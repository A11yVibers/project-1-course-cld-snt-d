export default function Header({ onNavigateHome, crumb }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={onNavigateHome} type="button">
        <span className="brand-mark" aria-hidden="true">&#x1F3DB;</span>
        <span className="brand-text">
          <span className="brand-name">Historia</span>
          <span className="brand-tagline">History, taught as a journey</span>
        </span>
      </button>
      {crumb && (
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={onNavigateHome} className="breadcrumb-link">
            Catalog
          </button>
          <span className="breadcrumb-sep" aria-hidden="true">/</span>
          <span className="breadcrumb-current">{crumb}</span>
        </nav>
      )}
    </header>
  )
}
