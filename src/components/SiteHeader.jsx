import { Link } from 'react-router-dom'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">&#9776;</span>
        <span className="brand-text">
          <span className="brand-title">Antiquarian</span>
          <span className="brand-subtitle">History, examined</span>
        </span>
      </Link>
      <nav className="site-nav">
        <Link to="/">Catalog</Link>
      </nav>
    </header>
  )
}
