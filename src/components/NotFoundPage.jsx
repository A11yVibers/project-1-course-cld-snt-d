import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="not-found-page" id="main-content">
      <h1>Page not found</h1>
      <p>We couldn&rsquo;t find what you were looking for.</p>
      <Link to="/" className="btn btn--primary">
        Back to the course catalog
      </Link>
    </main>
  )
}
